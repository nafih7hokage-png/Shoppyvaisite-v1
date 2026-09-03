import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check, Zap } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedVariant?: string) => void;
  onBuyNow: (product: Product, selectedVariant?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const defaultVariant = product.variants?.options[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, defaultVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, defaultVariant);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const badgeColorMap: Record<string, string> = {
    'Best Seller': 'bg-amber-500 text-white',
    Hot: 'bg-rose-500 text-white',
    'Flash Deal': 'bg-purple-600 text-white',
    Organic: 'bg-emerald-600 text-white',
    New: 'bg-blue-600 text-white',
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-orange-300/80 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs ${
                badgeColorMap[product.badge] || 'bg-orange-500 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-extrabold bg-rose-600 text-white px-1.5 py-0.5 rounded-md shadow-xs">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs transition-all hover:scale-110 z-10 cursor-pointer"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-500 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-xs transition-transform hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[11px] font-semibold text-orange-600 tracking-wide uppercase">
              {product.category}
            </span>
            <span className="text-[10px] font-medium text-emerald-600">
              In Stock ({product.stockCount})
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {product.variants && (
            <p className="text-[11px] text-slate-400 mt-1">
              {product.variants.name}: {product.variants.options.length} options
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-base font-extrabold text-slate-900">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-slate-400">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>
        </div>

        {/* Dual Call-To-Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 hover:border-orange-300'
            }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Buy Now (Instant Checkout)"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
