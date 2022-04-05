export const frontMatterKey = 'database-plugin';

export const basicFrontmatter = [
    '---',
    '',
    `${frontMatterKey}: basic`,
    '',
    '---',
    '',
    '',
  ].join('\n');

  export function hasFrontmatterKey(data: string) {
    if (!data) return false;
  
    const match = data.match(/---\s+([\w\W]+?)\s+---/);
  
    if (!match) {
      return false;
    }
  
    if (!match[1].contains(frontMatterKey)) {
      return false;
    }
  
    return true;
  }