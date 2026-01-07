import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CategoryCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
