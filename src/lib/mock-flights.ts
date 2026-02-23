import { FlightResult } from "./types";

export function generateMockFlights(from: string, to: string, dateStr?: string): FlightResult[] {
  const date = dateStr || "April 2026";

  return [
    {
      id: "1",
      airline: "Qatar Airways",
      departure: {
        airport: airportCode(from),
        city: from,
        time: "14:30",
        date: `${date}`,
      },
      arrival: {
        airport: airportCode(to),
        city: to,
        time: "06:45+1",
        date: `${date}`,
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
        message: "8% below the average for this route. Prices have been stable this week.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Free cancellation within 24 hours. After that, €150 change fee or non-refundable.",
    },
    {
      id: "2",
      airline: "Emirates",
      departure: {
        airport: airportCode(from),
        city: from,
        time: "21:15",
        date: `${date}`,
      },
      arrival: {
        airport: airportCode(to),
        city: to,
        time: "15:30+1",
        date: `${date}`,
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
        message: "Close to average. Prices typically drop 6-8 weeks before departure.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Non-refundable. Changes allowed for €100 + fare difference.",
    },
    {
      id: "3",
      airline: "Finnair",
      departure: {
        airport: airportCode(from),
        city: from,
        time: "09:05",
        date: `${date}`,
      },
      arrival: {
        airport: airportCode(to),
        city: to,
        time: "00:20+1",
        date: `${date}`,
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
        message: "15% below average — one of the lowest prices we've seen in the last 30 days.",
      },
      bookingUrl: "#",
      cancellationPolicy: "Non-refundable. Kiwi.com Guarantee available for +€25 (covers missed connections).",
    },
  ];
}

function airportCode(city: string): string {
  const codes: Record<string, string> = {
    copenhagen: "CPH", bangkok: "BKK", tokyo: "NRT", london: "LHR",
    paris: "CDG", lisbon: "LIS", "new york": "JFK", stockholm: "ARN",
    gothenburg: "GOT", dubai: "DXB", singapore: "SIN", bali: "DPS",
    rome: "FCO", barcelona: "BCN", amsterdam: "AMS", berlin: "BER",
    oslo: "OSL", helsinki: "HEL", athens: "ATH", istanbul: "IST",
    "abu dhabi": "AUH", doha: "DOH", "kuala lumpur": "KUL", seoul: "ICN",
    sydney: "SYD", melbourne: "MEL", "los angeles": "LAX", miami: "MIA",
    phuket: "HKT", "chiang mai": "CNX", hanoi: "HAN", "ho chi minh": "SGN",
    mumbai: "BOM", delhi: "DEL", cairo: "CAI", "cape town": "CPT",
    nairobi: "NBO", marrakech: "RAK", zanzibar: "ZNZ", mauritius: "MRU",
  };
  return codes[city.toLowerCase()] || city.slice(0, 3).toUpperCase();
}
