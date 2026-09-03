import React, { useState } from "react";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Heart,
  Send,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      {/* Upper newsletter bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-1">
            <h4 className="text-lg font-bold text-white">
              Join Shoppyvai Family
            </h4>
            <p className="text-xs text-slate-400">
              Get exclusive member discounts, flash sale alerts, and fresh
              product drops right to your inbox.
            </p>
          </div>

          <div className="md:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Dhonnobad! You are now subscribed to Shoppyvai exclusive
                  deals.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 text-xs">
        {/* Brand story */}
        <div className="col-span-2 lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-white">Shoppy</span>
              <span className="text-xl font-black text-orange-500">vai</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Shoppyvai is your friendly everyday digital marketplace across
            Bangladesh. We deliver original tech gadgets, fashion apparel, fresh
            organic pantry items, and skincare essentials with trust and speed.
          </p>

          <div className="space-y-1.5 text-slate-400 text-xs">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Dhanmondi, Dhaka - 1209, Bangladesh</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>+880 1700-SHOPPY (746779)</span>
            </p>
          </div>
        </div>

        {/* Categories Links */}
        <div className="col-span-1 lg:col-span-2 space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Categories
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Electronics & Tech
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Fashion & Apparel
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Daily Groceries
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Home & Living
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Beauty & Skincare
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Sports & Fitness
              </span>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="col-span-1 lg:col-span-3 space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Customer Care
          </h5>
          <ul className="space-y-2 text-slate-400">
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Help Center & FAQ
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                How to Place an Order
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Shipping & Delivery Timelines
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                7-Day Return Policy
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Terms & Conditions
              </span>
            </li>
            <li>
              <span className="hover:text-orange-400 cursor-pointer">
                Privacy Policy
              </span>
            </li>
          </ul>
        </div>

        {/* Payment Partners */}
        <div className="col-span-2 lg:col-span-3 space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Secure Payment Options
          </h5>
          <p className="text-slate-400 text-xs">
            We accept all major local mobile banking methods, credit/debit
            cards, and cash on delivery.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 bg-pink-900/60 border border-pink-500/40 text-pink-300 rounded-lg font-bold text-[11px]">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-orange-900/60 border border-orange-500/40 text-orange-300 rounded-lg font-bold text-[11px]">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-purple-900/60 border border-purple-500/40 text-purple-300 rounded-lg font-bold text-[11px]">
              Rocket
            </span>
            <span className="px-2.5 py-1 bg-blue-900/60 border border-blue-500/40 text-blue-300 rounded-lg font-bold text-[11px]">
              Visa
            </span>
            <span className="px-2.5 py-1 bg-red-900/60 border border-red-500/40 text-red-300 rounded-lg font-bold text-[11px]">
              Mastercard
            </span>
            <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg font-bold text-[11px]">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-slate-800 text-center py-6 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} Shoppyvai. All rights reserved. Built
          with ❤️ for smart shopping.
        </p>
      </div>
    </footer>
  );
};
