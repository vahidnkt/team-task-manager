import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "antd";
import { useDebounce } from "../../hooks/useDebounce";
import { cn } from "../../utils/helpers";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showClearButton?: boolean;
  initialValue?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceMs = 300,
  className,
  size = "md",
  showClearButton = true,
  initialValue = "",
  disabled = false,
  value,
  onChange,
}) => {
  const [internalQuery, setInternalQuery] = useState(initialValue);
  const query = value !== undefined ? value : internalQuery;
  const debouncedQuery = useDebounce(query, debounceMs);

  // Call onSearch when debounced query changes
  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (onChange) {
        onChange(e);
      } else {
        setInternalQuery(inputValue);
      }
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    if (onChange) {
      const clearEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(clearEvent);
    } else {
      setInternalQuery("");
    }

    if (onClear) {
      onClear();
    }
  }, [onChange, onClear]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        prefix={<Search className="h-4 w-4" />}
        suffix={
          showClearButton && query && !disabled ? (
            <button
              onClick={handleClear}
              className="flex items-center justify-center hover:bg-gray-100 rounded-full p-1 transition-colors"
              type="button"
            >
              <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          ) : undefined
        }
        disabled={disabled}
        className={cn(sizeClasses[size])}
      />
    </div>
  );
};

// Advanced search input with filters
interface AdvancedSearchInputProps extends Omit<SearchInputProps, "onSearch"> {
  onSearch?: (query: string, filters: SearchFilters) => void;
  filters?: SearchFilter[];
  showFilters?: boolean;
}

interface SearchFilter {
  id: string;
  label: string;
  type: "select" | "date" | "multi-select";
  options?: Array<{ value: string; label: string }>;
  value?: string | string[];
}

interface SearchFilters {
  [key: string]: string | string[];
}

export const AdvancedSearchInput: React.FC<AdvancedSearchInputProps> = ({
  onSearch,
  filters = [],
  showFilters = true,
  ...props
}) => {
  const [query, setQuery] = useState(props.initialValue || "");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const debouncedQuery = useDebounce(query, props.debounceMs || 300);

  // Call onSearch when query or filters change
  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery, searchFilters);
    }
  }, [debouncedQuery, searchFilters, onSearch]);

  const handleFilterChange = (filterId: string, value: string | string[]) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearAllFilters = () => {
    setSearchFilters({});
    setQuery("");
  };

  const activeFiltersCount = Object.values(searchFilters).filter(
    (value) => value && (Array.isArray(value) ? value.length > 0 : value !== "")
  ).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <SearchInput
          {...props}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />

        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              "flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors",
              activeFiltersCount > 0
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && filters.length > 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {filter.type === "select" && (
                  <select
                    value={searchFilters[filter.id] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "multi-select" && (
                  <div className="space-y-2">
                    {filter.options?.map((option) => {
                      const isSelected = Array.isArray(searchFilters[filter.id])
                        ? searchFilters[filter.id].includes(option.value)
                        : false;

                      return (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const currentFilterValue =
                                searchFilters[filter.id];
                              const currentValues = Array.isArray(
                                currentFilterValue
                              )
                                ? currentFilterValue
                                : [];

                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter(
                                    (v: string) => v !== option.value
                                  );

                              handleFilterChange(filter.id, newValues);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
