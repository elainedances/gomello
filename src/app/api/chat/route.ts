import { NextRequest, NextResponse } from "next/server";
import { generateMockFlights } from "@/lib/mock-flights";

interface TripContext {
  destination?: string;
  origin?: string;
  dates?: string;
  duration?: string;
  travelers?: number;
  budget?: string;
  interests?: string[];
}

function parseMessage(message: string, history: { role: string; content: string }[]): TripContext {
  const lower = message.toLowerCase();
  const ctx: TripContext = {};

  // Destination
  const toMatch = lower.match(/(?:to|visit|go to|heading to|going to|travel to|fly to|explore)\s+([a-zA-Z\s]+?)(?:\s+(?:from|in|for|around|next|this|on|between|$))/);
  if (toMatch) ctx.destination = capitalize(toMatch[1].trim());

  // Origin
  const fromMatch = lower.match(/(?:from|leaving|departing|out of|flying from)\s+([a-zA-Z\s]+?)(?:\s+(?:to|in|for|around|next|this|on|$))/);
  if (fromMatch) ctx.origin = capitalize(fromMatch[1].trim());

  // Duration
  const durMatch = lower.match(/(\d+)\s*(?:days?|nights?|weeks?)/);
  if (durMatch) ctx.duration = durMatch[0];

  // Dates
  const dateMatch = lower.match(/(?:in\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{1,2})?/);
  if (dateMatch) ctx.dates = capitalize(dateMatch[0]);

  // Budget
  const budgetMatch = lower.match(/(?:under|below|max|budget|less than)\s*[€$£]?\s*(\d[\d,]*)/);
  if (budgetMatch) ctx.budget = budgetMatch[0];

  // Check history for previously mentioned context
  for (const msg of history) {
    if (msg.role === "user") {
      const prevLower = msg.content.toLowerCase();
      if (!ctx.destination) {
        const prevTo = prevLower.match(/(?:to|visit|go to|heading to|going to|travel to|fly to|explore)\s+([a-zA-Z\s]+?)(?:\s+(?:from|in|for|around|next|this|on|between|$))/);
        if (prevTo) ctx.destination = capitalize(prevTo[1].trim());
      }
      if (!ctx.origin) {
        const prevFrom = prevLower.match(/(?:from|leaving|departing|out of|flying from)\s+([a-zA-Z\s]+?)(?:\s+(?:to|in|for|around|next|this|on|$))/);
        if (prevFrom) ctx.origin = capitalize(prevFrom[1].trim());
      }
    }
  }

  return ctx;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();
    const ctx = parseMessage(message, history);

    // Activities / things to do
    if (lower.includes("activit") || lower.includes("things to do") || lower.includes("what can i do") || lower.includes("recommend") || lower.includes("suggest")) {
      if (ctx.destination) {
        return NextResponse.json({
          reply: getActivities(ctx.destination),
          flights: null,
          type: "activities",
        });
      }
      return NextResponse.json({
        reply: "I'd love to suggest activities! Which destination are you thinking about?",
        flights: null,
      });
    }

    // Hotel intent
    if (lower.includes("hotel") || lower.includes("stay") || lower.includes("accommodation") || lower.includes("where to sleep")) {
      if (ctx.destination) {
        return NextResponse.json({
          reply: getHotelSuggestions(ctx.destination),
          flights: null,
          type: "hotels",
        });
      }
      return NextResponse.json({
        reply: "I can help find hotels! Where are you heading?",
        flights: null,
      });
    }

    // Flight search intent
    const isFlightSearch =
      lower.includes("flight") || lower.includes("fly") || lower.includes("book") ||
      lower.includes("search") || lower.includes("find") || lower.includes("show");

    // Has destination but needs more info
    if (ctx.destination && !ctx.origin && (isFlightSearch || lower.includes("trip") || lower.includes("travel"))) {
      return NextResponse.json({
        reply: `Nice, ${ctx.destination}! Where are you flying from?`,
        flights: null,
      });
    }

    // Has both origin and destination — show flights
    if (ctx.origin && ctx.destination) {
      const dateStr = ctx.dates || "April 2026";
      const flights = generateMockFlights(ctx.origin, ctx.destination, dateStr);
      return NextResponse.json({
        reply: `Here are ${flights.length} options from ${ctx.origin} to ${ctx.destination} in ${dateStr}:`,
        flights,
        type: "flights",
      });
    }

    // General trip planning — ask what they need
    if (ctx.destination && !isFlightSearch) {
      return NextResponse.json({
        reply: getDestinationIntro(ctx.destination, ctx.duration),
        flights: null,
        type: "destination",
      });
    }

    // Greetings
    if (lower.match(/^(hi|hey|hello|hej|sup|yo)\b/)) {
      return NextResponse.json({
        reply: "Hey! 👋 Where are you thinking of going? Tell me a destination and I'll help you plan the whole trip — flights, hotels, things to do.",
        flights: null,
      });
    }

    // Vague travel intent
    if (lower.includes("trip") || lower.includes("travel") || lower.includes("vacation") || lower.includes("holiday") || lower.includes("go to") || lower.includes("visit")) {
      if (ctx.destination) {
        return NextResponse.json({
          reply: getDestinationIntro(ctx.destination, ctx.duration),
          flights: null,
          type: "destination",
        });
      }
      return NextResponse.json({
        reply: "I'm ready to help plan your trip! Where do you want to go? If you're not sure, tell me what you're looking for — beach, city, adventure — and I'll suggest some places.",
        flights: null,
      });
    }

    // Catch-all
    return NextResponse.json({
      reply: "Tell me where you want to go and I'll help you plan everything — flights, hotels, activities. For example: \"I want to go to Tokyo for 2 weeks in May\" or \"beach holiday somewhere warm under €500.\"",
      flights: null,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function capitalize(s: string): string {
  return s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getDestinationIntro(destination: string, duration?: string): string {
  const dur = duration ? ` for ${duration}` : "";
  const intros: Record<string, string> = {
    Bangkok: `Great choice! Bangkok${dur} is going to be amazing. 🇹🇭\n\nHere's what I can help with:\n• ✈️ **Flights** — tell me where you're flying from and when\n• 🏨 **Hotels** — from budget hostels to luxury riverside hotels\n• 🎯 **Activities** — temples, street food tours, floating markets, rooftop bars\n\nWhat would you like to look at first?`,
    Tokyo: `Tokyo${dur} — excellent choice! 🇯🇵\n\nI can help you plan:\n• ✈️ **Flights** — tell me your departure city and dates\n• 🏨 **Hotels** — Shinjuku, Shibuya, Asakusa — depends on your vibe\n• 🎯 **Activities** — Tsukiji Market, Meiji Shrine, Akihabara, Harajuku, day trip to Hakone\n\nWhat do you want to start with?`,
    Lisbon: `Lisbon${dur} — you'll love it! 🇵🇹\n\nI can help with:\n• ✈️ **Flights** — where are you flying from?\n• 🏨 **Hotels** — Alfama for charm, Baixa for central, Bairro Alto for nightlife\n• 🎯 **Activities** — Tram 28, Belém Tower, pastel de nata trail, day trip to Sintra\n\nWhat's first?`,
  };

  return intros[destination] || `${destination}${dur} sounds great! 🌍\n\nI can help you plan the whole trip:\n• ✈️ **Flights** — tell me where you're flying from and when\n• 🏨 **Hotels** — I'll find options that match your budget and style\n• 🎯 **Activities** — top things to see and do\n\nWhat would you like to look at first?`;
}

function getActivities(destination: string): string {
  const activities: Record<string, string> = {
    Bangkok: `Here are some top things to do in Bangkok:\n\n🏛️ **Culture & Temples**\n• Grand Palace & Wat Phra Kaew — the must-see (go early, it gets crowded)\n• Wat Arun — stunning at sunset from across the river\n• Wat Pho — home of the giant reclining Buddha + great Thai massage school\n\n🍜 **Food**\n• Yaowarat (Chinatown) street food crawl — best after dark\n• Or Tor Kor Market — voted one of the world's best fresh markets\n• Cooking class — learn to make pad Thai, green curry from scratch (~€30-40)\n\n🌃 **Nightlife & Views**\n• Sky Bar at Lebua (that Hangover 2 rooftop) — go for one drink, worth the view\n• Khao San Road — backpacker classic, love it or hate it\n• Thonglor — where locals go for cocktails and live music\n\n🚣 **Day Trips**\n• Floating markets (Amphawa > Damnoen Saduak — more authentic, less touristy)\n• Ayutthaya ancient temples — 1.5h by train, incredible ruins\n• Khao Yai National Park — jungle hiking + wine region\n\nWant me to find flights or hotels for Bangkok?`,
    Tokyo: `Top things to do in Tokyo:\n\n🏛️ **Culture**\n• Meiji Shrine — peaceful forest in the middle of Shibuya\n• Senso-ji in Asakusa — Tokyo's oldest temple, great street food nearby\n• Teamlab Borderless — immersive digital art (book ahead!)\n\n🍣 **Food**\n• Tsukiji Outer Market — sushi breakfast is a must\n• Ramen street in Tokyo Station — tiny shops, incredible bowls\n• Golden Gai in Shinjuku — 6-seat bars stacked together, total experience\n\n🎮 **Fun**\n• Akihabara — gaming, anime, electronics paradise\n• Mario Kart tour through the streets (yes, real)\n• Robot Restaurant in Kabukicho — weird and wonderful\n\n🏔️ **Day Trips**\n• Hakone — hot springs + views of Mt. Fuji\n• Kamakura — giant Buddha + beach town vibes\n• Nikko — ornate shrines in the mountains\n\nWant me to search for flights or hotels?`,
  };

  return activities[destination] || `I'd recommend researching the top activities in ${destination} — once we have our full database connected, I'll be able to show you bookable experiences with reviews and prices.\n\nIn the meantime, want me to help with flights or hotels to ${destination}?`;
}

function getHotelSuggestions(destination: string): string {
  const hotels: Record<string, string> = {
    Bangkok: `Here are some hotel areas in Bangkok to consider:\n\n💰 **Budget (€15-40/night)**\n• Khao San Road area — backpacker central, cheap and cheerful\n• Silom — good transit links, local vibe\n\n⭐ **Mid-range (€40-100/night)**\n• Sukhumvit (near BTS Asok/Nana) — modern, great restaurants, easy transit\n• Riverside — beautiful views, quieter\n\n💎 **Luxury (€100-300/night)**\n• Mandarin Oriental — legendary, right on the river\n• The Siam — boutique, art deco, stunning pool\n• Lebua State Tower — that Sky Bar from The Hangover II\n\n🏨 Hotel booking is coming soon — I'll be able to show you real prices with full breakdowns, just like with flights. For now, want me to search for flights instead?`,
    Tokyo: `Hotel areas in Tokyo:\n\n💰 **Budget (€30-60/night)**\n• Capsule hotels — unique Tokyo experience, surprisingly comfortable\n• Asakusa — traditional area, cheaper than central\n\n⭐ **Mid-range (€60-150/night)**\n• Shinjuku — incredible transit hub, nightlife, food everywhere\n• Shibuya — trendy, young, the famous crossing\n\n💎 **Luxury (€150-500/night)**\n• Park Hyatt (Lost in Translation hotel) — Shinjuku views\n• Aman Tokyo — minimalist luxury near Imperial Palace\n• The Prince Gallery — modern, rooftop bar\n\n🏨 Hotel booking is coming soon with full price comparisons. Want to look at flights to Tokyo?`,
  };

  return hotels[destination] || `I'll be able to show you hotel options in ${destination} with real prices and reviews soon — hotel search is one of the next features we're building.\n\nWant me to search for flights to ${destination} in the meantime?`;
}
