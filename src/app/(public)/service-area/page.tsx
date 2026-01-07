import prisma from "@/lib/prisma";
import ServiceAreaMap from "@/components/map/ServiceAreaMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Service Area - Hometown Services",
  description: "View our service area and coverage radius for home improvement services.",
};

export default async function ServiceAreaPage() {
  const settings = await getSiteSettings();

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Area</h1>
          <p className="text-gray-600">
            Service area information is not available at this time. Please contact us for details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Service Area</h1>
          <p className="text-gray-600">
            We proudly serve customers within a {settings.serviceAreaMiles}-mile radius
            of our location.
          </p>
        </div>

        {/* Map */}
        <Card className="mb-8">
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <ServiceAreaMap
              latitude={Number(settings.serviceAreaLat)}
              longitude={Number(settings.serviceAreaLng)}
              radiusMiles={settings.serviceAreaMiles}
              companyName={settings.companyName}
            />
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                Coverage Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary mb-2">
                {settings.serviceAreaMiles} Miles
              </p>
              <CardDescription>
                Our service technicians travel within this radius to serve our customers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                Not in Our Area?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Even if you&apos;re outside our standard service area, please reach out. We may
                be able to accommodate special requests for larger projects.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to discuss your project? We&apos;re here to help!
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Us Today</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
