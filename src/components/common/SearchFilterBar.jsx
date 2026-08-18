import React from "react";
import { Search, X, RotateCcw, Filter } from "lucide-react";
import { Button } from "./Button";

export const SearchFilterBar = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Search library titles, authors, ISBN...",
  showSearch = true,
  filters = [],
  totalMatches,
  totalMatchesLabel = "matching results",
  isFilterActive = false,
  onResetAll,
  className = "",
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-2.5 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-2.5">
        {/* Search input */}
        {showSearch && (
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all font-mono"
            />
            {searchValue && (
              <button
                type="button"
                onClick={onSearchClear || (() => onSearchChange(""))}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-1.5">
              <label
                htmlFor={`filter-${f.id}`}
                className="text-[11px] font-mono text-slate-500 whitespace-nowrap hidden sm:inline"
              >
                {f.label}:
              </label>
              <select
                id={`filter-${f.id}`}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#1E3A8A] font-mono cursor-pointer"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {isFilterActive && onResetAll && (
            <Button
              size="xs"
              variant="ghost"
              onClick={onResetAll}
              className="text-slate-500 hover:text-slate-800"
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results status counter */}
      {totalMatches !== undefined && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>
              Found <strong className="text-slate-800">{totalMatches}</strong>{" "}
              {totalMatchesLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
