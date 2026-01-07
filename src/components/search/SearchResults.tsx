"use client";

import { cn } from "@/lib/utils";
import { SearchableService } from "@/lib/search";

interface SearchResultsProps {
  results: SearchableService[];
  isLoading: boolean;
  query: string;
  selectedIndex: number;
  onResultClick: (slug: string) => void;
  onResultHover: (index: number) => void;
}

export default function SearchResults({
  results,
  isLoading,
  query,
  selectedIndex,
  onResultClick,
  onResultHover,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div
        id="search-results"
        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 p-4"
      >
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <svg
            className="animate-spin h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Searching...
        </div>
      </div>
    );
  }

  if (query.trim() && results.length === 0) {
    return (
      <div
        id="search-results"
        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 p-4"
      >
        <p className="text-sm text-muted-foreground text-center">
          No services found for &quot;{query}&quot;
        </p>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Try a different search term or{" "}
          <a href="/services" className="text-primary hover:underline">
            browse all services
          </a>
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div
      id="search-results"
      role="listbox"
      className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <ul className="divide-y">
        {results.map((service, index) => (
          <li
            key={service.id}
            role="option"
            aria-selected={selectedIndex === index}
            className={cn(
              "px-4 py-3 cursor-pointer transition-colors",
              selectedIndex === index
                ? "bg-primary/10"
                : "hover:bg-muted"
            )}
            onClick={() => onResultClick(service.slug)}
            onMouseEnter={() => onResultHover(index)}
          >
            <div className="font-medium text-sm">
              <HighlightedText text={service.name} query={query} />
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {service.categoryName}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
