"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import Fuse from "fuse.js";
import { SearchableService, fuseOptions } from "@/lib/search";

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchableService[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  services: SearchableService[];
}

export function SearchProvider({ children, services }: SearchProviderProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [fuse, setFuse] = useState<Fuse<SearchableService> | null>(null);

  // Initialize Fuse.js when services change
  useEffect(() => {
    if (services.length > 0) {
      setFuse(new Fuse(services, fuseOptions));
    }
  }, [services]);

  // Search when query changes
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Debounce search
    const timer = setTimeout(() => {
      const searchResults = fuse.search(query, { limit: 8 });
      setResults(searchResults.map((r) => r.item));
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, fuse]);

  // Open dropdown when query is entered
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query]);

  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handleSetIsOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedIndex(-1);
    }
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery: handleSetQuery,
        results,
        isLoading,
        isOpen,
        setIsOpen: handleSetIsOpen,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
