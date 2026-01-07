import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import ServiceList from "@/components/services/ServiceList";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Services - Hometown Services",
  description: "Browse our comprehensive range of home improvement services including construction, plumbing, electrical, HVAC, roofing, flooring, and more.",
};

interface ServicesPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function getServices(categorySlug?: string) {
  try {
    const where = categorySlug
      ? { category: { slug: categorySlug } }
      : undefined;

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { category: { displayOrder: "asc" } },
        { displayOrder: "asc" },
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return services;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.serviceCategory.findUnique({
      where: { slug },
    });
  } catch {
    return null;
  }
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { category: categorySlug } = await searchParams;
  const [services, categories, currentCategory] = await Promise.all([
    getServices(categorySlug),
    getCategories(),
    categorySlug ? getCategoryBySlug(categorySlug) : null,
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentCategory ? currentCategory.name : "All Services"}
        </h1>
        {currentCategory?.description && (
          <p className="text-gray-600">{currentCategory.description}</p>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/services">
            <Button
              variant={!categorySlug ? "default" : "outline"}
              size="sm"
            >
              All
            </Button>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/services?category=${cat.slug}`}>
              <Button
                variant={categorySlug === cat.slug ? "default" : "outline"}
                size="sm"
              >
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Services List */}
      <Suspense fallback={<ServiceListSkeleton />}>
        <ServiceList services={services} showCategory={!categorySlug} />
      </Suspense>
    </div>
  );
}

function ServiceListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}
