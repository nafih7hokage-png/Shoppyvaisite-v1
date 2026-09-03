import React from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Product, Currency } from "../types";
import { formatPrice } from "../utils/currency";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: Currency;
  onMoveToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onExploreProducts: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onMoveToCart,
  onRemoveFromWishlist,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Wishlist
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} {items.length === 1 ? "product" : "products"}{" "}
                saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Your wishlist is empty
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Save your favorite items here to review them later or add them
                to your cart!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Discover Items
              </button>
            </div>
          ) : (
            items.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-orange-600">
                      {prod.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {prod.name}
                    </h5>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {formatPrice(prod.price, currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onMoveToCart(prod);
                      onRemoveFromWishlist(prod);
                    }}
                    className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(prod)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
