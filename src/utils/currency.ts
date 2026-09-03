import { Currency } from "../types";

export const USD_TO_BDT_RATE = 120;

export function formatPrice(amountInUSD: number, currency: Currency): string {
  if (currency === "BDT") {
    const bdtAmount = Math.round(amountInUSD * USD_TO_BDT_RATE);
    return `৳${bdtAmount.toLocaleString("en-IN")}`;
  }
  return `$${amountInUSD.toFixed(2)}`;
}

export function convertPrice(amountInUSD: number, currency: Currency): number {
  if (currency === "BDT") {
    return Math.round(amountInUSD * USD_TO_BDT_RATE);
  }
  return Number(amountInUSD.toFixed(2));
}
