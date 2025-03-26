// Define types for color definitions
type HSLRange = {
  min: { h: number; s: number; l: number };
  max: { h: number; s: number; l: number };
};

type ColorDef = string | HSLRange;

// Define type for seeded random generator
type SeededRandom = {
  random: () => number;
};

// Helper function to get color regardless of format
export function getColorFromPlant(colorDef: ColorDef, seededRnd?: SeededRandom): string {
  if (!seededRnd) return '#21b325'; // Default green if no random generator
  
  if (typeof colorDef === 'string') {
    return colorDef; // It's a hex color
  } else if (colorDef.min && colorDef.max) {
    // It's an HSL range, take a random value
    const h = seededRnd.random() * (colorDef.max.h - colorDef.min.h) + colorDef.min.h;
    const s = seededRnd.random() * (colorDef.max.s - colorDef.min.s) + colorDef.min.s;
    const l = seededRnd.random() * (colorDef.max.l - colorDef.min.l) + colorDef.min.l;
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return '#21b325'; // Default green
}