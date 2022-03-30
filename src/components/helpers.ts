export const baseClassName = 'dbfolder';

export function noop() {}

export function c(className: string) {
  return `${baseClassName}__${className}`;
}