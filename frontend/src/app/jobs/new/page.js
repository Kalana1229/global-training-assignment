"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJob } from "../../../lib/api";
import { CATEGORIES } from "../../../components/CategoryBadge";

const INITIAL = {
  title: "",
  description: "",
  category: "",
  location: "",
  contactName: "",
  contactEmail: "",
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      e.contactEmail = "Please enter a valid email address";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setServerError("");
    try {
      await createJob(form);
      router.push("/");
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Requests
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Post a Service Request
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Provide the details of your project to connect with qualified professionals.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-10">
          
          {/* Minimal Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-900 tracking-wider uppercase">Step 1 of 3</span>
              <span className="text-xs font-medium text-gray-400">Project Details</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 flex overflow-hidden">
              <div className="bg-gray-900 w-1/3 h-full rounded-full"></div>
            </div>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            
            {/* Section 1: The Basics */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">1. The Basics</h2>
              
              <div className="group">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  What needs to be done? <span className="text-gray-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`block w-full px-4 py-3 rounded-lg border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-0 ${
                    errors.title
                      ? "border-red-300 focus:border-red-500 bg-red-50/30"
                      : "border-gray-200 focus:border-gray-900 focus:bg-white"
                  }`}
                  placeholder="e.g. Repair leaking kitchen tap"
                  value={form.title}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  maxLength={200}
                />
                {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Describe the project <span className="text-gray-400">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className={`block w-full px-4 py-3 rounded-lg border bg-gray-50/50 text-gray-900 placeholder-gray-400 resize-none transition-colors duration-200 focus:outline-none focus:ring-0 ${
                    errors.description
                      ? "border-red-300 focus:border-red-500 bg-red-50/30"
                      : "border-gray-200 focus:border-gray-900 focus:bg-white"
                  }`}
                  placeholder="Provide details about the work required, measurements, or any specific preferences..."
                  value={form.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  maxLength={2000}
                />
                <div className="flex justify-end mt-1.5">
                  <p className="text-xs text-gray-400 font-medium">{form.description.length} / 2000</p>
                </div>
                {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
              </div>
            </div>

            {/* Section 2: Details */}
            <div className="space-y-6 pt-2">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">2. Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-gray-900 focus:bg-white"
                      value={form.category}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("category")}
                      onBlur={() => setFocusedField(null)}
                    >
                      <option value="" disabled className="text-gray-400">Select a category</option>
                      {CATEGORIES && CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-gray-900 focus:bg-white"
                      placeholder="City or postcode"
                      value={form.location}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("location")}
                      onBlur={() => setFocusedField(null)}
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Contact */}
            <div className="space-y-6 pt-2">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">3. Contact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-gray-900 focus:bg-white"
                    placeholder="John Doe"
                    value={form.contactName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("contactName")}
                    onBlur={() => setFocusedField(null)}
                    maxLength={100}
                  />
                </div>
                
                <div className="group">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-gray-400">*</span>
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    className={`block w-full px-4 py-3 rounded-lg border bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-0 ${
                      errors.contactEmail
                        ? "border-red-300 focus:border-red-500 bg-red-50/30"
                        : "border-gray-200 focus:border-gray-900 focus:bg-white"
                    }`}
                    placeholder="john@example.com"
                    value={form.contactEmail}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("contactEmail")}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.contactEmail && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-8 border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                  </>
                )}
              </button>
              <Link 
                href="/" 
                className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 text-center shadow-sm"
              >
                Cancel
              </Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
