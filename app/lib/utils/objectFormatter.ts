import { Category } from "../types/budgets";

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const categoryOptions = Object.values(Category).map((value) => ({
  value,
  label: formatLabel(value),
}));
