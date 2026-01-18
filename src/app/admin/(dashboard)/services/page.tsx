"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import ServiceList from "@/components/admin/ServiceList";
import ServiceForm from "@/components/admin/ServiceForm";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import CategoryManager from "@/components/admin/CategoryManager";

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

export default function ServicesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Service form state
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category manager state
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to fetch services",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch services",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setEditingService(null);
    setIsServiceFormOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleServiceSubmit = async (data: {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    isSubcontracted: boolean;
    categoryId: string;
  }) => {
    setIsSubmitting(true);
    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "Success",
          description: editingService
            ? "Service updated successfully"
            : "Service created successfully",
        });
        setIsServiceFormOpen(false);
        setEditingService(null);
        await fetchServices();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to save service",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        await fetchServices();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete service",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveService = async (serviceId: string, direction: "up" | "down") => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });

      const result = await res.json();

      if (result.success) {
        await fetchServices();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to reorder service",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder service",
      });
    }
  };

  // Get flat list of categories for the form dropdown
  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading services...</div>
      </div>
    );
  }

  return (
    <>
      <ServiceList
        categories={categories}
        onAddService={handleAddService}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
        onMoveService={handleMoveService}
        onManageCategories={() => setIsCategoryManagerOpen(true)}
      />

      <ServiceForm
        open={isServiceFormOpen}
        onOpenChange={setIsServiceFormOpen}
        categories={categoryOptions}
        initialData={
          editingService
            ? {
                id: editingService.id,
                name: editingService.name,
                slug: editingService.slug,
                description: editingService.description,
                imageUrl: editingService.imageUrl || "",
                isSubcontracted: editingService.isSubcontracted,
                categoryId: editingService.categoryId,
              }
            : null
        }
        onSubmit={handleServiceSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
        warningMessage={
          serviceToDelete && serviceToDelete._count.inquiries > 0
            ? `This service has ${serviceToDelete._count.inquiries} associated inquiry/inquiries. They will be preserved but unlinked from this service.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <CategoryManager
        open={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        onCategoriesChange={fetchServices}
      />
    </>
  );
}
