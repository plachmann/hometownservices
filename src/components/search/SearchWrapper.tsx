"use client";

import { ReactNode, useEffect, useState } from "react";
import { SearchProvider } from "./SearchProvider";
import { SearchableService } from "@/lib/search";

interface SearchWrapperProps {
  children: ReactNode;
}

export default function SearchWrapper({ children }: SearchWrapperProps) {
  const [services, setServices] = useState<SearchableService[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const searchableServices: SearchableService[] = data.data.map(
            (service: {
              id: string;
              name: string;
              slug: string;
              description: string;
              category?: { name: string; slug: string };
            }) => ({
              id: service.id,
              name: service.name,
              slug: service.slug,
              description: service.description,
              categoryName: service.category?.name || "",
              categorySlug: service.category?.slug || "",
            })
          );
          setServices(searchableServices);
        }
      } catch (error) {
        console.error("Failed to fetch services for search:", error);
      }
    }
    fetchServices();
  }, []);

  return <SearchProvider services={services}>{children}</SearchProvider>;
}
