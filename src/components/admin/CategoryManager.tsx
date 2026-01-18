"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import CategoryForm from "./CategoryForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  _count: {
    services: number;
  };
}

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesChange: () => void;
}

export default function CategoryManager({
  open,
  onOpenChange,
  onCategoriesChange,
}: CategoryManagerProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCategorySubmit = async (data: { name: string; description: string }) => {
    setIsSubmitting(true);
    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "Success",
          description: editingCategory
            ? "Category updated successfully"
            : "Category created successfully",
        });
        setIsFormOpen(false);
        setEditingCategory(null);
        await fetchCategories();
        onCategoriesChange();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to save category",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        await fetchCategories();
        onCategoriesChange();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete category",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveCategory = async (categoryId: string, direction: "up" | "down") => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });

      const result = await res.json();

      if (result.success) {
        await fetchCategories();
        onCategoriesChange();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to reorder category",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder category",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-[700px] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle>Manage Categories</DialogTitle>
              <Button onClick={handleAddCategory} size="sm">
                Add Category
              </Button>
            </div>
            <DialogDescription>
              Create, edit, and organize your service categories.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No categories yet. Create your first category.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="p-3 border rounded-md bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{category.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            ({category._count.services})
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveCategory(category.id, "up")}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveCategory(category.id, "down")}
                          disabled={index === categories.length - 1}
                          aria-label="Move down"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={category._count.services > 0}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={
          editingCategory
            ? {
                id: editingCategory.id,
                name: editingCategory.name,
                description: editingCategory.description || "",
              }
            : null
        }
        onSubmit={handleCategorySubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        warningMessage={
          categoryToDelete && categoryToDelete._count.services > 0
            ? `This category has ${categoryToDelete._count.services} service(s). Please reassign them before deleting.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
