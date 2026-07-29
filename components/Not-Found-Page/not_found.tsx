import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-[#fdfbf7] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Hotel/key icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f6ecd9] border border-[#e3cd9c]">
          <svg
            className="h-10 w-10 text-[#b9902f]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4M9 9h.01M9 12h.01M15 9h.01M15 12h.01"
            />
          </svg>
        </div>

        <p className="text-sm font-semibold tracking-[0.15em] text-[#b9902f] mb-2">
          ERROR 404
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          This room doesn&apos;t exist
        </h1>

        <p className="text-gray-500 mb-10 leading-relaxed">
          The reservation or page you&apos;re looking for may have been fully
          booked, removed, or the link might be broken.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#c9a13b] to-[#b9902f] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#c9a13b]/30 hover:from-[#b9902f] hover:to-[#a67e28] transition-all w-full sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            href="/hotels"
            className="inline-flex items-center justify-center rounded-full border border-[#e3cd9c] px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-[#f6ecd9] transition-colors w-full sm:w-auto"
          >
            Browse Hotels
          </Link>
        </div>
      </div>
    </main>
  );
}