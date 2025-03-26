import {random} from './random.js';
import helpers from './helpers.js'
import {_PRESETS} from './presets.js'
import {PLANTS} from './plants.ts'

console.log('L-Systems Demo');

const $ = (el) => document.querySelector(el)

let _APP = null;

const SEASONS = {
  SPRING: 0,
  SUMMER: 1,
  AUTUMN: 2,
  WINTER: 3
}

let weather = {
  season: SEASONS.AUTUMN
}
let branches = [];
// Maceta
const pot = {
  radius: 50 + Math.random() * 30,
  height: 70 + Math.random() * 30,
  base: .6 + Math.random() * .4,
  ring: 4 + Math.random() * 10,
  deep: 15,
  ringHeight: 10 + Math.random() * 10,
  roundeness: 0,
  shape: Math.random() > .5 ? 'square' : 'rounded',
  color: `rgb(${Math.floor(Math.random()*180)+40},${Math.floor(Math.random()*180)+40},${Math.floor(Math.random()*180)+40})`
}

const floorHeight = 50

window.addEventListener('DOMContentLoaded', () => {
  
  $('#presets').max = PLANTS.length - 1
  loadPlant(0)

  _APP = new LSystemDemo();

  const inputs = document.querySelectorAll('.control');
  inputs.forEach(i => {
    i.onchange = () => {
      _APP.OnChange();
    };
  });

  window.addEventListener('resize', () => {
    _APP.OnChange();
  })

  $('#rules').oninput = () => {
    _APP.OnChange()
  };

  $('#presets').onchange = () => {
    loadPlant($('#presets').valueAsNumber)
    _APP.OnChange()
  };

  
});

function loadPlant(num) {

  const selectedPlant = PLANTS[num]; // Nombre más descriptivo

  function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = random.Random(); // Convert [0,1) to (0,1)
    while(v === 0) v = random.Random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function normalRandom(a, b) {
    let val;
    do {
        val = randn_bm() * (b - a) / 6 + (a + b) / 2;
    } while (val < a || val > b); // Keep within bounds

    return val;
  }

  function getValue(propiedad, defaultValue) {
    const properties = propiedad.split('.');

    let prop = selectedPlant;

    if (properties[0] === 'rules') {
      return prop.rules ?? defaultValue;
    }
    
    for (let i = 0; i < properties.length; i++) {
      if (prop && typeof prop === 'object') {
        prop = prop[properties[i]];
      } else {
        return defaultValue;
      }
    }
  
    if (prop && typeof prop === 'object') {
      if (prop.hasOwnProperty('min') && prop.hasOwnProperty('max')) {

        if (typeof prop.min === 'object' && typeof prop.max === 'object') {
          // Handle color ranges
          const h = normalRandom(prop.min.h, prop.max.h);
          const s = normalRandom(prop.min.s, prop.max.s);
          const l = normalRandom(prop.min.l, prop.max.l);
          const color = helpers.hslToHex(h, s, l);
          
          return color;
        } else if (prop.min < prop.max) {
          // Handle numeric ranges
          const num = normalRandom(prop.min, prop.max);
          return num;
        }

      }
  
      return prop.value ?? defaultValue;
    } else {
      return prop ?? defaultValue;
    }
  }

  $('#axiom').value = getValue('axiom');

  let rules = [];
  getValue('rules').forEach(rule => {
    rules.push(`${rule.symbol}=${rule.newSymbolChars}` + (rule.odds !== 1 ? ` [${rule.odds}]` : ''));
  });
  $('#rules').value = rules.join('\n');

  $('#iterations').value = getValue('iterations', 7);
  $('#variability').value = getValue('variability', 0.2);
  

  $('#branchColor').value = getValue('branchs.color');
  $('#branchLength').value = getValue('branchs.length', 7).toFixed(2);
  $('#branchWidth').value = getValue('branchs.width', 10);
  $('#branchWidthFalloff').value = getValue('branchs.widthFalloff', 0.5);
  $('#branchAngle').value = getValue('branchs.angle', 22.5);

  $('#leafType').value = getValue('leaves.type', 0);
  $('#leafWidth').value = getValue('leaves.width', 2);
  $('#leafLength').value = getValue('leaves.length', 5);
  $('#leafRepeat').value = getValue('leaves.repeat', 1);
  $('#leafColor').value = getValue('leaves.color', '#497a00');
}

function _RouletteSelection(rules) {
  const roll = random.Random();
  let sum = 0;
  for (let r of rules) {
    sum += r.odds;
    if (roll < sum) {
      return r;
    }
  }
  return rules[sortedParents.length - 1];
}

class LSystemDemo {
  constructor() {

    this._id = 0;
    this._SetupCanvas()
    this.OnChange()

  }

  _SetupCanvas() {

    this.canvas = document.getElementById("canvas");

    this.canvas.addEventListener('click', (event) => {

      // Obtener el tamaño visual del canvas
      const clientRect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / clientRect.width;
      const scaleY = this.canvas.height / clientRect.height;

      // Calcular las coordenadas correctas del clic
      const offsetX = (event.clientX - clientRect.left) * scaleX;
      const offsetY = (event.clientY - clientRect.top) * scaleY;

      for (let branch of branches) {
        const { x, y, width, height, params } = branch;
        if (
          offsetX >= x - width / 2 &&
          offsetX <= x + width / 2 &&
          offsetY >= y &&
          offsetY <= y + height
        ) {
          console.log("Rama clickeada:", branch.id);
          this.Chop(branch.id)
          break;
        }
      }
    });
  }

  OnChange() {
    this._UpdateFromUI();
    this._ApplyRules();

    this.Render()
  }

  Chop(branch) {
    // console.log(this._sentence.reduce((concat, obj) => concat + obj.symbol, ""))
    // console.log( this._sentence[branch])

    // Encontrar el índice del cierre del paréntesis que coincida con el último paréntesis no cerrado
    let closingIndex = -1;
    let count = 0;

    for (let i = branch; i < this._sentence.length; i++) {
      if (this._sentence[i].symbol === "[") {
        count++;
      } else if (this._sentence[i].symbol === "]") {
        count--;
        if (count === 0) {
          closingIndex = i;
          break;
        }
      }
    }

    // Construir la nueva sentencia después de eliminar los símbolos posteriores
    let newSentence = this._sentence.slice(0, branch + 1); // Mantener la rama hasta branch

    if (closingIndex !== -1) {
      // Añadir los símbolos antes del cierre del paréntesis
      for (let i = branch + 1; i <= closingIndex; i++) {
        newSentence.push(this._sentence[i]);
      }
    }
    
    this._sentence = newSentence;
    this.Render()
  }

  Render() {
    // When we see that this changed, stop rendering.
    this._id++;
    const iteratorID = this._id;
    this._totalAnimationTime = this._iterations * 20.0 / this._animationSpeed;
    this._previousRAF = null;
    this._animationTimeElapsed = this._totalAnimationTime;
    this._Animate(this._totalAnimationTime);
  }

  _UpdateFromUI() {
    // const preset = $('#presets').valueAsNumber;
    this._axiom = $('#axiom').value;

    const { rules, error } = helpers.parseRules($('#rules').value);

    if (error) {
      $('#rules').nextElementSibling.textContent = error;
      
      setTimeout(()=>{
        $('#rules').parentElement.classList.add('is-invalid');
      },100)

    } else {

      this._rules = rules;
      $('#rules').nextElementSibling.textContent = '';
      setTimeout(()=>{
        $('#rules').parentElement.classList.remove('is-invalid');
      },100)
    }

    this._animate = $('#animate').checked;
    this._animationSpeed = $('#animationSpeed').valueAsNumber;
    this._animationAgeSpeed = $('#animationAge').valueAsNumber;
    this._iterations = $('#iterations').valueAsNumber;
    this._season = $('#season').value;
    this._seed = $('#seed').value;
    this._variability = $('#variability').valueAsNumber;
    this._leafType = $('#leafType').valueAsNumber;
    this._leafLength = $('#leafLength').valueAsNumber;
    this._leafWidth = $('#leafWidth').valueAsNumber;
    this._leafColor = $('#leafColor').value;
    this._leafAlpha = $('#leafAlpha').value;
    this._leafRepeat = $('#leafRepeat').value;
    this._branchLength = $('#branchLength').valueAsNumber;
    this._branchWidth = $('#branchWidth').valueAsNumber;
    this._branchAngle = $('#branchAngle').valueAsNumber;
    this._branchColor = $('#branchColor').value;
    this._branchWidthFalloff = $('#branchWidthFalloff').valueAsNumber;
    random.Seed(this._seed);
  }

  _ApplyRulesToSentence(sentence) {
    const newSentence = [];
    for (let i = 0; i < sentence.length; i++) {
      const s = sentence[i];
  
      const matchingRules = this._rules.filter(rule => rule.symbol === s.symbol);
      if (matchingRules.length > 0) {
        const rule = _RouletteSelection(matchingRules);
        const newSymbols = rule.newSymbolChars.split('').map((c, index) => {
          let newAge;
          if (index === 0) {
            newAge = s.params.age;
          } else {
            newAge = s.params.age - 1;
          }
          return this._CreateParameterizedSymbol({symbol: c, params: {age: newAge}});
        });
        newSentence.push(...newSymbols);
      } else {
        newSentence.push(s);
      }
    }
    return newSentence;
  }

  _ApplyRules() {
    let cur = [...this._axiom.split('').map(c => this._CreateParameterizedSymbol({symbol: c}))];

    for (let i = 0; i < this._iterations; i++) {
      cur = this._ApplyRulesToSentence(cur);
    }
    this._sentence = cur;

    // let content = `<p><strong>Name:</strong> ${this._name}</p>`;
    // content += `<p><strong>Axiom:</strong> ${this._axiom}</p>`;
    //     content += `<p><strong>Rules:</strong></p><ul>`;
    //     this._rules.forEach(rule => {
    //       content += `<li>${rule.symbol} → ${rule.newSymbolChars}`;
    //       content += rule.odds !== 1 ? ` [${rule.odds}]` : '';
    //       content += `</li>`
    //     });
    //     content += `</ul><p><strong>String:</strong><br>${cur.map(el => el.symbol).join('')}</p>`;

    // $('#sentence').innerHTML = content;
    
  }

  _CreateParameterizedSymbol(c, params) {
    let symbol = c;
    if (!c.params) {
      c.params = {age: 0.0};
    }

    if (c.symbol == 'F') {
      const branchLengthMult = 1

      const randomLength = random.RandomRange(
          this._branchLength * (1 - this._variability),
          this._branchLength * (1 + this._variability));

      const branchLength = branchLengthMult * (randomLength);
c
      symbol.params = {...symbol.params, ...{branchLength: branchLength}};
      
    } else if (c.symbol == '+' || c.symbol == '-') {
      const baseAngle = this._branchAngle;
      const randomAngleMult = random.RandomRange(
          (1 - this._variability), (1 + this._variability))
      const finalAngle = baseAngle * randomAngleMult;

      symbol.params = {...symbol.params, ...{angle: finalAngle}};
    } else if (c.symbol == 'L' || c.symbol == 'B') {
      const leafWidth = random.RandomRange(
        this._leafWidth * (1 - this._variability),
        this._leafWidth * (1 + this._variability));
      const leafLength = random.RandomRange(
        this._leafLength * (1 - this._variability),
        this._leafLength * (1 + this._variability));
      symbol.params = {...symbol.params, ...{width: leafWidth, length: leafLength}};
    }

    return symbol;
  }

  _Animate(timeElapsed) {
    
    const canvas = this.canvas;
    canvas.width = 1024;
    canvas.height = 1024;
    const centerW = canvas.width / 2
        
    const ctx = canvas.getContext('2d');

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Piso
    ctx.fillStyle = 'rgb(170,170,170)';
    ctx.beginPath();
    ctx.fillRect(0, canvas.height-100, canvas.width, canvas.height)
    ctx.fill();
    ctx.transform(1, 0, 0, 1, centerW, canvas.height);

    // Separacion del suelo
    ctx.transform(1, 0, 0, 1, 0, -floorHeight);
    // Maceta
    ctx.fillStyle = pot.color
    ctx.transform(1, 0, 0, 1, 0, -pot.height);
    ctx.beginPath();
    ctx.moveTo(-pot.radius+(pot.ring/2),pot.ringHeight);
    const controlX = pot.radius*(pot.roundeness + 1)
    const controlY = (pot.height+pot.ringHeight) * pot.roundeness > 0 ? .5 : 0
    ctx.quadraticCurveTo(-controlX, controlY, -pot.radius * pot.base, pot.height);
    ctx.lineTo(pot.radius * pot.base, pot.height);
    ctx.quadraticCurveTo(controlX, controlY, pot.radius - pot.ring / 2, pot.ringHeight);
    ctx.closePath();
    ctx.fill();

    // Base
    if(pot.shape !== 'square') {
      ctx.beginPath();
      ctx.ellipse(0, pot.height, pot.radius * pot.base, pot.deep, 0, 0, 2 * Math.PI);
      ctx.fill()
    }
   
    // Borde top
    if(pot.shape == 'square') {
      ctx.beginPath();
      ctx.moveTo(-pot.radius, -pot.deep - pot.ring);
      ctx.lineTo(pot.radius, -pot.deep - pot.ring);
      ctx.lineTo(pot.radius+pot.ring, pot.deep + pot.ring);
      ctx.lineTo(-pot.radius-pot.ring, pot.deep + pot.ring);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = helpers.adjustColor(pot.color,1.1);
      ctx.fillRect(-pot.radius-pot.ring, pot.ring+pot.deep-1, (pot.radius+pot.ring) * 2 , pot.ringHeight);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, +pot.ringHeight, pot.radius, pot.deep, 0, 0, 2 * Math.PI);
      ctx.fillStyle = helpers.adjustColor(pot.color,1.1);
      ctx.fill();
      ctx.beginPath();
      ctx.fillRect(0 - pot.radius, 0, pot.radius * 2, pot.ringHeight);
      ctx.beginPath();
      ctx.ellipse(0, 0, pot.radius, pot.deep, 0, 0, 2 * Math.PI);
      ctx.fillStyle = pot.color;
      ctx.fill();

    }

    // Tierra
    if(pot.shape == 'square') {
      ctx.beginPath();
      ctx.moveTo(-pot.radius + pot.ring, -pot.deep);
      ctx.lineTo(pot.radius - pot.ring, -pot.deep);
      ctx.lineTo(pot.radius - pot.ring / 2, pot.deep - pot.ring / 2);
      ctx.lineTo(-pot.radius + pot.ring / 2, pot.deep - pot.ring / 2);
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, pot.radius - pot.ring, pot.deep - pot.ring/2, 0, 0, 2 * Math.PI);
    }
    ctx.fillStyle = '#312005';
    ctx.fill();
    
    for (let i = 0; i < this._sentence.length; i++) {
      this._sentence[i].params.age += timeElapsed * this._animationAgeSpeed;
    }

    this._RenderToContext(ctx);

  }

  _RenderToContext(ctx) { 


    const stateStack = [];

    const widthFactor = Math.max(0.0, (1.0 / (1.0 + Math.exp(-this._animationTimeElapsed / 10.0))) * 2 - 1);
    const widthByAge = this._branchWidth * Math.max(0.25, widthFactor);

    let currentState = {
      width: widthByAge,
    };

    const leafFactor = 1.0;
    const totalAgeFactor = Math.min(1.0, this._animationTimeElapsed / this._totalAnimationTime) ** 0.5;

    const getTransformedPoint = (x, y) => {
      const transform = ctx.getTransform();
      return {
          x: x * transform.a + y * transform.c + transform.e,
          y: x * transform.b + y * transform.d + transform.f
      };
    };

    branches = []

    for (let i = 0; i < this._sentence.length; i++) {
      const s = this._sentence[i];
      const c = s.symbol;
      const params = s.params;

      const ageFactor = Math.max(0.0, (1.0 / (1.0 + Math.exp(-params.age))) * 2 - 1);

      if (c == 'F') {

        ctx.fillStyle = this._branchColor;
        ctx.strokeStyle = this._branchColor;

        const w1 = currentState.width;
        currentState.width *= (1 - (1 - this._branchWidthFalloff) ** 3);
        currentState.width = Math.max(widthByAge * 0.25, currentState.width);
        const w2 = currentState.width;
        const l = params.branchLength * ageFactor;

        if (ageFactor > 0) {
          ctx.beginPath();
          ctx.moveTo(-w2 / 2, -l);
          ctx.lineTo(-w1 / 2, 1);
          ctx.lineTo(w1 / 2, 1);
          ctx.lineTo(w2 / 2, -l);
          ctx.lineTo(-w2 / 2, -l);
          ctx.closePath();
          ctx.fill();
  
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.moveTo(-w2 / 2, -l);
          ctx.lineTo(-w1 / 2, 0);
          ctx.closePath();
          ctx.stroke();
  
          ctx.beginPath();
          ctx.moveTo(w1 / 2, 0);
          ctx.lineTo(w2 / 2, -l);
          ctx.closePath();
          ctx.stroke();

          const { x, y } = getTransformedPoint(0, -l);

          branches.push({
            id: i,
            x,
            y,
            width: w2,
            height: l,
            params
          });
  
          ctx.transform(1, 0, 0, 1, 0, -l);
          ctx.globalAlpha = 1.0;
        }
      } else if (c == 'L' || c == 'B') {
        if (ageFactor > 0) {

          let leafColor = helpers.adjustColor(this._leafColor,(random.RandomRange(0.8,1.2)))

          if(c == 'B') leafColor = 'red'
          
          ctx.globalAlpha = this._leafAlpha;
  
          const _DrawLeaf = () => {

            ctx.save();

            if(this._season == SEASONS.WINTER) {
              
              if(random.Random() > .05) return ctx.restore()

            }

            ctx.fillStyle = leafColor;
            ctx.strokeStyle = leafColor;

            // if(this._season == SEASONS.SPRING) {

            //   if(random.Random() > .95) {
            //     ctx.fillStyle = fruitColor;
            //     ctx.strokeStyle = fruitColor;
            //   }

            // }

            
            if(this._season == SEASONS.AUTUMN)  {
              
              if(random.Random() > .9) {

                const { x: absX, y: absY } = getTransformedPoint(0, 0);
                const Y = ctx.canvas.height - floorHeight

                ctx.setTransform(1, 0, 0, 1, absX, Y);

                const canvasCenter = ctx.canvas.width / 2

                if (absX > canvasCenter-pot.radius - 10 && absX < canvasCenter+pot.radius + 10) {

                    if(random.Random() > .5){

                      if (random.Random() > .5) return ctx.restore()
                      ctx.translate(0, -pot.height-(pot.deep/2)); 
                      if (absX < canvasCenter - pot.radius + 30) return ctx.restore()
                      if (absX > canvasCenter + pot.radius - 30) return ctx.restore();
                    } else {
                      ctx.translate(0, 30); 
                    }

                } else {
                  ctx.translate(0, random.Random() * 50 - 25); 
                }

                
                ctx.rotate(random.Random() * 2 * Math.PI);
    
              }
            
            }

            
            ctx.scale(params.width * ageFactor * leafFactor, params.length * ageFactor * leafFactor);

            if (this._leafType == 0) {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(1, -1);
              ctx.lineTo(0, -4);
              ctx.lineTo(-1, -1);
              ctx.lineTo(0, 0);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            } else if (this._leafType == 1) {
              ctx.beginPath();
              ctx.arc(0, -2, 2, 0, 2 * Math.PI);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            } else if (this._leafType == 2) {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(1, -1);
              ctx.lineTo(1, -4);
              ctx.lineTo(0, -5);
              ctx.lineTo(-1, -4);
              ctx.lineTo(-1, -1);
              ctx.lineTo(0, 0);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.fillRect(0, 0, 0.25, -5);
            } else if (this._leafType == 3) {
              ctx.beginPath();
              ctx.arc(0, -2, 2, 0, 2 * Math.PI);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();
          }
  
          _DrawLeaf();
          if (this._leafRepeat > 1) {
            ctx.save();
            for (let r = 0; r < this._leafRepeat; r++) {
              ctx.rotate((r + 1) * 5 * Math.PI / 180);
              _DrawLeaf();
            }
            ctx.restore();
            ctx.save();
            for (let r = 0; r < this._leafRepeat; r++) {
              ctx.rotate(-(r + 1) * 5 * Math.PI / 180);
              _DrawLeaf();
            }
            ctx.restore();
          }
          ctx.globalAlpha = 1.0;
        }
      } else if (c == '+') {
        const a = params.angle;
        ctx.rotate(a * Math.PI / 180);
      } else if (c == '-') {
        const a = params.angle;
        ctx.rotate(-a * Math.PI / 180);
      } else if (c == '[') {
        ctx.save();
        stateStack.push({...currentState});
      } else if (c == ']') {
        ctx.restore();
        currentState = stateStack.pop();
      }
    }
  }
};
