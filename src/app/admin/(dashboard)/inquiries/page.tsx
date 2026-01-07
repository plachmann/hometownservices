"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "NEW" | "READ" | "RESPONDED" | "ARCHIVED";
  createdAt: string;
  service: { id: string; name: string } | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = ["ALL", "NEW", "READ", "RESPONDED", "ARCHIVED"] as const;

export default function InquiriesPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      params.set("page", currentPage.toString());

      const response = await fetch(`/api/admin/inquiries?${params}`);
      const data = await response.json();

      if (data.success) {
        setInquiries(data.data.inquiries);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [selectedStatus, currentPage]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: status as Inquiry["status"] } : null));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">
          Manage contact form submissions
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedStatus(status);
              setCurrentPage(1);
            }}
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedStatus === "ALL" ? "All Inquiries" : `${selectedStatus} Inquiries`}
            </CardTitle>
            <CardDescription>
              {pagination?.total || 0} total inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No inquiries found
              </p>
            ) : (
              <div className="space-y-2">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id
                        ? "bg-primary/10 border border-primary"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{inquiry.name}</span>
                        <StatusBadge status={inquiry.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {inquiry.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-muted-foreground">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiry Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInquiry ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <label className="text-xs text-muted-foreground">Phone</label>
                    <p>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedInquiry.phone}
                      </a>
                    </p>
                  </div>
                )}
                {selectedInquiry.service && (
                  <div>
                    <label className="text-xs text-muted-foreground">Service</label>
                    <p>{selectedInquiry.service.name}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-muted-foreground">Message</label>
                  <p className="whitespace-pre-wrap text-sm">
                    {selectedInquiry.message}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="NEW">NEW</option>
                    <option value="READ">READ</option>
                    <option value="RESPONDED">RESPONDED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                  >
                    Delete Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select an inquiry to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
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
