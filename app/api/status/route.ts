import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://v3.football.api-sports.io/status", {
    headers: { "x-apisports-key": process.env.FOOTBALL_API_KEY! },
  });
  const data = await res.json();
  return NextResponse.json(data);
}