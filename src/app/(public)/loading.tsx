import CategoryCardSkeleton from "@/components/services/CategoryCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-6 w-1/2 mx-auto bg-gray-100 rounded animate-pulse mb-8" />
          <div className="flex gap-4 justify-center">
            <div className="h-11 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 w-36 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-96 mx-auto bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
