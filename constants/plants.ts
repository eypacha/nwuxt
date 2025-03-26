import type { Plant } from '../types/plants.types';

export const PLANTS: Plant[] = [
    {
      name: 'Triple adaptive shrub',
      axiom: 'L',
      rules: [
        { symbol: 'L', odds: 0.33, newSymbolChars: 'F[+L]F[-L]+L'},
        { symbol: 'L', odds: 0.33, newSymbolChars: 'F[-L]F[-L]+L'},
        { symbol: 'L', odds: 0.34, newSymbolChars: 'F[-L]F+L'},
        { symbol: 'F', odds: 0.8, newSymbolChars: 'FF' },
        { symbol: 'F', odds: 0.1, newSymbolChars: 'F' },
        { symbol: 'F', odds: 0.1, newSymbolChars: '' },
      ],
      iterations: 8,
      variability: 0.7,
      branchs: {
        length: { min: 1.2, max: 2.5 },
        angle: 22.5,
        color: {
          min: { h: 50, s: 34, l: 5 }, 
          max: { h: 60, s: 40, l: 10 } 
        }
      },
      leaves: {
        type: 3,
        repeat: 1,
        color: {
          min: { h: 80, s: 100, l: 0 }, 
          max: { h: 90, s: 100, l: 50 } 
        }
      },
    },
    {
      name: 'Twiggy weed',
      axiom: 'X',
      rules: [
        { symbol: 'F', odds: 1, newSymbolChars: 'FF' },
        { symbol: 'X', odds: 1, newSymbolChars:'F[-XL]F[-X]+X' },
      ],
      iterations: 8,
      variability: 0.4,
      branchs: {
        length: { min: 1.2, max: 1.6 },
        angle: 22.5,
        color: '#780707'
      },
      leaves: {
        type: 3,
        repeat: 1,
        color: {
          min: { h: 270, s: 13, l: 56 }, 
          max: { h: 290, s: 17, l: 62 } 
        }
      },
    },
    {
      name: 'Branching fern',
      axiom: 'F',
      rules: [
        { symbol: 'F', odds: 1, newSymbolChars: 'F[+X]F[-X]X' },
        { symbol: 'X', odds: 1, newSymbolChars:'F[+L]F[-L]L' },
      ],
      iterations: 4,
      variability: 0.4,
      branchs: {
        length: { min: 10, max: 12 },
        angle: 22.5,
        color: '#000000',
        width: 30
      },
      leaves: {
        type: 0,
        repeat: 3,
        color: '#C71f40'
      },
    },
    {
      name: 'Fuzzy weed',
      axiom: 'X',
      rules: [
        { symbol: 'F', odds: 1, newSymbolChars: 'FF' },
        { symbol: 'X', odds: .5, newSymbolChars: 'F-[[X]+XL]+F[+FX]-X' },
        { symbol: 'X', odds: .5, newSymbolChars: 'F-[[X]+X]+F[+F++X]-X' },
      ],
      iterations: 7,
      variability: 0.4,
      branchs: {
        length: { min: 2, max: 2.3 },
        angle: 22.5,
        color: '#0000'
      },
      leaves: {
        type: 3,
        repeat: 1,
        color: '#B38C00'
      },
    },
    {
      name: 'Binary three',
      axiom: 'X',
      rules: [
        { symbol: 'X', odds: 1, newSymbolChars: 'F[-FXL][+FXL]' },
        { symbol: 'L', odds: 1, newSymbolChars: '' },
      ],
      iterations: 7,
      variability: 0,
      branchs: {
        length: 50,
        width: 7,
        widthFalloff: 0.5,
        angle: 15,
        color: '#0000'
      },
      leaves: {
        type: 1,
        width: 3,
        length: 3,
        repeat: 1,
        color: '#000088'
      },
    },
    {
      name: 'Sierpinsky',
      axiom: '-F',
      rules: [
        { symbol: 'F', odds: 1, newSymbolChars: '++X--F--X++' },
        { symbol: 'X', odds: 1, newSymbolChars: '--F++X++F--L' },
      ],
      iterations: 7,
      variability: 0,
      branchs: {
        length: 14,
        width: 7,
        widthFalloff: 0,
        angle: 30,
        color: '#0000'
      },
      leaves: {
        type: 1,
        width: 4,
        length: 3,
        repeat: 1,
        color: '#0890D4'
      },
    },
    {
      name: 'Snowflake',
      axiom: '[F--F--F]+[F--F--F]',
      rules: [
        { symbol: 'F', odds: 1, newSymbolChars: 'F+F--F+F' },
      ],
      iterations: 6,
      variability: 0,
      branchs: {
        length: 5,
        width: 15,
        widthFalloff: 0,
        angle: 60,
        color: '#000080'
      },
      leaves: {
        type: 0,
        width: 4,
        length: 3,
        repeat: 1,
        color: '#B38C00'
      },
    },
  ];