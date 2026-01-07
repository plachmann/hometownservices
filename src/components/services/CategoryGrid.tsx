import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    services: number;
  };
}

interface CategoryGridProps {
  categories: Category[];
  emptyMessage?: string;
}

export default function CategoryGrid({
  categories,
  emptyMessage = "No categories found.",
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
