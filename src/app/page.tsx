"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Couldn't connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          go<span className="text-emerald-600">mello</span>
        </div>
        <div className="text-sm text-gray-500">Coming Soon</div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="flex justify-center gap-3 mb-8">
          <div className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full">
            ✨ Launching soon — join the waitlist
          </div>
          <a href="/chat" className="inline-block bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
            Try the demo →
          </a>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Travel booking that<br />
          <span className="text-emerald-600">actually makes sense</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Tell GoMello where you want to go. Get honest price comparisons for flights, 
          hotels, and rental cars — with full cost breakdowns, no hidden fees, and 
          booking sources you can trust.
        </p>

        {/* Waitlist form */}
        {!submitted ? (
          <div className="max-w-md mx-auto mb-16">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-colors shadow-sm cursor-pointer text-base"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 max-w-md mx-auto mb-16">
            <p className="text-emerald-700 font-medium">
              You&apos;re on the list! 🎉 We&apos;ll let you know when GoMello is ready.
            </p>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">No hidden fees</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              See the full cost breakdown before you click any booking link. 
              Taxes, baggage, extras — all laid out clearly.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Sources you can trust</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We rate every booking source. Official airline sites, major platforms, 
              or risky resellers — you&apos;ll always know who you&apos;re buying from.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🧘</div>
            <h3 className="font-semibold text-gray-900 mb-2">Zero pressure</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No countdown timers. No &quot;only 2 seats left!&quot; scare tactics. 
              Save, compare, watch prices — book when you&apos;re ready.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How it works</h2>
          <div className="space-y-8 text-left">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Just say where you want to go</h3>
                <p className="text-gray-600 text-sm">&quot;Somewhere warm in April under €500&quot; or &quot;Copenhagen to Bangkok, mid-April&quot; — however you think about it.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get honest results with context</h3>
                <p className="text-gray-600 text-sm">Not just prices — is it a good deal? What&apos;s included? Is the booking site trustworthy? We tell you everything upfront.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Book with confidence</h3>
                <p className="text-gray-600 text-sm">Full cost breakdown, verified price, clear cancellation policy — all confirmed before you leave our site. No surprises at checkout.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency note */}
        <div className="mt-24 max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 text-left border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">🤝 How we make money (yes, we&apos;re telling you)</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            GoMello is free to use. When you book a flight, hotel, or rental car through one of our links, 
            we earn a small commission from the provider. This never changes the price you pay — you get 
            the same price as if you went to their site directly. We believe in transparency, 
            which is why we&apos;re telling you this right here on the front page.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-3">
          <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        </div>
        <p>© 2026 GoMello. Made with honesty.</p>
      </footer>
    </div>
  );
}
