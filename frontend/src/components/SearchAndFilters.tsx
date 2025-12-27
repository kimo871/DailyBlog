import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Button } from './ui/button';

export type SortOption = 'newest' | 'oldest' | 'comments' | 'expiring';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: SearchAndFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 bg-background border-border focus:border-primary"
          />
          {searchQuery && (
            // <button
            //   onClick={() => onSearchChange('')}
            //   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            // >
            //   <X className="h-4 w-4" />
            // </button>
            <Button variant="outline" size="lg" asChild onClick={() => onSearchChange('')}>
                Search
              </Button>
          )}
        </div>
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing results for "<span className="font-medium text-foreground">{searchQuery}</span>"
        </p>
      )}
    </div>
  );
}
