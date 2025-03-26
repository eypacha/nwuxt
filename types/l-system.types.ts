export interface LSystemRules {
  [key: string]: string;
}

export interface RandomGenerator {
  random: () => number;
}

export interface LSystemParams {
  angle: number;
  lengthReduction: number;
  randomness: number;
  [key: string]: any; // For any additional params
}

export interface DrawState {
  x: number;
  y: number;
  angle: number;
  length: number;
  colorIndex: number;
}