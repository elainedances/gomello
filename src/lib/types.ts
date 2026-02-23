export interface FlightResult {
  id: string;
  airline: string;
  airlineLogo?: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  stopCities?: string[];
  price: {
    total: number;
    currency: string;
    breakdown: {
      baseFare: number;
      taxes: number;
      baggage?: number;
    };
  };
  included: string[];
  notIncluded: string[];
  cabinClass: string;
  bookingSource: {
    name: string;
    trust: "high" | "medium" | "low";
    reason: string;
  };
  priceConfidence: {
    rating: "great" | "good" | "fair" | "high";
    message: string;
  };
  bookingUrl: string;
  cancellationPolicy: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  flights?: FlightResult[];
  timestamp: number;
}
