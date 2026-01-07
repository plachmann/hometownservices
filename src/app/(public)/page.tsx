import Link from "next/link";
import prisma from "@/lib/prisma";
import CategoryGrid from "@/components/services/CategoryGrid";
import { Button } from "@/components/ui/button";

async function getCategories() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Trusted Partner for Home Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            From construction to maintenance, we provide professional home
            improvement services you can count on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg">Browse Services</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Service Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of home improvement and maintenance services
              organized by category.
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Contact us today for a free consultation and quote on your next home
            improvement project.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Request a Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
