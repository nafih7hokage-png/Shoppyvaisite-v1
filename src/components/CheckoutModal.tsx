import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Package,
  ArrowRight,
  ArrowLeft,
  ReceiptText,
} from "lucide-react";
import { CartItem, Currency, Coupon, Order } from "../types";
import { formatPrice } from "../utils/currency";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedCoupon: Coupon | null;
  onOrderPlaced: (order: Order) => void;
}

type PaymentMethodType = "COD" | "bKash" | "Nagad" | "Rocket" | "Card";

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedCoupon,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<"details" | "payment" | "success">(
    "details",
  );

  // Form states
  const [fullName, setFullName] = useState("Nafih Chowdhury");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [email, setEmail] = useState("nafih@example.com");
  const [address, setAddress] = useState("House 42, Road 7/A, Dhanmondi");
  const [city, setCity] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1209");
  const [deliveryNotes, setDeliveryNotes] = useState(
    "Call before ringing bell.",
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("bKash");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;
  const shippingFee = subtotal >= 50 ? 0 : 3.0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !city) return;
    setStep("payment");
  };

  const handleConfirmOrder = () => {
    const randomOrderId = `SV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: randomOrderId,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: [...items],
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: finalTotal,
      currency,
      status: "Processing",
      shippingDetails: {
        fullName,
        phone,
        email,
        address,
        city,
        postalCode,
        notes: deliveryNotes,
      },
      paymentMethod,
    };

    setCompletedOrder(newOrder);
    onOrderPlaced(newOrder);
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {step === "success" ? "Order Confirmed!" : "Secure Checkout"}
            </h3>
            <p className="text-xs text-slate-500">
              {step === "details" &&
                "Step 1 of 2: Shipping & Delivery Information"}
              {step === "payment" && "Step 2 of 2: Select Payment Method"}
              {step === "success" &&
                "Your order has been received by Shoppyvai!"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Address Details */}
          {step === "details" && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (for courier call) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Division *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50"
                  >
                    <option value="Dhaka">Dhaka (Same day / 24h)</option>
                    <option value="Chittagong">Chittagong (24-48h)</option>
                    <option value="Sylhet">Sylhet (24-48h)</option>
                    <option value="Rajshahi">Rajshahi (24-48h)</option>
                    <option value="Khulna">Khulna (24-48h)</option>
                    <option value="Barisal">Barisal (48h)</option>
                    <option value="Rangpur">Rangpur (48h)</option>
                    <option value="Mymensingh">Mymensingh (24-48h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Address (Area, Road, House, Flat No.) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Note for Courier
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Leave with security or call before delivery"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-orange-500 bg-slate-50/50"
                />
              </div>

              {/* Order Summary box */}
              <div className="p-3.5 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    order
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Includes all discounts & delivery charges
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">
                    Payable Amount:
                  </span>
                  <p className="text-base font-extrabold text-orange-600">
                    {formatPrice(finalTotal, currency)}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment Selection */}
          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Payment Method
              </p>

              <div className="space-y-2.5">
                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod("bKash")}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "bKash"
                      ? "border-pink-600 bg-pink-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xs">
                      bKash
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        bKash Mobile Banking
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Fast & secure instant online payment
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "bKash"
                        ? "border-pink-600 bg-pink-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "bKash" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod("Nagad")}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "Nagad"
                      ? "border-orange-600 bg-orange-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-xs">
                      Nagad
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Nagad Direct Pay
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Zero extra transaction fee
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "Nagad"
                        ? "border-orange-600 bg-orange-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "Nagad" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Check product parcel and pay in cash to delivery vai
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "COD"
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "COD" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod("Card")}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "Card"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Credit / Debit Card
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Visa, Mastercard, American Express & UnionPay
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "Card"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "Card" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </label>
              </div>

              {/* Delivery info confirmation recap */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Deliver to:</span>
                  <span className="font-semibold text-slate-800">
                    {fullName} ({phone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[260px]">
                    {address}, {city}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">
                    Total to Pay:
                  </span>
                  <span className="font-extrabold text-orange-600">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Confirm & Place Order ({formatPrice(finalTotal, currency)})
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === "success" && completedOrder && (
            <div className="text-center space-y-5 py-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 stroke-2" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Success! Order Placed
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Dhonnobad, {completedOrder.shippingDetails.fullName}!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Your order has been recorded. Our Shoppyvai representative
                  will call your number ({completedOrder.shippingDetails.phone})
                  shortly before delivery.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-semibold">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {completedOrder.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-slate-700">
                    {completedOrder.date}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-semibold text-slate-800">
                    {completedOrder.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
                    {completedOrder.shippingDetails.address},{" "}
                    {completedOrder.shippingDetails.city}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="text-orange-600 font-extrabold">
                    {formatPrice(completedOrder.total, completedOrder.currency)}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="max-w-md mx-auto pt-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-left">
                  Items Ordered ({completedOrder.items.length})
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {completedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 bg-white border border-slate-200 rounded-xl"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={it.product.image}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="truncate text-slate-800 font-medium">
                          {it.product.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 ml-2">
                        x{it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
