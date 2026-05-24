import { NextResponse } from "next/server";

const FOOTBALL_KEY = process.env.FOOTBALL_API_KEY!;

async function fetchFootballLive() {
  try {
    const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: { "x-apisports-key": FOOTBALL_KEY },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return (data.response ?? []).map((f: any) => ({
      id: `fb-${f.fixture.id}`,
      sport: "football",
      type: "live",
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      league: f.league.name,
      homeScore: f.goals.home,
      awayScore: f.goals.away,
      status: f.fixture.status.short,
      elapsed: f.fixture.status.elapsed,
      startTime: null,
      odds: null,
    }));
  } catch { return []; }
}

async function fetchFootballUpcoming() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}&status=NS&timezone=UTC`,
      {
        headers: { "x-apisports-key": FOOTBALL_KEY },
        next: { revalidate: 300 },
      }
    );
    const data = await res.json();
    return (data.response ?? []).slice(0, 10).map((f: any) => ({
      id: `fb-up-${f.fixture.id}`,
      sport: "football",
      type: "upcoming",
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      league: f.league.name,
      homeScore: null,
      awayScore: null,
      status: "NS",
      elapsed: null,
      startTime: f.fixture.date,
      odds: f.odds?.[0]?.bookmakers?.[0]?.bets?.[0]?.values
        ? {
            home: f.odds[0].bookmakers[0].bets[0].values.find((v: any) => v.value === "Home")?.odd ?? null,
            draw: f.odds[0].bookmakers[0].bets[0].values.find((v: any) => v.value === "Draw")?.odd ?? null,
            away: f.odds[0].bookmakers[0].bets[0].values.find((v: any) => v.value === "Away")?.odd ?? null,
          }
        : null,
    }));
  } catch { return []; }
}

async function fetchBasketballLive() {
  try {
    const res = await fetch("https://v1.basketball.api-sports.io/games?live=all", {
      headers: { "x-apisports-key": FOOTBALL_KEY },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return (data.response ?? []).map((g: any) => ({
      id: `bb-${g.id}`,
      sport: "basketball",
      type: "live",
      homeTeam: g.teams.home.name,
      awayTeam: g.teams.away.name,
      league: g.league.name,
      homeScore: g.scores.home.total,
      awayScore: g.scores.away.total,
      status: g.status.short,
      elapsed: g.status.timer ?? null,
      startTime: null,
      odds: null,
    }));
  } catch { return []; }
}

async function fetchBasketballUpcoming() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `https://v1.basketball.api-sports.io/games?date=${today}&timezone=UTC`,
      {
        headers: { "x-apisports-key": FOOTBALL_KEY },
        next: { revalidate: 300 },
      }
    );
    const data = await res.json();
    return (data.response ?? [])
      .filter((g: any) => g.status.short === "NS")
      .slice(0, 10)
      .map((g: any) => ({
        id: `bb-up-${g.id}`,
        sport: "basketball",
        type: "upcoming",
        homeTeam: g.teams.home.name,
        awayTeam: g.teams.away.name,
        league: g.league.name,
        homeScore: null,
        awayScore: null,
        status: "NS",
        elapsed: null,
        startTime: g.date,
        odds: null,
      }));
  } catch { return []; }
}

export async function GET() {
  const [footballLive, footballUpcoming, basketballLive, basketballUpcoming] =
    await Promise.all([
      fetchFootballLive(),
      fetchFootballUpcoming(),
      fetchBasketballLive(),
      fetchBasketballUpcoming(),
    ]);

  return NextResponse.json({
    live: [...footballLive, ...basketballLive],
    upcoming: [...footballUpcoming, ...basketballUpcoming],
  });
}