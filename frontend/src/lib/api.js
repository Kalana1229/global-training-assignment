const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchJobs({ category = "", status = "", search = "" } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const url = `${API_URL}/api/jobs${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function fetchJob(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Job not found");
  return res.json();
}

export async function createJob(data) {
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create job");
  return json;
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update status");
  return json;
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/api/jobs/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete job");
  return json;
}
