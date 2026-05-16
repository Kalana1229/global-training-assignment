"use client";

const CATEGORY_STYLES = {
  Plumbing: "bg-blue-100 text-blue-700",
  Electrical: "bg-yellow-100 text-yellow-700",
  Painting: "bg-purple-100 text-purple-700",
  Joinery: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-600",
};

export const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];

export default function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
        CATEGORY_STYLES[category] || "bg-gray-100 text-gray-600"
      }`}
    >
      {category}
    </span>
  );
}
