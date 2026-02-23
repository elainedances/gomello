import { FlightResult } from "./types";

export function generateMockFlights(from: string, to: string): FlightResult[] {
  return [
    {
      id: "1",
      airline: "Qatar Airways",
      departure: {
        airport: from.toUpperCase().slice(0, 3) || "CPH",
        city: from || "Copenhagen",
        time: "14:30",
        date: "April 15, 2026",
      },
      arrival: {
        airport: to.toUpperCase().slice(0, 3) || "BKK",
        city: to || "Bangkok",
        time: "06:45+1",
        date: "April 16, 2026",
      },
      duration: "12h 15m",
      stops: 1,
      stopCities: ["Doha"],
      price: {
        total: 487,
        currency: "EUR",
        breakdown: { baseFare: 398, taxes: 89 },
      },
      included: ["23kg checked bag", "Carry-on 7kg", "Meal included", "Seat selection"],
      notIncluded: ["Extra legroom (+€45)", "Priority boarding (+€12)"],
      cabinClass: "Economy",
      bookingSource: {
        name: "Qatar Airways",
        trust: "high",
        reason: "Direct booking with the airline. Full support, loyalty points, easy changes.",
      },
      priceConfidence: {
        rating: "good",
        message: "This is 8% below the average price for this route in April. Prices have been stable this week.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Free cancellation within 24 hours. After that, €150 change fee or non-refundable.",
    },
    {
      id: "2",
      airline: "Emirates",
      departure: {
        airport: from.toUpperCase().slice(0, 3) || "CPH",
        city: from || "Copenhagen",
        time: "21:15",
        date: "April 15, 2026",
      },
      arrival: {
        airport: to.toUpperCase().slice(0, 3) || "BKK",
        city: to || "Bangkok",
        time: "15:30+1",
        date: "April 16, 2026",
      },
      duration: "14h 15m",
      stops: 1,
      stopCities: ["Dubai"],
      price: {
        total: 523,
        currency: "EUR",
        breakdown: { baseFare: 421, taxes: 102 },
      },
      included: ["30kg checked bag", "Carry-on 7kg", "Meal included", "In-flight entertainment"],
      notIncluded: ["Seat selection (+€15)", "Wi-Fi (+€10)"],
      cabinClass: "Economy",
      bookingSource: {
        name: "Emirates",
        trust: "high",
        reason: "Direct booking with the airline. Full support, loyalty points, easy changes.",
      },
      priceConfidence: {
        rating: "fair",
        message: "Close to average for this route. Prices typically drop slightly 6-8 weeks before departure.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Non-refundable. Changes allowed for €100 + fare difference.",
    },
    {
      id: "3",
      airline: "Finnair",
      departure: {
        airport: from.toUpperCase().slice(0, 3) || "CPH",
        city: from || "Copenhagen",
        time: "09:05",
        date: "April 15, 2026",
      },
      arrival: {
        airport: to.toUpperCase().slice(0, 3) || "BKK",
        city: to || "Bangkok",
        time: "00:20+1",
        date: "April 16, 2026",
      },
      duration: "11h 15m",
      stops: 1,
      stopCities: ["Helsinki"],
      price: {
        total: 445,
        currency: "EUR",
        breakdown: { baseFare: 362, taxes: 83 },
      },
      included: ["23kg checked bag", "Carry-on 7kg", "Meal included"],
      notIncluded: ["Seat selection (+€20)", "Extra bag (+€60)", "Wi-Fi (+€12)"],
      cabinClass: "Economy",
      bookingSource: {
        name: "Kiwi.com",
        trust: "medium",
        reason: "Third-party booking platform. Good prices, but support goes through Kiwi — not the airline directly.",
      },
      priceConfidence: {
        rating: "great",
        message: "15% below average for this route. This is one of the lowest prices we've seen in the last 30 days.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Non-refundable. Kiwi.com Guarantee available for +€25 (covers missed connections).",
    },
  ];
}
