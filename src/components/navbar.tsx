import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-ink/10 bg-sand/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          Horizon <span className="text-brass italic">Stays</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-ink/70">
          <Link href="/" className="hover:text-ink transition-colors">
            Properties
          </Link>
          <Link href="/bookings" className="hover:text-ink transition-colors">
            My Bookings
          </Link>
        </nav>
      </div>
    </header>
  );
}
