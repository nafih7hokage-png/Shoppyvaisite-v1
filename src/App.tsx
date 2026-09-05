import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
  Check,
  X,
  Search,
  Filter,
} from 'lucide-react';
import {
  Product,
  CartItem,
  Order,
  Coupon,
  Currency,
} from './types';
import {
  INITIAL_PRODUCTS,
  AVAILABLE_COUPONS,
  CATEGORIES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ExpressBuyNowPage } from './components/ExpressBuyNowPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { formatPrice } from './utils/currency';
import { generateSecureId } from './utils/security';

export function App() {
  // Navigation View State: 'catalog' or 'buy-now'
  const [currentView, setCurrentView] = useState<'catalog' | 'buy-now'>('catalog');
  const [buyNowItem, setBuyNowItem] = useState<{
    product: Product;
    variant?: string;
    quantity: number;
  } | null>(null);

  // Main Data States
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState<Currency>('BDT'); // Default to BDT for Shoppyvai
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modals & Drawers States
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = generateSecureId('toast');
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Wishlist Check
  const isWishlisted = (product: Product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  // Filtered & Sorted Products (Ratings completely removed)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      // Max price
      if (p.price > maxPrice) return false;
      // In stock
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return 0; // 'featured' keeps original curated order
    });
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  // Add To Cart Handler
  const handleAddToCart = (product: Product, selectedVariant?: string, quantity: number = 1) => {
    const cartItemId = `${product.id}-${selectedVariant || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: cartItemId, product, quantity, selectedVariant }];
    });

    addToast(
      'success',
      'Added to Cart!',
      `${quantity}x ${product.name} added to your cart.`
    );
  };

  // Dedicated "Buy Now" Trigger -> Redirects to Express Checkout Sub-Page
  const handleTriggerBuyNow = (
    product: Product,
    selectedVariant?: string,
    quantity: number = 1
  ) => {
    setBuyNowItem({
      product,
      variant: selectedVariant || product.variants?.options[0],
      quantity,
    });
    setCurrentView('buy-now');
    setActiveProductModal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'Item Removed', 'Product removed from your cart.');
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    addToast('info', 'Cart Cleared', 'All items removed from your cart.');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    if (isWishlisted(product)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addToast('info', 'Wishlist Updated', `${product.name} removed from your saved items.`);
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('success', 'Saved to Wishlist!', `${product.name} added to your saved items.`);
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Coupon Handlers
  const handleApplyCoupon = (code: string): boolean => {
    const found = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
    if (!found) return false;

    if (cartSubtotal < found.minSpend) {
      addToast(
        'error',
        'Coupon Requirement',
        `Minimum spend for ${found.code} is ${formatPrice(found.minSpend, currency)}.`
      );
      return false;
    }

    setAppliedCoupon(found);
    addToast(
      'success',
      'Coupon Applied!',
      `${found.code} applied! You received ${found.discountPercent}% discount.`
    );
    return true;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('info', 'Coupon Removed', 'Discount coupon removed.');
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    addToast(
      'success',
      'Order Confirmed!',
      `Order #${newOrder.id} placed successfully! We will contact you soon.`
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(100);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Navigation Header with 'Shoppy vai' logo and Category images in pills */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          if (currentView === 'buy-now') setCurrentView('catalog');
          window.scrollTo({ top: 450, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView === 'buy-now') setCurrentView('catalog');
        }}
        cartCount={cartTotalItems}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlist.length}
        ordersCount={orders.length}
        currency={currency}
        onToggleCurrency={() =>
          setCurrency((c) => (c === 'BDT' ? 'USD' : 'BDT'))
        }
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenFilterDrawer={() => setIsMobileFilterOpen(true)}
      />

      {/* Main View: Either Dedicated "Buy Now" Checkout Sub-Page or Main Catalog */}
      {currentView === 'buy-now' && buyNowItem ? (
        <ExpressBuyNowPage
          product={buyNowItem.product}
          initialVariant={buyNowItem.variant}
          initialQuantity={buyNowItem.quantity}
          currency={currency}
          onBack={() => setCurrentView('catalog')}
          onOrderConfirmed={handleOrderPlaced}
        />
      ) : (
        <>
          {/* Hero Banner (only shown when not searching) */}
          {!searchQuery && (
            <HeroBanner
              onShopNow={(cat) => {
                if (cat) setSelectedCategory(cat);
                const catalogEl = document.getElementById('catalog-section');
                catalogEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              currency={currency}
              onCopyCoupon={(code) => {
                addToast('info', 'Coupon Copied', `${code} copied! Apply at cart checkout.`);
              }}
            />
          )}

          {/* Dedicated Category Showcase with Category Images & Names */}
          {!searchQuery && (
            <CategorySection
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const catalogEl = document.getElementById('catalog-section');
                catalogEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* Main Catalog & Filter Section */}
          <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 flex-1 w-full">
            {/* Catalog Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {selectedCategory === 'all'
                      ? searchQuery
                        ? `Results for "${searchQuery}"`
                        : 'Curated Products'
                      : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {filteredProducts.length}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Original quality products with instant delivery across Bangladesh
                </p>
              </div>

              {/* Sort By Dropdown & Filter toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Filter ({filteredProducts.length})</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | 'featured'
                          | 'price-asc'
                          | 'price-desc'
                          | 'discount'
                      )
                    }
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 shadow-xs cursor-pointer"
                  >
                    <option value="featured">Featured Deals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Layout Grid: Left Filters Sidebar (Desktop) + Right Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5 sticky top-36">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-orange-600" />
                      <span>Refine Catalog</span>
                    </span>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Categories Filter with Image & Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Category</label>
                    <div className="space-y-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                            selectedCategory === cat.id
                              ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200"
                            />
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {selectedCategory === cat.id && (
                            <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Price Range */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Max Budget</span>
                      <span className="font-mono font-bold text-orange-600">
                        {formatPrice(maxPrice, currency)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{formatPrice(10, currency)}</span>
                      <span>{formatPrice(100, currency)}</span>
                    </div>
                  </div>

                  {/* In-Stock Toggle */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">In-Stock Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="col-span-1 lg:col-span-9">
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
                    <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      No matching products found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      We couldn't find any products matching your active filters or search terms. Try adjusting or clearing filters!
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currency={currency}
                        isWishlisted={isWishlisted(product)}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
                        onBuyNow={(p, v) => handleTriggerBuyNow(p, v, 1)}
                        onQuickView={(p) => setActiveProductModal(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      )}

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories with Images in Mobile Drawer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Category</label>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-left ${
                        selectedCategory === cat.id
                          ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-6 h-6 rounded-md object-cover shrink-0 border border-slate-200"
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      {selectedCategory === cat.id && (
                        <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Max Budget</span>
                  <span className="font-mono font-bold text-orange-600">
                    {formatPrice(maxPrice, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              {/* In Stock */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md"
              >
                View {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Quick-View Modal */}
      <ProductModal
        product={activeProductModal}
        currency={currency}
        isWishlisted={activeProductModal ? isWishlisted(activeProductModal) : false}
        onClose={() => setActiveProductModal(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={(p, v, q) => handleTriggerBuyNow(p, v, q)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreProducts={() => {
          if (currentView === 'buy-now') setCurrentView('catalog');
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Standard Checkout Modal (from Cart) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        appliedCoupon={appliedCoupon}
        onOrderPlaced={(order) => {
          handleOrderPlaced(order);
          setCart([]);
          setAppliedCoupon(null);
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        currency={currency}
        onMoveToCart={(p) => handleAddToCart(p, p.variants?.options[0], 1)}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onExploreProducts={() => {
          if (currentView === 'buy-now') setCurrentView('catalog');
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currency={currency}
        onExploreProducts={() => {
          if (currentView === 'buy-now') setCurrentView('catalog');
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
