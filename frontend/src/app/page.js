"use client";

import { useState, useEffect, useCallback } from "react";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../lib/api";
import { CATEGORIES } from "../components/CategoryBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchJobs({ category, status, search });
      setJobs(data.data);
    } catch (err) {
      setError("Could not load jobs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const clearFilters = () => {
    setCategory("");
    setStatus("");
    setSearchInput("");
    setSearch("");
  };

  const hasFilters = category || status || search;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Service Requests</h1>
        <p className="text-gray-500 text-sm">Browse open requests from homeowners across the UK</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <label className="label">Search</label>
          <input
            type="text"
            className="input"
            placeholder="Search title or description…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="min-w-[150px]">
          <label className="label">Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="min-w-[140px]">
          <label className="label">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary text-sm self-end">
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading requests…
        </div>
      ) : error ? (
        <div className="card p-6 text-center text-red-600">
          <p className="font-medium">{error}</p>
          <button onClick={loadJobs} className="btn-secondary mt-3 text-sm">
            Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="font-medium text-gray-500">No requests found</p>
          {hasFilters && (
            <p className="text-sm mt-1">Try adjusting your filters</p>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-3">{jobs.length} request{jobs.length !== 1 ? "s" : ""} found</p>
          <div className="grid gap-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
