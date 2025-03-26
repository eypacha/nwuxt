/**
 * Random utilities with seed support
 * This allows repeatable randomization by using the same seed value
 */

export class SeededRandom {
  private seed: number;
  private initialSeed: number;

  constructor(seed: number | string = Math.random() * 10000) {
    // Convert string seeds to numeric values
    if (typeof seed === 'string') {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      seed = Math.abs(hash);
    }
    
    this.initialSeed = seed as number;
    this.seed = this.initialSeed;
  }

  /**
   * Reset the random generator to its initial seed
   */
  reset(): void {
    this.seed = this.initialSeed;
  }

  /**
   * Get the current seed value
   */
  getSeed(): number {
    return this.initialSeed;
  }

  /**
   * Generate a random number between 0 (inclusive) and 1 (exclusive)
   */
  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generate a random integer between min (inclusive) and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random float between min (inclusive) and max (exclusive)
   */
  randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Pick a random item from an array
   */
  randomItem<T>(array: T[]): T {
    return array[this.randomInt(0, array.length - 1)];
  }

  /**
   * Shuffle an array using the Fisher-Yates (Knuth) shuffle algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Create a random generator with a specified seed
 * @param seed The seed value (number or string)
 */
export const createRandom = (seed?: number | string): SeededRandom => {
  return new SeededRandom(seed);
};

/**
 * Example usage:
 * 
 * // Create a seeded random generator
 * const rng = createRandom('myseed123');
 * 
 * // Generate random numbers
 * const randomValue = rng.random();
 * const randomInt = rng.randomInt(1, 10);
 * 
 * // Use the same seed to reproduce the same random sequence
 * const rng2 = createRandom('myseed123');
 * const sameRandomValue = rng2.random(); // Will be the same as randomValue
 */
