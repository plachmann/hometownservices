import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

async function getDashboardStats() {
  try {
    const [
      totalServices,
      totalCategories,
      newInquiries,
      totalInquiries,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.serviceCategory.count(),
      prisma.contactInquiry.count({ where: { status: "NEW" } }),
      prisma.contactInquiry.count(),
    ]);

    return {
      totalServices,
      totalCategories,
      newInquiries,
      totalInquiries,
    };
  } catch {
    return {
      totalServices: 0,
      totalCategories: 0,
      newInquiries: 0,
      totalInquiries: 0,
    };
  }
}

async function getRecentInquiries() {
  try {
    return await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        service: {
          select: { name: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [stats, recentInquiries] = await Promise.all([
    getDashboardStats(),
    getRecentInquiries(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Hometown Services website
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{stats.totalServices}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/services"
              className="text-sm text-primary hover:underline"
            >
              Manage services
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCategories}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-muted-foreground">
              Service categories
            </span>
          </CardContent>
        </Card>

        <Card className={stats.newInquiries > 0 ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <CardDescription>New Inquiries</CardDescription>
            <CardTitle className="text-3xl">
              {stats.newInquiries}
              {stats.newInquiries > 0 && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/inquiries?status=NEW"
              className="text-sm text-primary hover:underline"
            >
              View new inquiries
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Inquiries</CardDescription>
            <CardTitle className="text-3xl">{stats.totalInquiries}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/inquiries"
              className="text-sm text-primary hover:underline"
            >
              View all inquiries
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>Latest contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No inquiries yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{inquiry.name}</span>
                      <StatusBadge status={inquiry.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email}
                      {inquiry.service && ` • ${inquiry.service.name}`}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Link
                  href="/admin/inquiries"
                  className="text-sm text-primary hover:underline"
                >
                  View all inquiries
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    NEW: "bg-blue-100 text-blue-800",
    READ: "bg-gray-100 text-gray-800",
    RESPONDED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        styles[status as keyof typeof styles] || styles.NEW
      }`}
    >
      {status}
    </span>
  );
}
