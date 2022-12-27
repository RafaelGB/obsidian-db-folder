import { HSL } from "obsidian";

export function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

export function grey(value: number) {
  const reference = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  };

  return reference[value as keyof typeof reference];
}

/**
 * Transform a string to a valid HSL color or return a default color if the string is not valid
 * expected string format: `hsl(0-360, 0-100%, 0-100%)`
 * I.E.: 
 * str `hsl(5, 60%, 20%)` returns {h: 5, s: 60, l: 20}
 * @param str 
 * @returns @type {HSL} object
 */
export function castStringtoHsl(str: string): HSL {
  if (!str) {
    return { h: 0, s: 0, l: 0 };
  }

  const hslRegex = /^hsl\((\d{1,15}),\s*(\d{1,15})%,\s*(\d{1,15})%\)$/;
  const match = str.match(hslRegex);
  if (match) {
    const [, h, s, l] = match;
    return { h: parseInt(h), s: parseInt(s), l: parseInt(l) };
  }
  return { h: 0, s: 0, l: 0 };
}

/**
 * Transform a HSL object to a valid string
 * @param hsl 
 * @returns 
 */
export function castHslToString(hsl: HSL): string {
  return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
}

/**
 * Get the contrast color for a given HSL color based on the luminosity of the color
 * @param hslStringified 
 * @returns 
 */
export function contrastColor(hslStringified: string): string {
  const hsl = castStringtoHsl(hslStringified);
  if (hsl.l > 50) {
    return 'black';
  }
  return 'white';
}