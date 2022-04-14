import { DatabaseCore } from "helpers/Constants";

/**
 * Wrap the classname of css elements
 * @param className 
 * @returns 
 */
export function c(className: string): string {
    return `${DatabaseCore.FRONTMATTER_KEY}__${className}`;
  }