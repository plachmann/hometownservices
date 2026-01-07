import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  } catch {
    return null;
  }
}

async function getRelatedServices(categoryId: string, excludeId: string) {
  try {
    return await prisma.service.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
      },
      take: 3,
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name} - Hometown Services`,
    description: service.description.substring(0, 160),
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(
    service.categoryId,
    service.id
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li>
            <Link
              href="/services"
              className="text-muted-foreground hover:text-primary"
            >
              Services
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li>
            <Link
              href={`/services?category=${service.category.slug}`}
              className="text-muted-foreground hover:text-primary"
            >
              {service.category.name}
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-foreground font-medium">{service.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {service.category.name}
            </span>
            {service.isSubcontracted && (
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                Subcontracted
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {service.name}
          </h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="mt-8">
            <Link href={`/contact?service=${service.id}`}>
              <Button size="lg">Request a Quote</Button>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get Started Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ready to discuss your {service.name.toLowerCase()} project?
                Contact us for a free consultation.
              </p>
              <Link href={`/contact?service=${service.id}`} className="block">
                <Button className="w-full">Contact Us</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {relatedServices.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/services/${related.slug}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {related.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
