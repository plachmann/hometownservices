import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getServicesWithCategories() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        services: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const categories = await getServicesWithCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          View all services organized by category
        </p>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No services found. Run the seed command to populate the database.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {category.services.length} services
                  </span>
                </CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          {service.isSubcontracted && (
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                              Subcontracted
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        /{service.slug}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">
            Service editing is managed through the database seed file.
            <br />
            To modify services, update <code className="bg-muted px-1 rounded">prisma/seed.ts</code> and run{" "}
            <code className="bg-muted px-1 rounded">npm run db:seed</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
