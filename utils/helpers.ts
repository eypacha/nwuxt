// Función para convertir de hexadecimal a RGB
const hexToRgb = function(hex: string): string {
  // Remover el '#' si está presente
  hex = hex.replace('#', '');
  
  // Extraer los componentes R, G, B del color hexadecimal
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  let hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return hex;
}

function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`; // Retorna el color en formato RGB
}

// Función para ajustar el color
const adjustColor = function(color: string, factor: number): string {
  // Si el color está en formato hexadecimal, convertir a RGB
  if (color.startsWith('#')) {
    color = hexToRgb(color);
  }

  // Extraer los componentes R, G, B del color original
  const match = color.match(/\d+/g);
  if (!match) return color;
  
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);

  // Calcular los nuevos componentes R, G, B multiplicando por el factor
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);

  // Asegurarse de que los valores estén dentro del rango 0-255
  const finalR = clamp(newR, 0, 255);
  const finalG = clamp(newG, 0, 255);
  const finalB = clamp(newB, 0, 255);

  // Formatear el nuevo color en formato 'rgb(r, g, b)'
  const adjustedColor = `rgb(${finalR}, ${finalG}, ${finalB})`;

  return adjustedColor;
}

// Función auxiliar para asegurar que el valor esté dentro de un rango dado
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface Rule {
  symbol: string;
  newSymbolChars: string;
  odds: number;
}

interface ParseRulesResult {
  rules: Rule[];
  error: string | null;
}

function parseRules(rulesString: string): ParseRulesResult {
  const rules: Rule[] = [];
  let error: string | null = null;

  // Dividir el string por líneas
  const lines = rulesString.trim().split('\n');

  lines.forEach(line => {
    if (line.trim() === '') return;
  
    // Separar el symbol, newSymbolChars y odds usando expresiones regulares
    const match = line.match(/^([A-Za-z]+)\s*=\s*([A-Za-z\-+\[\]]*)\s*\[(\d+(\.\d+)?)\]?\s*$/);
    if (match) {
      const symbol = match[1];
      const newSymbolChars = match[2] === '' ? '' : match[2] || symbol; // Usar '' si newSymbolChars es vacío, de lo contrario, usar el symbol
      const odds = match[3] ? parseFloat(match[3]) : 1; // Si no se especifica odds, se asume 1

      // Crear el objeto de regla y agregarlo al array de reglas
      rules.push({ symbol, newSymbolChars, odds });
    } else {
      const parts = line.split('=');
      if (parts.length === 2) {
        const symbol = parts[0].trim();
        const newSymbolChars = parts[1].trim();
        const odds = 1; // Asumir odds como 1 si no están especificados

        rules.push({ symbol, newSymbolChars, odds });
      } else {
        error = `Error parsing line: "${line}"`;
        return { rules, error };
      }
    }
  });

  const symbolMap = new Map<string, number>();
  rules.forEach(rule => {
    if (!symbolMap.has(rule.symbol)) {
      symbolMap.set(rule.symbol, 0);
    }
    symbolMap.set(rule.symbol, (symbolMap.get(rule.symbol) || 0) + rule.odds);
  });

  symbolMap.forEach((totalOdds, symbol) => {
    if (totalOdds !== 1) {
      error = `Symbol "${symbol}" odds do not sum to 1`;
      return { rules, error };
    }
  });

  return { rules, error };
}

interface Helpers {
  adjustColor: (color: string, factor: number) => string;
  hslToHex: (h: number, s: number, l: number) => string;
  parseRules: (rulesString: string) => ParseRulesResult;
}

export default {
  adjustColor,
  hslToHex,
  parseRules
} as Helpers;