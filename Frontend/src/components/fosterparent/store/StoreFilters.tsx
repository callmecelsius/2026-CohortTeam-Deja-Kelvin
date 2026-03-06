import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ProductCategoryDto } from "../../../../types/inventoryType";

// The sort options available to the user
export type SortOption = "name-asc" | "name-desc" | "price-low" | "price-high" | "stock-low" | "stock-high";

//props
interface StoreFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  categories: ProductCategoryDto[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function StoreFilters({
  searchText,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
  sortBy,
  onSortChange,
}: StoreFiltersProps) {
  // Convert the selected category ID to a string for the Select component
  const selectValue =
    selectedCategoryId === null ? "all" : String(selectedCategoryId);

  function handleCategorySelect(value: string) {
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(Number(value));
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category dropdown */}
      <Select value={selectValue} onValueChange={handleCategorySelect}>
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort dropdown */}
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="price-low">Price (Low to High)</SelectItem>
          <SelectItem value="price-high">Price (High to Low)</SelectItem>
          <SelectItem value="stock-low">Stock (Low to High)</SelectItem>
          <SelectItem value="stock-high">Stock (High to Low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
