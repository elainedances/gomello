"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FlightCard from "@/components/FlightCard";
import { ChatMessage, FlightResult } from "@/lib/types";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! 👋 Where do you want to go? Just tell me in your own words — like \"flights from Copenhagen to Bangkok in April\" or \"somewhere warm for a week under €500.\"",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "Sorry, something went wrong. Try again?",
        flights: data.flights || undefined,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Couldn't connect to the server. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          go<span className="text-emerald-600">mello</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
            Beta — mock data
          </span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-[15px]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[90%]">
                    <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md text-gray-800 text-[15px] shadow-sm">
                      {msg.content}
                    </div>
                    {msg.flights && (
                      <div className="mt-4 space-y-4">
                        {msg.flights.map((flight: FlightResult) => (
                          <FlightCard key={flight.id} flight={flight} />
                        ))}
                        <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
                          💡 Prices shown are examples — real search coming soon. Want to be notified?{" "}
                          <Link href="/" className="text-emerald-600 hover:underline">Join the waitlist</Link>.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shrink-0">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Where do you want to go?"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[15px] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors cursor-pointer text-[15px]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
