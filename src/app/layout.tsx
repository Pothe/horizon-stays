import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Horizon Stays — Hotels & Resorts",
  description: "Book your next escape at a handpicked collection of hotels and resorts.",
};

function EnvDiagnostic() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length === 0) return null;

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <div className="border border-coral/40 bg-coral/5 rounded-sm p-6">
        <h1 className="font-display text-xl text-coral mb-2">Configuration error</h1>
        <p className="text-sm text-ink/70 mb-3">
          This deployment is missing required environment variable
          {missing.length > 1 ? "s" : ""}:
        </p>
        <ul className="text-sm font-mono text-coral list-disc list-inside mb-3">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="text-sm text-ink/70">
          In Vercel: Settings → Environment Variables → add the missing value(s)
          above, make sure the <strong>Production</strong> checkbox is checked,
          then redeploy (env var changes don&apos;t apply to existing
          deployments).
        </p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-sand text-ink">
        <Navbar />
        <main className="flex-1">{missingEnv ? <EnvDiagnostic /> : children}</main>
      </body>
    </html>
  );
}
