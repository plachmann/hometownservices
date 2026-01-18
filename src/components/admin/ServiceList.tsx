"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  isSubcontracted: boolean;
  categoryId: string;
  displayOrder: number;
  _count: {
    inquiries: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  services: Service[];
}

interface ServiceListProps {
  categories: Category[];
  onAddService: () => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onMoveService?: (serviceId: string, direction: "up" | "down") => void;
  onManageCategories?: () => void;
}

export default function ServiceList({
  categories,
  onAddService,
  onEditService,
  onDeleteService,
  onMoveService,
  onManageCategories,
}: ServiceListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your services organized by category
          </p>
        </div>
        <div className="flex gap-2">
          {onManageCategories && (
            <Button variant="outline" onClick={onManageCategories}>
              Manage Categories
            </Button>
          )}
          <Button onClick={onAddService}>Add Service</Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No categories found. Create a category first to add services.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {category.services.length} service{category.services.length !== 1 ? "s" : ""}
                  </span>
                </CardTitle>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {category.services.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No services in this category yet.
                  </p>
                ) : (
                  <div className="divide-y">
                    {category.services.map((service, serviceIndex) => (
                      <div
                        key={service.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{service.name}</span>
                            {service.isSubcontracted && (
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full shrink-0">
                                Subcontracted
                              </span>
                            )}
                            {service._count.inquiries > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full shrink-0">
                                {service._count.inquiries} inquir{service._count.inquiries !== 1 ? "ies" : "y"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {service.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            /{service.slug}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {onMoveService && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMoveService(service.id, "up")}
                                disabled={serviceIndex === 0}
                                aria-label="Move up"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMoveService(service.id, "down")}
                                disabled={serviceIndex === category.services.length - 1}
                                aria-label="Move down"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditService(service)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteService(service)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
