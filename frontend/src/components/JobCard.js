import Link from "next/link";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`} className="block">
      <div className="card p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
            {job.title}
          </h2>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {job.category && <CategoryBadge category={job.category} />}
          {job.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
          )}
          <span className="ml-auto">{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
