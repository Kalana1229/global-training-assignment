import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "GlobalTNA - Service Request Board",
  description: "Post and browse home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-700 hover:text-blue-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              GlobalTNA
            </Link>
            <Link href="/jobs/new" className="btn-primary text-sm">
              + Post a Request
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-16 py-6 text-center text-sm text-gray-400">
          © 2026 GlobalTNA · Service Request Board
        </footer>
      </body>
    </html>
  );
}
