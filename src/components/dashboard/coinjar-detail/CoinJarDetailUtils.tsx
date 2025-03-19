
import { CoinJar } from "@/types/dashboard";

export const calculatePercentComplete = (totalAmount: number, targetAmount: number): number => {
  return Math.min(100, Math.round((totalAmount / targetAmount) * 100));
};

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
