"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchJob, updateJobStatus, deleteJob } from "../../../lib/api";
import StatusBadge from "../../../components/StatusBadge";
import CategoryBadge from "../../../components/CategoryBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJob(id);
        setJob(data.data);
        setSelectedStatus(data.data.status);
      } catch {
        setError("Job not found or failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === job.status) return;
    setStatusLoading(true);
    setActionMsg("");
    try {
      const data = await updateJobStatus(id, newStatus);
      setJob(data.data);
      setSelectedStatus(data.data.status);
      setActionMsg("Status updated successfully.");
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setActionMsg(`Error: ${err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      setActionMsg(`Error deleting: ${err.message}`);
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto card p-8 text-center">
        <p className="text-red-600 font-medium mb-3">{error}</p>
        <Link href="/" className="btn-secondary text-sm">← Back to all requests</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <div className="mb-5">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All requests
        </Link>
      </div>

      <div className="card p-6 mb-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-5">
          {job.category && <CategoryBadge category={job.category} />}
          {job.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">Posted {formatDate(job.createdAt)}</span>
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 pt-4 mb-5">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Description</h2>
          <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {/* Contact */}
        {(job.contactName || job.contactEmail) && (
          <div className="border-t border-gray-100 pt-4 mb-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Contact</h2>
            <div className="text-sm text-gray-700 space-y-1">
              {job.contactName && <p>{job.contactName}</p>}
              {job.contactEmail && (
                <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline">
                  {job.contactEmail}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-gray-100 pt-5 flex flex-wrap items-end gap-4">
          {/* Status update */}
          <div className="flex-1 min-w-[180px]">
            <label className="label">Update Status</label>
            <div className="flex gap-2">
              <select
                className="input flex-1"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={statusLoading}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                className="btn-primary text-sm px-4"
                onClick={() => handleStatusChange(selectedStatus)}
                disabled={statusLoading || selectedStatus === job.status}
              >
                {statusLoading ? "…" : "Save"}
              </button>
            </div>
          </div>

          {/* Delete */}
          <div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-danger text-sm"
              >
                Delete Request
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <span className="text-sm text-red-700 font-medium">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="btn-danger text-xs px-3 py-1"
                >
                  {deleteLoading ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary text-xs px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback message */}
        {actionMsg && (
          <p className={`mt-3 text-sm ${actionMsg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
            {actionMsg}
          </p>
        )}
      </div>
    </div>
  );
}
