/**
 * Type definitions for L-Systems used in plant generation
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