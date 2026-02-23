import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — GoMello",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          go<span className="text-emerald-600">mello</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: February 23, 2026</p>

        <div className="prose prose-gray max-w-none text-gray-700 space-y-6 text-[15px] leading-relaxed">
          <p>
            We keep this simple. Here&apos;s what we collect, why, and what we do with it.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">What We Collect</h2>

          <h3 className="text-lg font-medium text-gray-900 mt-6">When you join the waitlist</h3>
          <p>Your email address. That&apos;s it. We use it to notify you when GoMello launches.</p>

          <h3 className="text-lg font-medium text-gray-900 mt-6">When you use the service</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Search queries (so we can show you results and improve the service)</li>
            <li>Account info if you sign up (email, name, preferences like home airport)</li>
            <li>Booking confirmations if you choose to share them (for flight tracking features)</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-900 mt-6">Automatically</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Basic analytics (page views, which features are used) — no personal tracking</li>
            <li>We don&apos;t use invasive tracking cookies or sell your data to advertisers</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">What We Don&apos;t Do</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We don&apos;t sell your personal data. Ever.</li>
            <li>We don&apos;t share your email with third parties for marketing.</li>
            <li>We don&apos;t track you across other websites.</li>
            <li>We don&apos;t use your search data for targeted advertising.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Third-Party Services</h2>
          <p>
            When you click a booking link, you&apos;re going to another website (like an airline 
            or Booking.com). Their privacy policy applies there, not ours. We recommend reading 
            their terms before making a purchase.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Data Storage</h2>
          <p>
            Your data is stored securely. We use industry-standard encryption and don&apos;t keep 
            data longer than needed. If you want your data deleted, just ask.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Your Rights</h2>
          <p>You can:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ask what data we have about you</li>
            <li>Request we delete your data</li>
            <li>Unsubscribe from emails at any time</li>
            <li>Export your data</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Cookies</h2>
          <p>
            We use minimal cookies — just what&apos;s needed to keep you logged in and remember 
            your preferences. No tracking cookies, no third-party ad cookies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Changes</h2>
          <p>
            If we change this policy, we&apos;ll update this page and the date above. 
            No sneaky changes.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
          <p>
            Privacy questions? Email <a href="mailto:hello@gomello.app" className="text-emerald-600 hover:underline">hello@gomello.app</a>.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© 2026 GoMello</p>
      </footer>
    </div>
  );
}
