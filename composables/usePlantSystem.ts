import { ref } from 'vue';
import type { Ref } from 'vue';
import { createRandom } from '../utils/random';
import { generateLSystem, drawPlant } from '../utils/l-system';
import { getColorFromPlant } from '../utils/colors';
import type {
  Rule,
  LengthConfig,
  ColorConfig,
  BranchConfig,
  PlantDefinition,
  LSystemParams,
  RandomGenerator
} from '../types/plant-system';

export function usePlantSystem() {
  // State
  const currentSeed: Ref<string> = ref('bytebloom');
  const iterations: Ref<number> = ref(5);
  const lSystemParams: Ref<LSystemParams> = ref({} as LSystemParams);
  
  // Add the missing method if needed
  let seededRnd: RandomGenerator = createRandom(currentSeed.value);
  // If you need randomInRange, add it here
  if (!seededRnd.randomInRange) {
    seededRnd.randomInRange = (min: number, max: number): number => {
      return min + seededRnd.random() * (max - min);
    };
  }
  
  // Colors for 8-bit palette
  const pixelSize: number = 4;
  const colors: string[] = [
    '#071821', // dark blue (background)
    '#0b4c2e', // dark green 
    '#0f8512', // medium green
    '#21b325', // light green
    '#5bfa3f'  // bright green
  ];
  
  // Update seed when user inputs a new one
  const updateSeed = (seed: string): RandomGenerator => {
    currentSeed.value = seed;
    seededRnd = createRandom(seed);
    
    // Add randomInRange method if missing
    if (!seededRnd.randomInRange) {
      seededRnd.randomInRange = (min: number, max: number): number => {
        return min + seededRnd.random() * (max - min);
      };
    }
    
    return seededRnd;
  };
  
  // Generate a new random seed
  const updateRandomGenerator = (): string => {
    const randomSeed: string = Math.random().toString(36).substring(2, 8);
    updateSeed(randomSeed);
    return randomSeed;
  };
  
  // Update plant system when selected from dropdown
  const updatePlantSystem = (
    plant: PlantDefinition, 
    ctx: CanvasRenderingContext2D | null, 
    canvasWidth: number, 
    canvasHeight: number
  ): void => {
    if (!plant) return;
    
    // Create rules map from plant.ts format
    const rulesMap: Record<string, string> = {};
    
    plant.rules.forEach(rule => {
      // Rules mapping logic...
      if (!rulesMap[rule.symbol]) {
        rulesMap[rule.symbol] = '';
      }
      
      if (rule.odds === 1) {
        rulesMap[rule.symbol] = rule.newSymbolChars;
      } else {
        const randomRoll = seededRnd.random();
        let accumulatedOdds = 0;
        
        const rulesForSymbol = plant.rules.filter(r => r.symbol === rule.symbol);
        for (const r of rulesForSymbol) {
          accumulatedOdds += r.odds;
          if (randomRoll <= accumulatedOdds) {
            rulesMap[rule.symbol] = r.newSymbolChars;
            break;
          }
        }
      }
    });

    // Configure L-system parameters
    lSystemParams.value = {
      axiom: plant.axiom,
      rules: rulesMap,
      angle: plant.branchs.angle || 22.5,
      iterations: iterations.value,
      initialLength: typeof plant.branchs.length === 'number' 
        ? plant.branchs.length 
        : (plant.branchs.length.min + plant.branchs.length.max) / 2,
      lengthReduction: plant.branchs.widthFalloff || 0.85,
      randomness: plant.variability || 0.2
    };

    // Update colors based on plant.ts format
    updateColors(plant);
    
    // Generate the plant if we have context
    if (ctx) generateNewPlant(ctx, canvasWidth, canvasHeight);
  };
  
  // Add this function to convert ColorConfig to ColorDef
  const convertToColorDef = (colorConfig: ColorConfig | string): any => {
    // If it's already a string, return it
    if (typeof colorConfig === 'string') {
      return colorConfig;
    }
    
    // Create an HSL range object that matches the expected format
    return {
      min: {
        h: typeof colorConfig.hue === 'number' ? colorConfig.hue : 
           (colorConfig.hue?.min || 90),
        s: typeof colorConfig.saturation === 'number' ? colorConfig.saturation : 
           (colorConfig.saturation?.min || 50),
        l: typeof colorConfig.lightness === 'number' ? colorConfig.lightness : 
           (colorConfig.lightness?.min || 30)
      },
      max: {
        h: typeof colorConfig.hue === 'number' ? colorConfig.hue : 
           (colorConfig.hue?.max || 120),
        s: typeof colorConfig.saturation === 'number' ? colorConfig.saturation : 
           (colorConfig.saturation?.max || 80),
        l: typeof colorConfig.lightness === 'number' ? colorConfig.lightness : 
           (colorConfig.lightness?.max || 60)
      }
    };
  };

  // Then update the updateColors function
  const updateColors = (plant: PlantDefinition): void => {
    if (!plant || !seededRnd) return;
    
    colors[1] = getColorFromPlant(convertToColorDef(plant.branchs.color), seededRnd);
    colors[4] = getColorFromPlant(convertToColorDef(plant.leaves.color), seededRnd);
  };
  
  // Generate and draw a new plant
  const generateNewPlant = (
    ctx: CanvasRenderingContext2D, 
    canvasWidth: number, 
    canvasHeight: number
  ): void => {
    if (!seededRnd || !ctx) return;
    
    clearCanvas(ctx, canvasWidth, canvasHeight);
    
    const params = lSystemParams.value;
    
    const lSystemString = generateLSystem(
      params.axiom,
      params.rules,
      params.iterations
    );
    
    drawPlant(
      lSystemString,
      canvasWidth / 2,
      canvasHeight - 20,
      params.initialLength,
      params.angle,
      0,
      seededRnd,
      params,
      colors,
      pixelSize,
      ctx
    );
  };
  
  // Clear canvas with transparent background
  const clearCanvas = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ): void => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
  };
  
  return {
    currentSeed,
    iterations,
    lSystemParams,
    updateSeed,
    updateRandomGenerator,
    updatePlantSystem,
    generateNewPlant,
    clearCanvas
  };
}