"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#f4ede1] text-[#10221f] p-6">
        <div className="max-w-lg w-full border border-red-300 bg-red-50 rounded-sm p-6">
          <h1 className="text-xl font-semibold text-red-700 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-red-700/80 mb-3">
            {error.message || "An unexpected server error occurred."}
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-red-700/60 mb-4">
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="text-sm bg-red-700 text-white px-4 py-2 rounded-sm hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
