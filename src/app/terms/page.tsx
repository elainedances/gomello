import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — GoMello",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          go<span className="text-emerald-600">mello</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: February 23, 2026</p>

        <div className="prose prose-gray max-w-none text-gray-700 space-y-6 text-[15px] leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900 mt-8">What GoMello Is</h2>
          <p>
            GoMello is a travel search tool. We help you find and compare flights, hotels, and rental cars 
            from various providers. We are <strong>not</strong> a travel agency — we don&apos;t sell tickets, 
            process payments, or handle bookings. When you book, you&apos;re buying from the airline, hotel, 
            or booking platform directly.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">How We Make Money</h2>
          <p>
            We earn affiliate commissions when you book through links on our site. This never changes 
            the price you pay. We disclose this openly because we believe you should know.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Price Accuracy</h2>
          <p>
            We show real-time prices from our data providers, but prices can change at any moment. 
            The price you see on GoMello may differ from the final price on the booking site. 
            Always verify the total before completing a purchase. We do our best, but we can&apos;t 
            guarantee absolute accuracy.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Your Account</h2>
          <p>
            If you create an account, you&apos;re responsible for keeping your login secure. 
            Don&apos;t share your credentials. We may suspend accounts that abuse the service 
            or violate these terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Our Recommendations</h2>
          <p>
            When we say &quot;good deal&quot; or suggest the best time to book, that&apos;s based on data 
            analysis — not a guarantee. Travel involves many variables we can&apos;t control. 
            Use our recommendations as one input in your decision, not the only one.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Limitation of Liability</h2>
          <p>
            GoMello is provided &quot;as is.&quot; We&apos;re not liable for booking issues, price changes, 
            flight cancellations, or any losses related to travel decisions made using our service. 
            Your contract is with the booking provider, not with us.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Changes to These Terms</h2>
          <p>
            We may update these terms. If we make significant changes, we&apos;ll let you know 
            through the site. Continued use means you accept the updated terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
          <p>
            Questions? Reach us at <a href="mailto:hello@gomello.app" className="text-emerald-600 hover:underline">hello@gomello.app</a>.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© 2026 GoMello</p>
      </footer>
    </div>
  );
}
