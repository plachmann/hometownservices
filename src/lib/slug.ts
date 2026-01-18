/**
 * Slug generation utilities for services and categories
 */

/**
 * Generate a URL-friendly slug from a name
 * @param name - The name to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/[^\w-]/g, "") // Remove non-alphanumeric characters (except hyphens)
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Ensure a slug is unique by appending a number if necessary
 * @param slug - The base slug to check
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug (either the original or with a number appended)
 */
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 2;
  let uniqueSlug = `${slug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Generate a unique slug from a name, checking against existing slugs
 * @param name - The name to convert
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique URL-friendly slug
 */
export function generateUniqueSlug(name: string, existingSlugs: string[]): string {
  const baseSlug = generateSlug(name);
  return ensureUniqueSlug(baseSlug, existingSlugs);
}
