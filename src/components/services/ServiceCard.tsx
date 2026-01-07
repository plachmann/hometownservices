import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
    description: string;
    isSubcontracted: boolean;
    category?: {
      name: string;
      slug: string;
    };
  };
  showCategory?: boolean;
  className?: string;
}

export default function ServiceCard({
  service,
  showCategory = false,
  className,
}: ServiceCardProps) {
  return (
    <Link href={`/services/${service.slug}`}>
      <Card
        className={cn(
          "h-full transition-all hover:shadow-md hover:border-primary/50",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            {service.isSubcontracted && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full shrink-0">
                Subcontracted
              </span>
            )}
          </div>
          {showCategory && service.category && (
            <p className="text-xs text-muted-foreground">{service.category.name}</p>
          )}
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">
            {service.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
