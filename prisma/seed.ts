import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Categories from data-model.md
const categories = [
  {
    name: "Construction & Contracting",
    slug: "construction-contracting",
    description:
      "General construction services, project management, and contracting work",
    displayOrder: 1,
  },
  {
    name: "Exterior & Roofing",
    slug: "exterior-roofing",
    description: "Siding, roofing, decks, and driveway installation services",
    displayOrder: 2,
  },
  {
    name: "Interior Finishing",
    slug: "interior-finishing",
    description:
      "Flooring, cabinets, trim work, and basement finishing services",
    displayOrder: 3,
  },
  {
    name: "Mechanical Systems",
    slug: "mechanical-systems",
    description: "Plumbing, electrical, and HVAC services",
    displayOrder: 4,
  },
  {
    name: "Outdoor & Specialty",
    slug: "outdoor-specialty",
    description: "Lawn care, pool installation, and general maintenance",
    displayOrder: 5,
  },
];

// Services organized by category slug
const servicesByCategory: Record<
  string,
  Array<{
    name: string;
    description: string;
    isSubcontracted: boolean;
    displayOrder: number;
  }>
> = {
  "construction-contracting": [
    {
      name: "Project Management",
      description:
        "Professional project oversight and coordination for residential and commercial construction projects. We handle scheduling, budgeting, and contractor coordination to ensure your project runs smoothly from start to finish.",
      isSubcontracted: false,
      displayOrder: 1,
    },
    {
      name: "Construction Contracting",
      description:
        "Full-service general contracting for new construction, additions, and major renovations. Our experienced team manages all aspects of your build with attention to quality and timeline.",
      isSubcontracted: false,
      displayOrder: 2,
    },
    {
      name: "Demolition",
      description:
        "Safe and efficient demolition services for interior and exterior structures. We handle permits, debris removal, and site preparation for your next project.",
      isSubcontracted: false,
      displayOrder: 3,
    },
    {
      name: "Framing",
      description:
        "Professional structural framing for new construction and additions. Our skilled framers ensure your project has a solid foundation built to code.",
      isSubcontracted: true,
      displayOrder: 4,
    },
  ],
  "exterior-roofing": [
    {
      name: "Siding",
      description:
        "Expert siding installation and repair for vinyl, fiber cement, wood, and other materials. Protect and beautify your home with quality exterior finishes.",
      isSubcontracted: true,
      displayOrder: 1,
    },
    {
      name: "Roofing",
      description:
        "Complete roofing services including new installation, replacement, and repairs. We work with asphalt shingles, metal roofing, and specialty materials.",
      isSubcontracted: true,
      displayOrder: 2,
    },
    {
      name: "Deck Construction",
      description:
        "Custom deck design and construction using composite, pressure-treated lumber, or exotic hardwoods. Extend your living space with a beautiful outdoor deck.",
      isSubcontracted: false,
      displayOrder: 3,
    },
    {
      name: "Driveway Installation",
      description:
        "Professional driveway installation including concrete, asphalt, and paver options. We handle grading, drainage, and finishing for lasting results.",
      isSubcontracted: false,
      displayOrder: 4,
    },
  ],
  "interior-finishing": [
    {
      name: "Flooring",
      description:
        "Expert flooring installation for hardwood, laminate, tile, vinyl, and carpet. Transform your space with beautiful, durable flooring solutions.",
      isSubcontracted: false,
      displayOrder: 1,
    },
    {
      name: "Cabinet Installation",
      description:
        "Professional kitchen and bathroom cabinet installation. We work with stock, semi-custom, and custom cabinetry to maximize your storage and style.",
      isSubcontracted: false,
      displayOrder: 2,
    },
    {
      name: "Trims & Doors",
      description:
        "Interior trim work including baseboards, crown molding, door installation, and window casings. Add the finishing touches that make your home complete.",
      isSubcontracted: false,
      displayOrder: 3,
    },
    {
      name: "Basement Finishing",
      description:
        "Complete basement finishing services including framing, drywall, flooring, and electrical. Convert unused space into functional living areas.",
      isSubcontracted: false,
      displayOrder: 4,
    },
  ],
  "mechanical-systems": [
    {
      name: "Plumbing",
      description:
        "Full-service plumbing for new construction, remodels, and repairs. Our licensed plumbers handle everything from fixtures to complete system installations.",
      isSubcontracted: true,
      displayOrder: 1,
    },
    {
      name: "Electrical",
      description:
        "Licensed electrical services for residential and commercial projects. From panel upgrades to complete wiring, we ensure safe, code-compliant installations.",
      isSubcontracted: true,
      displayOrder: 2,
    },
    {
      name: "HVAC",
      description:
        "Heating, ventilation, and air conditioning installation and service. Keep your home comfortable year-round with efficient HVAC systems.",
      isSubcontracted: true,
      displayOrder: 3,
    },
  ],
  "outdoor-specialty": [
    {
      name: "Lawn Care",
      description:
        "Regular lawn maintenance including mowing, trimming, fertilization, and seasonal cleanup. Keep your property looking its best all year.",
      isSubcontracted: false,
      displayOrder: 1,
    },
    {
      name: "Fiberglass Pool Installation",
      description:
        "Professional fiberglass pool installation with expert site preparation, plumbing, and finishing. Create your backyard oasis with a quality pool installation.",
      isSubcontracted: false,
      displayOrder: 2,
    },
    {
      name: "Maintenance",
      description:
        "General maintenance and handyman services for residential and commercial properties. We handle repairs, upkeep, and preventive maintenance.",
      isSubcontracted: false,
      displayOrder: 3,
    },
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Starting seed...");

  // Create categories
  console.log("Creating categories...");
  const createdCategories: Record<string, string> = {};

  for (const category of categories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    createdCategories[category.slug] = created.id;
    console.log(`  ✓ ${category.name}`);
  }

  // Create services
  console.log("Creating services...");
  for (const [categorySlug, services] of Object.entries(servicesByCategory)) {
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) {
      console.error(`  ✗ Category not found: ${categorySlug}`);
      continue;
    }

    for (const service of services) {
      const slug = slugify(service.name);
      await prisma.service.upsert({
        where: { slug },
        update: {
          ...service,
          slug,
          categoryId,
        },
        create: {
          ...service,
          slug,
          categoryId,
        },
      });
      console.log(`  ✓ ${service.name}`);
    }
  }

  // Create default site settings
  console.log("Creating site settings...");
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      serviceAreaLat: 40.7128, // Default: NYC coordinates (update for your area)
      serviceAreaLng: -74.006,
      serviceAreaMiles: 50,
      companyName: "Hometown Services",
      companyPhone: "(555) 123-4567",
      companyEmail: "info@hometownservices.net",
      companyAddress: "123 Main Street, Anytown, USA 12345",
    },
  });
  console.log("  ✓ Site settings created");

  // Create admin user
  console.log("Creating admin user...");
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
    },
  });
  console.log(`  ✓ Admin user '${adminUsername}' created`);

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
