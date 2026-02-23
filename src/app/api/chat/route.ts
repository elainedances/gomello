import { NextRequest, NextResponse } from "next/server";
import { generateMockFlights } from "@/lib/mock-flights";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // Simple intent detection — will be replaced with AI later
    const isFlightSearch =
      lower.includes("flight") ||
      lower.includes("fly") ||
      lower.includes("flying") ||
      lower.includes(" to ") ||
      lower.includes("book") ||
      lower.includes("trip") ||
      lower.includes("travel");

    if (isFlightSearch) {
      // Extract basic from/to (very naive — AI will replace this)
      const toMatch = lower.match(/(?:to|→)\s+(\w+)/);
      const fromMatch = lower.match(/(?:from|leaving)\s+(\w+)/);
      const to = toMatch?.[1] || "Bangkok";
      const from = fromMatch?.[1] || "Copenhagen";

      const flights = generateMockFlights(from, to);

      return NextResponse.json({
        reply: `I found ${flights.length} options for you. Here are the best flights from ${capitalize(from)} to ${capitalize(to)}:`,
        flights,
      });
    }

    // Default response for non-flight queries
    return NextResponse.json({
      reply: getDefaultReply(lower),
      flights: null,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getDefaultReply(message: string): string {
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hey! 👋 Tell me where you want to go and I'll find you the best flights. For example: \"Flights from Copenhagen to Bangkok in April\"";
  }
  if (message.includes("hotel")) {
    return "Hotel search is coming soon! For now, I can help you find flights. Where are you heading?";
  }
  if (message.includes("car") || message.includes("rental")) {
    return "Car rental search is on the roadmap! I can help with flights right now. What route are you looking at?";
  }
  return "I can help you search for flights! Just tell me where you're going — something like \"Flights from London to Tokyo in May\" and I'll find the best options.";
}
