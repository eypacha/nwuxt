export interface Rule {
  symbol: string;
  newSymbolChars: string;
  odds: number;
}

export interface LengthConfig {
  min: number;
  max: number;
}

export interface ColorConfig {
  hue?: number | { min: number; max: number };
  saturation?: number | { min: number; max: number };
  lightness?: number | { min: number; max: number };
  [key: string]: any;
}

export interface BranchConfig {
  angle?: number;
  length: number | LengthConfig;
  widthFalloff?: number;
  color: ColorConfig | string;
}

export interface PlantDefinition {
  axiom: string;
  rules: Rule[];
  branchs: BranchConfig;
  leaves: {
    color: ColorConfig | string;
  };
  variability?: number;
}

export interface LSystemParams {
  axiom: string;
  rules: Record<string, string>;
  angle: number;
  iterations: number;
  initialLength: number;
  lengthReduction: number;
  randomness: number;
}

export interface RandomGenerator {
  random: () => number;
  randomInRange?: (min: number, max: number) => number;
  [key: string]: any;
}