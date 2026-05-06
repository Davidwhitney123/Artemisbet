import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": process.env.FOOTBALL_API_KEY!,
        },
        next: { revalidate: 60 },
      }
    );

    const data = await res.json();

    const matches = data.response?.map((fixture: any) => ({
      id: fixture.fixture.id,
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      league: fixture.league.name,
      homeScore: fixture.goals.home,
      awayScore: fixture.goals.away,
      status: fixture.fixture.status.short,
      elapsed: fixture.fixture.status.elapsed,
    })) ?? [];

    return NextResponse.json(matches);
  } catch (err) {
    return NextResponse.json([]);
  }
}