import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.FOOTBALL_API_KEY;
  
  if (!key) {
    return NextResponse.json({ error: "API key not found in environment" });
  }

  const res = await fetch("https://v3.football.api-sports.io/status", {
    headers: { "x-apisports-key": key },
  });
  const data = await res.json();
  return NextResponse.json({ keyFound: true, keyLength: key.length, data });
}