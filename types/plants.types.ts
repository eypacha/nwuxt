// Color types
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

// Range with min and max values
export interface Range<T> {
  min: T;
  max: T;
}

// Either a fixed length or a range
export type Length = number | Range<number>;

// Color can be specified as hex string or as HSL range
export type Color = string | Range<HSLColor>;

// Rule for L-system productions
export interface Rule {
  symbol: string;
  odds: number;
  newSymbolChars: string;
}

// Branch configuration
export interface Branch {
  length: Length;
  angle: number;
  width?: number;
  widthFalloff?: number;
  color: Color;
}

// Leaf configuration
export interface Leaf {
  type: number;
  repeat: number;
  width?: number;
  length?: number;
  color: Color;
}

// Plant definition (consolidating the existing Plant and PlantDefinition interfaces)
export interface Plant {
  name: string;
  axiom: string;
  rules: Rule[];
  iterations: number;
  variability: number;
  branchs: Branch;
  leaves: Leaf;
}

// Alias for compatibility with existing code
export type PlantDefinition = Plant;