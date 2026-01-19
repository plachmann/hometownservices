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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Your Trusted Partner for{" "}
            <span className="text-primary">Home Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            From construction to maintenance, we provide professional home
            improvement services you can count on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Browse Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
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
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Contact us today for a free consultation and quote on your next home
            improvement project.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
              Request a Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
