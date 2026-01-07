import Fuse, { IFuseOptions } from "fuse.js";

export interface SearchableService {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryName: string;
  categorySlug: string;
}

export const fuseOptions: IFuseOptions<SearchableService> = {
  // Keys to search in, weighted by importance
  keys: [
    { name: "name", weight: 2 },
    { name: "description", weight: 1 },
    { name: "categoryName", weight: 0.5 },
  ],
  // Fuzzy matching threshold (0 = exact match, 1 = match anything)
  threshold: 0.3,
  // Include matches for highlighting
  includeMatches: true,
  // Include score for sorting
  includeScore: true,
  // Minimum characters before search activates
  minMatchCharLength: 2,
  // Use extended search for more flexibility
  useExtendedSearch: false,
  // Ignore location for better fuzzy matching
  ignoreLocation: true,
};

export function createSearchIndex(services: SearchableService[]): Fuse<SearchableService> {
  return new Fuse(services, fuseOptions);
}

export function searchServices(
  fuse: Fuse<SearchableService>,
  query: string,
  limit: number = 10
): SearchableService[] {
  if (!query.trim()) {
    return [];
  }

  const results = fuse.search(query, { limit });
  return results.map((result) => result.item);
}
