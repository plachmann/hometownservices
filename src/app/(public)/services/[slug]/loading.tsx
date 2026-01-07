import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ServiceDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Skeleton */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              {i < 4 && <span className="text-muted-foreground">/</span>}
            </div>
          ))}
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-3">
            <div className="h-5 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="mt-8">
            <div className="h-11 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-3/4 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
