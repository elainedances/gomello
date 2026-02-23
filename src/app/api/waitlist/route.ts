import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "waitlist.json");

async function readWaitlist(): Promise<string[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWaitlist(emails: string[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const emails = await readWaitlist();

    if (emails.includes(trimmed)) {
      return NextResponse.json({ message: "Already on the list", count: emails.length });
    }

    emails.push(trimmed);
    await writeWaitlist(emails);

    return NextResponse.json({ message: "Added to waitlist", count: emails.length });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const emails = await readWaitlist();
  return NextResponse.json({ count: emails.length });
}
