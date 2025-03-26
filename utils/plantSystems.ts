/**
 * Collection of L-System parameters for different plant types
 */

export interface LSystemRule {
  predecessor: string;
  successor: string;
  probability?: number;
}

export interface LSystemParams {
  name: string;
  description?: string;
  axiom: string;
  rules: LSystemRule[];
  angle: number;
  stepSize?: number;
  stochasticVariation?: number;
  defaultColor?: string;
}

// Collection of predefined plant systems
export const plantSystems: LSystemParams[] = [
  {
    name: "Simple Bush",
    description: "A basic bush-like structure",
    axiom: "F",
    rules: [
      { predecessor: "F", successor: "FF+[+F-F-F]-[-F+F+F]" }
    ],
    angle: 25,
    stepSize: 5
  },
  {
    name: "Fractal Tree",
    description: "A simple binary tree structure",
    axiom: "X",
    rules: [
      { predecessor: "X", successor: "F+[[X]-X]-F[-FX]+X" },
      { predecessor: "F", successor: "FF" }
    ],
    angle: 22.5,
    stepSize: 4
  },
  {
    name: "Fern",
    description: "Fern-like plant structure",
    axiom: "X",
    rules: [
      { predecessor: "X", successor: "F-[[X]+X]+F[+FX]-X" },
      { predecessor: "F", successor: "FF" }
    ],
    angle: 25,
    stepSize: 2
  },
  {
    name: "Wild Grass",
    description: "Grass-like structure with randomness",
    axiom: "F",
    rules: [
      { predecessor: "F", successor: "F[+F]F[-F]F", probability: 0.8 },
      { predecessor: "F", successor: "F[+F]F", probability: 0.2 }
    ],
    angle: 25,
    stepSize: 5,
    stochasticVariation: 0.2
  }
];

// Get a plant system by name
export const getPlantSystem = (name: string): LSystemParams | undefined => {
  return plantSystems.find(system => system.name === name);
};

// Get a list of plant names for selection
export const getPlantNames = (): string[] => {
  return plantSystems.map(system => system.name);
};
