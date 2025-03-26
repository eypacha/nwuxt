// Type definitions
interface LSystemRules {
  [key: string]: string;
}

interface RandomGenerator {
  random: () => number;
}

interface LSystemParams {
  angle: number;
  lengthReduction: number;
  randomness: number;
  [key: string]: any; // For any additional params
}

interface DrawState {
  x: number;
  y: number;
  angle: number;
  length: number;
  colorIndex: number;
}

// Generate L-System string after n iterations
export function generateLSystem(
  axiom: string, 
  rules: LSystemRules, 
  iterations: number
): string {
  let result = axiom;
  
  for (let i = 0; i < iterations; i++) {
    let newResult = '';
    for (let j = 0; j < result.length; j++) {
      const char = result[j];
      newResult += rules[char] || char;
    }
    result = newResult;
  }
  
  return result;
}

// Draw a plant based on L-System string
export function drawPlant(
  lSystemString: string, 
  x: number, 
  y: number, 
  length: number, 
  angle: number, 
  initialAngle: number, 
  seededRnd: RandomGenerator, 
  params: LSystemParams, 
  colors: string[], 
  pixelSize: number, 
  ctx: CanvasRenderingContext2D
): void {
  const stack: DrawState[] = [];
  let currentX = x;
  let currentY = y;
  let currentAngle = initialAngle - 90; // Start upward
  let currentLength = length;
  let currentColorIndex = 1; // Start with dark green
  
  for (let i = 0; i < lSystemString.length; i++) {
    const char = lSystemString[i];
    
    switch (char) {
      case 'F':
        // Calculate new position
        const radians = currentAngle * Math.PI / 180;
        const randomFactor = 1 + (seededRnd.random() * 2 - 1) * params.randomness;
        const newX = currentX + Math.cos(radians) * currentLength * randomFactor;
        const newY = currentY + Math.sin(radians) * currentLength * randomFactor;
        
        // Draw a pixelated line
        const steps = Math.max(
          Math.abs(newX - currentX), 
          Math.abs(newY - currentY)
        ) / (pixelSize / 2);
        
        for (let s = 0; s <= steps; s++) {
          const px = currentX + (newX - currentX) * (s / steps);
          const py = currentY + (newY - currentY) * (s / steps);
          drawPixel(px, py, currentColorIndex, colors, pixelSize, ctx);
        }
        
        currentX = newX;
        currentY = newY;
        break;
        
      case '+':
        // Turn right with some randomness
        const rightTurn = params.angle + (seededRnd.random() * 10 - 5);
        currentAngle += rightTurn;
        break;
        
      case '-':
        // Turn left with some randomness
        const leftTurn = params.angle + (seededRnd.random() * 10 - 5);
        currentAngle -= leftTurn;
        break;
        
      case '[':
        // Save state
        stack.push({
          x: currentX,
          y: currentY,
          angle: currentAngle,
          length: currentLength,
          colorIndex: currentColorIndex
        });
        
        currentLength *= params.lengthReduction;
        currentColorIndex = Math.min(currentColorIndex + 1, colors.length - 1);
        break;
        
      case ']':
        // Restore state
        if (stack.length > 0) {
          const state = stack.pop()!;
          currentX = state.x;
          currentY = state.y;
          currentAngle = state.angle;
          currentLength = state.length;
          currentColorIndex = state.colorIndex;
        }
        break;
    }
  }
}

// Draw a large pixel (for 8-bit effect)
function drawPixel(
  x: number, 
  y: number, 
  colorIndex: number, 
  colors: string[], 
  pixelSize: number, 
  ctx: CanvasRenderingContext2D
): void {
  if (!ctx) return;
  
  const color = colorIndex > 0 ? colors[colorIndex] : colors[1];
  ctx.fillStyle = color;
  ctx.fillRect(
    Math.floor(x / pixelSize) * pixelSize, 
    Math.floor(y / pixelSize) * pixelSize, 
    pixelSize, 
    pixelSize
  );
}