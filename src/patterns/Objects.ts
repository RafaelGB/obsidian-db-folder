/**
 * Update an object from a partial object with the same type.
 * @param obj 
 * @param updates 
 * @returns a copy of the object with the updates applied.
 */
export function updateFromPartial<T>(obj: T, updates: Partial<T>): T {
    return { ...obj, ...updates };
}