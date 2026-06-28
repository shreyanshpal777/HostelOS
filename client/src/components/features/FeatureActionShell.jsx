import React from "react";
import { Loader2 } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-gray-950 dark:text-white dark:focus:border-indigo-300 dark:focus:ring-indigo-500/20";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

export function splitList(value, mapper = (item) => item) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(mapper);
}

export function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function ActionButton({ children, isLoading, variant = "primary", ...props }) {
  const styles =
    variant === "secondary"
      ? "border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-white/5"
      : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:cursor-progress disabled:opacity-70 ${styles}`}
      disabled={isLoading || props.disabled}
      type="button"
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function FeatureActionShell({ title, subtitle, children, result, error }) {
  return (
    <section className="mb-16 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm dark:border-white/10 dark:bg-gray-900/70 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">{subtitle}</p>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      {children}

      {(error || result) && (
        <div className="mt-5">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}
          {result && (
            <pre className="max-h-72 overflow-auto rounded-lg bg-gray-950 p-4 text-xs leading-6 text-gray-100">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
