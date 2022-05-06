export const parseFrontmatterFieldsToString = (frontmatterFields: Record<string, any>): string => {
    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        array.push(`${key}: ${frontmatterFields[key]}`);
    });
    array.push(`---`);
    return array.join('\n');
}