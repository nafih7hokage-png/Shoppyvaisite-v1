import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { Currency } from "../types";
import { copyTextSecurely } from "../utils/security";

interface HeroBannerProps {
  onShopNow: (category?: string) => void;
  currency: Currency;
  onCopyCoupon?: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  currency,
  onCopyCoupon,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = async (code: string) => {
    if (onCopyCoupon) {
      onCopyCoupon(code);
    }

    const copied = await copyTextSecurely(code);
    if (copied) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-orange-950 to-slate-950 text-white shadow-xl">
        {/* Glow decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mega Launch Festival • Up to 50% Off</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Shob Kichu Ek Thikanay, <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Shoppyvai-er
              </span>{" "}
              Sathey!
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              Discover premium tech gadgets, street fashion, organic honey &
              pantry essentials, home comfort, and skincare with instant
              delivery across Bangladesh.
            </p>

            {/* Flash Sale Ticker */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-orange-500/30 px-3.5 py-2 rounded-xl">
                <Clock
                  className="w-4 h-4 text-orange-400 animate-spin"
                  style={{ animationDuration: "6s" }}
                />
                <span className="text-xs font-medium text-slate-300">
                  Deals Expire in:
                </span>
                <div className="flex items-center gap-1 font-mono font-bold text-sm text-orange-400">
                  <span className="bg-orange-500/20 px-1.5 py-0.5 rounded">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-orange-500/20 px-1.5 py-0.5 rounded">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-orange-500/20 px-1.5 py-0.5 rounded">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Promo code badge */}
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-xs">
                <span className="text-slate-300">Use Coupon:</span>
                <span className="font-mono font-bold text-amber-300 tracking-wider">
                  VAI20
                </span>
                <button
                  onClick={() => handleCopy("VAI20")}
                  className="p-1 hover:bg-white/20 rounded transition-colors text-slate-200 hover:text-white cursor-pointer"
                  title="Copy coupon code"
                >
                  {copiedCode === "VAI20" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onShopNow("all")}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:gap-3 cursor-pointer text-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShopNow("Electronics")}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                ⚡ Tech Deals
              </button>
              <button
                onClick={() => onShopNow("Groceries")}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                🍯 Pure Sundarban Honey
              </button>
            </div>
          </div>

          {/* Right Hero Showcase Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
                alt="Featured Product"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                      Featured Pick
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      AeroPulse Pro ANC Earbuds
                    </h3>
                    <p className="text-xs text-slate-300">
                      42dB Hybrid ANC • 36h Playback
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-slate-400">
                      {currency === "BDT" ? "৳9,599" : "$79.99"}
                    </span>
                    <p className="text-xl font-extrabold text-amber-400">
                      {currency === "BDT" ? "৳5,999" : "$49.99"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Super Fast Delivery
            </h4>
            <p className="text-[11px] text-slate-500">24-48h nationwide</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">100% Authentic</h4>
            <p className="text-[11px] text-slate-500">Genuine brand promise</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              7-Day Easy Return
            </h4>
            <p className="text-[11px] text-slate-500">Hassle-free guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              24/7 Vai Support
            </h4>
            <p className="text-[11px] text-slate-500">Always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
};
