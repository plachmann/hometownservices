import ServiceCard from "./ServiceCard";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSubcontracted: boolean;
  category?: {
    name: string;
    slug: string;
  };
}

interface ServiceListProps {
  services: Service[];
  showCategory?: boolean;
  emptyMessage?: string;
}

export default function ServiceList({
  services,
  showCategory = false,
  emptyMessage = "No services found.",
}: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}
