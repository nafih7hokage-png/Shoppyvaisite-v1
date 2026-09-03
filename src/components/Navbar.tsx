import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  PackageCheck,
  X,
  Sparkles,
  Headphones,
  Shirt,
  Apple,
  Home,
  Sparkle,
  Dumbbell,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { Currency } from "../types";
import { CATEGORIES } from "../data/mockData";
import { formatPrice } from "../utils/currency";

interface NavbarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  ordersCount: number;
  currency: Currency;
  onToggleCurrency: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenFilterDrawer?: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Apple: <Apple className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Sparkle: <Sparkle className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
};

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartSubtotal,
  wishlistCount,
  ordersCount,
  currency,
  onToggleCurrency,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenFilterDrawer,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
              Vai Deal
            </span>
            <span className="truncate">
              Use code{" "}
              <strong className="font-bold underline decoration-white/50">
                VAI20
              </strong>{" "}
              for 20% off! Free express delivery over{" "}
              {currency === "BDT" ? "৳5,000" : "$50"}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-medium">
            <button
              onClick={onToggleCurrency}
              className="flex items-center gap-1.5 bg-black/15 hover:bg-black/25 px-2 py-0.5 rounded-full transition-colors cursor-pointer text-xs"
              title="Change Currency"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currency === "BDT" ? "৳ BDT" : "$ USD"}</span>
            </button>
            <button
              onClick={onOpenOrders}
              className="hidden sm:flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSelectCategory("all");
            onSearchChange("");
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Shoppy
              </span>
              <span className="text-xl font-extrabold tracking-tight text-orange-600">
                vai
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              Apnar Trusted Shop
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div
            className={`relative flex items-center transition-all duration-200 rounded-xl border ${
              isSearchFocused
                ? "border-orange-500 ring-3 ring-orange-500/15 shadow-sm bg-white"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search earbuds, sneakers, honey, hoodie..."
              className="w-full py-2.5 pl-3 pr-9 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Filter Toggle */}
          {onOpenFilterDrawer && (
            <button
              onClick={onOpenFilterDrawer}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}

          {/* Orders History Icon */}
          <button
            onClick={onOpenOrders}
            className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-sm cursor-pointer"
            title="View My Orders"
          >
            <PackageCheck className="w-5 h-5 text-slate-600" />
            <span>Orders</span>
            {ordersCount > 0 && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
            />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl shadow-sm transition-all duration-200 cursor-pointer group"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900 group-hover:ring-orange-600">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                Cart
              </span>
              <span className="text-xs font-bold text-white">
                {formatPrice(cartSubtotal, currency)}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50">
          <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all products on Shoppyvai..."
            className="w-full py-2 pl-2.5 pr-8 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-slate-400 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-orange-600 text-white shadow-xs font-semibold"
                      : "bg-white text-slate-700 border border-slate-200/80 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/30"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-5 h-5 rounded-md object-cover shrink-0 border border-black/10"
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
