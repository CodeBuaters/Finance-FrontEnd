import type { Category } from "../Types/category";

type ChartCategory = Pick<Category, "id" | "name">;

// Fixed order and colour per default category (keyed by lower-cased name), so a
// category keeps its colour no matter which others are present. The first seven
// are ordered so neighbouring slices stay distinguishable (also with colour
// blindness); the rest are rarer expenses. Same hues as TransactionCategoryBadge.
const defaultCategoryColors: Record<string, string> = {
  food: "#f59e0b",
  housing: "#8b5cf6",
  healthcare: "#14b8a6",
  transportation: "#3b82f6",
  shopping: "#f97316",
  utilities: "#6366f1",
  entertainment: "#ec4899",
  education: "#06b6d4",
  "personal care": "#d946ef",
  travel: "#0ea5e9",
  salary: "#10b981",
  other: "#94a3b8",
};

const defaultCategoryOrder = Object.keys(defaultCategoryColors);

// User-created categories get a colour from this palette by id, so the colour stays
// stable. These are the dark steps furthest (OKLab ΔE >= 15) from every default hue
// above; more custom categories than this share colours, the legend labels tell them apart.
const customCategoryColors = ["#065f46", "#9f1239", "#6b21a8", "#a16207"];

const getDefaultKey = (category: ChartCategory) => category.name.trim().toLowerCase();

export const getCategoryColor = (category: ChartCategory) =>
  defaultCategoryColors[getDefaultKey(category)] ??
  customCategoryColors[category.id % customCategoryColors.length];

// Default categories in their fixed order, custom categories alphabetically after
// them, and "Other" always last
export const compareCategoriesForChart = (a: ChartCategory, b: ChartCategory) => {
  const rank = (category: ChartCategory) => {
    const index = defaultCategoryOrder.indexOf(getDefaultKey(category));
    return index === -1 ? defaultCategoryOrder.length - 1.5 : index;
  };

  return rank(a) - rank(b) || a.name.localeCompare(b.name);
};
