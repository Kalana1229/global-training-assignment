"use client";

const STATUS_STYLES = {
  Open: "bg-green-100 text-green-800 border border-green-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border border-yellow-200",
  Closed: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
