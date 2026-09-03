import React from "react";
import { Category } from "../types";

interface CategorySectionProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Browse Popular Categories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore quality handpicked collections with express delivery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 text-center cursor-pointer ${
                isActive
                  ? "bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20 shadow-sm"
                  : "bg-white border-slate-200/80 hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Category Image */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2.5 bg-slate-100 ring-2 ring-slate-100 group-hover:ring-orange-300 transition-all shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Category Name */}
              <span
                className={`text-xs font-bold leading-tight line-clamp-1 transition-colors ${
                  isActive
                    ? "text-orange-600"
                    : "text-slate-800 group-hover:text-orange-600"
                }`}
              >
                {cat.name}
              </span>

              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {cat.count} items
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
