import Link from "next/link";
import { Home, Search, Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg text-center">
        {/* Property/Home Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 shadow-lg">
          <Building2 className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
        </div>

        <p className="text-sm font-semibold tracking-[0.15em] text-blue-500 mb-3">
          404 - PAGE NOT FOUND
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Property Not Found
        </h1>

        <p className="text-gray-500 mb-10 leading-relaxed max-w-sm mx-auto">
          The property or page you&apos;re looking for may have been removed,
          is no longer available, or the link might be broken.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/tenant/properties"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto"
          >
            <Search className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>

        {/* Quick Action Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <Link href="/auth/login" className="hover:text-gray-600 transition-colors">
            Login
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/auth/register" className="hover:text-gray-600 transition-colors">
            Register
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/landlord/properties/create" className="hover:text-gray-600 transition-colors">
            List Property
          </Link>
        </div>
      </div>
    </main>
  );
}