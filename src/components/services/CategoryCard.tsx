import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    _count?: {
      services: number;
    };
  };
  className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link href={`/services?category=${category.slug}`}>
      <Card
        className={cn(
          "h-full transition-all hover:shadow-md hover:border-primary/50",
          className
        )}
      >
        <CardHeader>
          <CardTitle className="text-lg">{category.name}</CardTitle>
          {category._count && (
            <p className="text-sm text-muted-foreground">
              {category._count.services}{" "}
              {category._count.services === 1 ? "service" : "services"}
            </p>
          )}
        </CardHeader>
        {category.description && (
          <CardContent>
            <CardDescription>{category.description}</CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
