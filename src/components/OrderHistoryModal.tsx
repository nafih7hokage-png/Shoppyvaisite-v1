import React from "react";
import {
  X,
  PackageCheck,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Order, Currency } from "../types";
import { formatPrice } from "../utils/currency";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: Currency;
  onExploreProducts: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  const statusColorMap: Record<string, string> = {
    Processing: "bg-amber-100 text-amber-800 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    "Out for Delivery": "bg-purple-100 text-purple-800 border-purple-200",
    Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Orders & Deliveries
              </h3>
              <p className="text-xs text-slate-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                placed with Shoppyvai
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

        {/* Orders List */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <PackageCheck className="w-8 h-8 stroke-1" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                No orders placed yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Once you place an order, its live tracking, delivery updates,
                and receipts will show up right here!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-3"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {order.id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {order.date}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      statusColorMap[order.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">
                            {item.product.name}
                          </p>
                          {item.selectedVariant && (
                            <p className="text-[10px] text-slate-400">
                              Option: {item.selectedVariant}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-slate-500 font-medium">
                          Qty: {item.quantity}
                        </span>
                        <p className="font-bold text-slate-800">
                          {formatPrice(
                            item.product.price * item.quantity,
                            order.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom details */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {order.shippingDetails.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">
                      Total Paid:{" "}
                    </span>
                    <span className="text-sm font-extrabold text-orange-600">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
