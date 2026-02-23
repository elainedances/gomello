import { NextRequest, NextResponse } from "next/server";
import { generateMockFlights } from "@/lib/mock-flights";

interface TripContext {
  destination?: string;
  origin?: string;
  dates?: string;
  duration?: string;
}

// Check what the last assistant message was asking for
function getLastQuestion(history: { role: string; content: string }[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") {
      const lower = history[i].content.toLowerCase();
      if (lower.includes("where are you flying from") || lower.includes("where are you departing from")) {
        return "asking_origin";
      }
      if (lower.includes("what would you like to look at first") || lower.includes("what do you want to start with") || lower.includes("what's first")) {
        return "asking_preference";
      }
      if (lower.includes("when are you") || lower.includes("what dates") || lower.includes("which month")) {
        return "asking_dates";
      }
      break; // only check the most recent assistant message
    }
  }
  return null;
}

// Extract trip context from the full conversation
function buildContext(message: string, history: { role: string; content: string }[]): TripContext {
  const ctx: TripContext = {};

  // Parse ALL user messages (oldest first) to build up context
  const allUserMessages = history
    .filter((m) => m.role === "user")
    .map((m) => m.content);
  allUserMessages.push(message);

  for (const msg of allUserMessages) {
    const lower = msg.toLowerCase();

    // Destination
    const toMatch = lower.match(/(?:to|visit|go to|heading to|going to|travel to|fly to|explore)\s+([a-zA-Z\s]+?)(?:\s+(?:from|in|for|around|next|this|on|between|,|$))/);
    if (toMatch) ctx.destination = capitalize(toMatch[1].trim());

    // Origin (explicit "from X")
    const fromMatch = lower.match(/(?:from|leaving|departing|out of|flying from)\s+([a-zA-Z\s]+?)(?:\s+(?:to|in|for|around|next|this|on|,|$))/);
    if (fromMatch) ctx.origin = capitalize(fromMatch[1].trim());

    // Duration
    const durMatch = lower.match(/(\d+)\s*(?:days?|nights?|weeks?)/);
    if (durMatch) ctx.duration = durMatch[0];

    // Dates
    const dateMatch = lower.match(/(?:in\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{1,2})?/);
    if (dateMatch) ctx.dates = capitalize(dateMatch[0]);
  }

  // If the bot just asked "where are you flying from?" and the user replied with a short message,
  // treat the entire message as the origin (e.g., "gothenburg", "london", "CPH")
  const lastQ = getLastQuestion(history);
  if (lastQ === "asking_origin" && !ctx.origin) {
    const cleaned = message.trim();
    // If it's a short reply (1-3 words, no travel keywords), it's the origin
    if (cleaned.split(/\s+/).length <= 3 && !cleaned.toLowerCase().match(/^(hotel|activit|what|how|when|yes|no|maybe)/)) {
      ctx.origin = capitalize(cleaned);
    }
  }

  return ctx;
}

function getIntent(message: string, lastQuestion: string | null): string {
  const lower = message.toLowerCase().trim();

  // If bot asked what to look at first, interpret short answers
  if (lastQuestion === "asking_preference") {
    if (lower.match(/flight|fly|plane/)) return "flights";
    if (lower.match(/hotel|stay|sleep|accommodation/)) return "hotels";
    if (lower.match(/activit|things|do|see|visit|explore/)) return "activities";
  }

  // Explicit intents
  if (lower.match(/activit|things to do|what can i do|what to do|recommend|suggest things/)) return "activities";
  if (lower.match(/hotel|stay|accommodation|where to sleep|hostel|airbnb/)) return "hotels";
  if (lower.match(/flight|fly|plane|book flight|search flight|find flight/)) return "flights";

  // General travel
  if (lower.match(/trip|travel|vacation|holiday|go to|visit|want to go|heading to/)) return "trip_planning";

  // Greetings
  if (lower.match(/^(hi|hey|hello|hej|sup|yo|hola)\b/)) return "greeting";

  // Short answers (probably replying to a question)
  if (lower.split(/\s+/).length <= 3) return "short_answer";

  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lastQuestion = getLastQuestion(history);
    const ctx = buildContext(message, history);
    const intent = getIntent(message, lastQuestion);

    // If we have both origin and destination, always offer to show flights
    if (ctx.origin && ctx.destination) {
      const dateStr = ctx.dates || "April 2026";

      // If intent is activities or hotels, show those but with the context we have
      if (intent === "activities") {
        return NextResponse.json({ reply: getActivities(ctx.destination), flights: null });
      }
      if (intent === "hotels") {
        return NextResponse.json({ reply: getHotelSuggestions(ctx.destination), flights: null });
      }

      // Default: show flights
      const flights = generateMockFlights(ctx.origin, ctx.destination, dateStr);
      return NextResponse.json({
        reply: `Here are ${flights.length} options from ${ctx.origin} to ${ctx.destination} (${dateStr}):`,
        flights,
      });
    }

    // Have destination but no origin
    if (ctx.destination && !ctx.origin) {
      if (intent === "flights" || lastQuestion === "asking_preference" && message.toLowerCase().match(/flight/)) {
        return NextResponse.json({
          reply: `Where are you flying from?`,
          flights: null,
        });
      }
      if (intent === "activities") {
        return NextResponse.json({ reply: getActivities(ctx.destination), flights: null });
      }
      if (intent === "hotels") {
        return NextResponse.json({ reply: getHotelSuggestions(ctx.destination), flights: null });
      }
      // First mention of destination — give the intro
      return NextResponse.json({
        reply: getDestinationIntro(ctx.destination, ctx.duration),
        flights: null,
      });
    }

    // Greeting
    if (intent === "greeting") {
      return NextResponse.json({
        reply: "Hey! 👋 Where are you thinking of going? Tell me a destination and I'll help you plan the whole trip — flights, hotels, things to do.",
        flights: null,
      });
    }

    // General travel intent without a destination
    if (intent === "trip_planning") {
      return NextResponse.json({
        reply: "I'm ready to help! Where do you want to go? If you're not sure, tell me what you're looking for — beach, city, adventure, culture — and I'll suggest some places.",
        flights: null,
      });
    }

    // Catch-all
    return NextResponse.json({
      reply: "Tell me where you want to go and I'll help plan the trip — flights, hotels, activities, the whole thing. Just say something like \"I want to go to Barcelona for a week in June.\"",
      flights: null,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

function capitalize(s: string): string {
  return s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getDestinationIntro(destination: string, duration?: string): string {
  const dur = duration ? ` for ${duration}` : "";
  const intros: Record<string, string> = {
    Bangkok: `Great choice! Bangkok${dur} is going to be amazing. 🇹🇭\n\nWhat would you like to look at first?\n• ✈️ **Flights** — tell me where you're flying from and when\n• 🏨 **Hotels** — from budget hostels to luxury riverside hotels\n• 🎯 **Activities** — temples, street food tours, floating markets, rooftop bars`,
    Tokyo: `Tokyo${dur} — excellent choice! 🇯🇵\n\nWhat do you want to start with?\n• ✈️ **Flights** — tell me your departure city and dates\n• 🏨 **Hotels** — Shinjuku, Shibuya, Asakusa — depends on your vibe\n• 🎯 **Activities** — Tsukiji Market, Meiji Shrine, Akihabara, day trips`,
    Lisbon: `Lisbon${dur} — you'll love it! 🇵🇹\n\nWhat's first?\n• ✈️ **Flights** — where are you flying from?\n• 🏨 **Hotels** — Alfama for charm, Baixa for central, Bairro Alto for nightlife\n• 🎯 **Activities** — Tram 28, Belém Tower, pastéis de nata trail, day trip to Sintra`,
    Budapest: `Budapest${dur} — amazing choice! 🇭🇺\n\nWhat would you like to look at first?\n• ✈️ **Flights** — where are you flying from?\n• 🏨 **Hotels** — Buda side for views, Pest side for nightlife\n• 🎯 **Activities** — thermal baths, ruin bars, Parliament, Danube cruise`,
  };

  return intros[destination] || `${destination}${dur} sounds great! 🌍\n\nWhat would you like to look at first?\n• ✈️ **Flights** — where are you flying from and when?\n• 🏨 **Hotels** — I'll find options that match your budget\n• 🎯 **Activities** — top things to see and do`;
}

function getActivities(destination: string): string {
  const activities: Record<string, string> = {
    Bangkok: `Here are some top things to do in Bangkok:\n\n🏛️ **Culture & Temples**\n• Grand Palace & Wat Phra Kaew — the must-see (go early)\n• Wat Arun — stunning at sunset from across the river\n• Wat Pho — giant reclining Buddha + Thai massage school\n\n🍜 **Food**\n• Yaowarat (Chinatown) street food crawl — best after dark\n• Or Tor Kor Market — one of the world's best fresh markets\n• Cooking class — learn pad Thai and green curry from scratch (~€30-40)\n\n🌃 **Nightlife & Views**\n• Sky Bar at Lebua — the Hangover 2 rooftop, worth one drink for the view\n• Thonglor — where locals go for cocktails and live music\n\n🚣 **Day Trips**\n• Amphawa floating market (more authentic than Damnoen Saduak)\n• Ayutthaya ancient temples — 1.5h by train\n\nWant me to search for flights or hotels?`,
    Tokyo: `Top things to do in Tokyo:\n\n🏛️ **Culture**\n• Meiji Shrine — peaceful forest in the middle of Shibuya\n• Senso-ji in Asakusa — oldest temple, great street food nearby\n• Teamlab Borderless — immersive digital art (book ahead)\n\n🍣 **Food**\n• Tsukiji Outer Market — sushi breakfast is a must\n• Ramen street in Tokyo Station — tiny shops, incredible bowls\n• Golden Gai — 6-seat bars in Shinjuku, total experience\n\n🎮 **Fun**\n• Akihabara — gaming, anime, electronics\n• Mario Kart through the streets (yes, real)\n\n🏔️ **Day Trips**\n• Hakone — hot springs + Mt. Fuji views\n• Kamakura — giant Buddha + beach vibes\n\nWant me to search for flights or hotels?`,
    Budapest: `Top things to do in Budapest:\n\n♨️ **Thermal Baths**\n• Széchenyi — the famous yellow palace, huge outdoor pools\n• Gellért — beautiful art nouveau, more upscale\n• Rudas — rooftop pool with panoramic views\n\n🏛️ **Sightseeing**\n• Hungarian Parliament — stunning from the Danube, tours available\n• Fisherman's Bastion — best views of the city\n• Buda Castle — walk the castle district\n\n🍺 **Nightlife**\n• Ruin bars in the Jewish Quarter — Szimpla Kert is the original\n• Craft beer scene is excellent\n• Danube river cruise at night — Parliament all lit up\n\n🍴 **Food**\n• Central Market Hall — paprika, sausages, lángos\n• Goulash everywhere — try it in a bread bowl\n\nWant me to look at flights or hotels?`,
  };

  return activities[destination] || `I'll have detailed activity recommendations for ${destination} once our full database is connected. In the meantime, want me to help with flights or hotels?`;
}

function getHotelSuggestions(destination: string): string {
  const hotels: Record<string, string> = {
    Bangkok: `Hotel areas in Bangkok:\n\n💰 **Budget (€15-40/night)**\n• Khao San Road — backpacker central, cheap and cheerful\n• Silom — good transit links, local vibe\n\n⭐ **Mid-range (€40-100/night)**\n• Sukhumvit (BTS Asok/Nana) — modern, great restaurants, easy transit\n• Riverside — beautiful views, quieter\n\n💎 **Luxury (€100-300/night)**\n• Mandarin Oriental — legendary, right on the river\n• The Siam — boutique, art deco, stunning pool\n\n🏨 Real-time hotel prices with booking links coming soon! Want to look at flights instead?`,
    Tokyo: `Hotel areas in Tokyo:\n\n💰 **Budget (€30-60/night)**\n• Capsule hotels — unique experience, surprisingly comfortable\n• Asakusa — traditional area, cheaper than central\n\n⭐ **Mid-range (€60-150/night)**\n• Shinjuku — transit hub, nightlife, food everywhere\n• Shibuya — trendy, the famous crossing\n\n💎 **Luxury (€150-500/night)**\n• Park Hyatt — Lost in Translation hotel, Shinjuku views\n• Aman Tokyo — minimalist luxury near Imperial Palace\n\n🏨 Bookable hotels with price comparison coming soon! Want to check flights?`,
    Budapest: `Hotel areas in Budapest:\n\n💰 **Budget (€20-50/night)**\n• Jewish Quarter (District VII) — close to ruin bars, lively\n• Near Keleti station — good transit, affordable\n\n⭐ **Mid-range (€50-120/night)**\n• Pest center (District V) — walkable to everything\n• Along the Danube — great views\n\n💎 **Luxury (€120-300/night)**\n• Four Seasons Gresham Palace — art nouveau, Danube views\n• Aria Hotel — rooftop bar overlooking St. Stephen's Basilica\n\n🏨 Bookable hotels coming soon! Want me to search for flights?`,
  };

  return hotels[destination] || `I'll have hotel recommendations with real-time prices for ${destination} soon. Want to look at flights in the meantime?`;
}
