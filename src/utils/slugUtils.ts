/**
 * Utility function to create URL-safe slugs by removing special characters and accents
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug without special characters
 */
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD') // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[&]/g, 'et') // Replace & with 'et'
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

/**
 * Normalize an existing slug to ensure it's URL-safe
 * @param slug - The slug to normalize
 * @returns A normalized URL-safe slug
 */
export const normalizeSlug = (slug: string): string => {
    return createSlug(slug);
};
