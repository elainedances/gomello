import { FlightResult } from "@/lib/types";

const trustColors = {
  high: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  low: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
};

const confidenceColors = {
  great: { bg: "bg-emerald-100", text: "text-emerald-800" },
  good: { bg: "bg-blue-100", text: "text-blue-800" },
  fair: { bg: "bg-gray-100", text: "text-gray-700" },
  high: { bg: "bg-red-100", text: "text-red-800" },
};

const confidenceLabels = {
  great: "Great deal",
  good: "Good price",
  fair: "Fair price",
  high: "Above average",
};

export default function FlightCard({ flight }: { flight: FlightResult }) {
  const trust = trustColors[flight.bookingSource.trust];
  const confidence = confidenceColors[flight.priceConfidence.rating];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header: airline + price */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <div className="font-semibold text-gray-900 text-lg">{flight.airline}</div>
          <div className="text-sm text-gray-500">{flight.cabinClass} · {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}{flight.stopCities ? ` (${flight.stopCities.join(", ")})` : ""}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">€{flight.price.total}</div>
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${confidence.bg} ${confidence.text}`}>
            {confidenceLabels[flight.priceConfidence.rating]}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="px-5 pt-3 text-sm text-gray-500">
        📅 {flight.departure.date}
      </div>

      {/* Route */}
      <div className="px-5 py-3 flex items-center gap-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">{flight.departure.time}</div>
          <div className="text-sm font-medium text-gray-600">{flight.departure.airport}</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-gray-400 mb-1">{flight.duration}</div>
          <div className="w-full h-px bg-gray-300 relative">
            {flight.stops > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full" />
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">{flight.arrival.time}</div>
          <div className="text-sm font-medium text-gray-600">{flight.arrival.airport}</div>
        </div>
      </div>

      {/* Price confidence */}
      <div className="px-5 pb-3">
        <p className="text-sm text-gray-600">{flight.priceConfidence.message}</p>
      </div>

      {/* What's included */}
      <div className="px-5 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {flight.included.map((item, i) => (
            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
              ✓ {item}
            </span>
          ))}
          {flight.notIncluded.map((item, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="px-5 pb-3">
        <details className="group">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 select-none">
            Price breakdown →
          </summary>
          <div className="mt-2 text-sm space-y-1 text-gray-600">
            <div className="flex justify-between"><span>Base fare</span><span>€{flight.price.breakdown.baseFare}</span></div>
            <div className="flex justify-between"><span>Taxes & fees</span><span>€{flight.price.breakdown.taxes}</span></div>
            {flight.price.breakdown.baggage && (
              <div className="flex justify-between"><span>Baggage</span><span>€{flight.price.breakdown.baggage}</span></div>
            )}
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-1"><span>Total</span><span>€{flight.price.total}</span></div>
          </div>
        </details>
      </div>

      {/* Trust rating */}
      <div className={`mx-5 mb-3 px-3 py-2 rounded-lg border ${trust.bg} ${trust.border}`}>
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-2 h-2 rounded-full ${trust.dot}`} />
          <span className={`text-sm font-medium ${trust.text}`}>Booking via {flight.bookingSource.name}</span>
        </div>
        <p className={`text-xs ${trust.text} opacity-80`}>{flight.bookingSource.reason}</p>
      </div>

      {/* Cancellation + book */}
      <div className="px-5 pb-5 flex items-end justify-between gap-4">
        <p className="text-xs text-gray-400 flex-1">{flight.cancellationPolicy}</p>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap cursor-pointer">
          View Deal →
        </button>
      </div>
    </div>
  );
}
