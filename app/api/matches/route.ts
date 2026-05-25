import { NextResponse } from "next/server";

const ODDS_KEY = process.env.ODDS_API_KEY!;
const BASE = "https://api.the-odds-api.com/v4";

// In-memory cache shared across all requests on the same server instance
const cache: {
  live: { data: any[]; ts: number };
  upcoming: { data: any[]; ts: number };
} = {
  live: { data: [], ts: 0 },
  upcoming: { data: [], ts: 0 },
};

const LIVE_TTL = 2 * 60 * 1000;       // 2 minutes
const UPCOMING_TTL = 60 * 60 * 1000;  // 1 hour

async function fetchLiveScores() {
  const now = Date.now();
  if (now - cache.live.ts < LIVE_TTL) return cache.live.data;

  try {
    const res = await fetch(
      `${BASE}/sports/soccer_epl/scores/?apiKey=${ODDS_KEY}&daysFrom=1`
    );
    const data = await res.json();
    if (!Array.isArray(data)) return cache.live.data;

    const live = data
      .filter((g: any) => g.completed === false && g.scores)
      .map((g: any) => ({
        id: `live-${g.id}`,
        sport: "football",
        type: "live",
        homeTeam: g.home_team,
        awayTeam: g.away_team,
        league: "⚽ Premier League",
        homeScore: g.scores?.find((s: any) => s.name === g.home_team)?.score ?? null,
        awayScore: g.scores?.find((s: any) => s.name === g.away_team)?.score ?? null,
        status: "LIVE",
        elapsed: null,
        startTime: g.commence_time,
        odds: null,
      }));

    cache.live = { data: live, ts: now };
    return live;
  } catch {
    return cache.live.data;
  }
}

async function fetchUpcoming() {
  const now = Date.now();
  if (now - cache.upcoming.ts < UPCOMING_TTL) return cache.upcoming.data;

  async function fetchSport(sport: string, label: string) {
    try {
      const res = await fetch(
        `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_KEY}&regions=uk&markets=h2h&oddsFormat=decimal&dateFormat=iso`
      );
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data.slice(0, 5).map((g: any) => {
        const outcomes = g.bookmakers?.[0]?.markets?.find((m: any) => m.key === "h2h")?.outcomes ?? [];
        const home = outcomes.find((o: any) => o.name === g.home_team)?.price ?? null;
        const away = outcomes.find((o: any) => o.name === g.away_team)?.price ?? null;
        const draw = outcomes.find((o: any) => o.name === "Draw")?.price ?? null;
        return {
          id: `up-${g.id}`,
          sport: sport.includes("basket") ? "basketball" : "football",
          type: "upcoming",
          homeTeam: g.home_team,
          awayTeam: g.away_team,
          league: label,
          homeScore: null,
          awayScore: null,
          status: "NS",
          elapsed: null,
          startTime: g.commence_time,
          odds: home || away ? { home, draw, away } : null,
        };
      });
    } catch { return []; }
  }

  const [football, basketball] = await Promise.all([
    fetchSport("soccer_epl", "⚽ Premier League"),
    fetchSport("basketball_nba", "🏀 NBA"),
  ]);

  const upcoming = [...football, ...basketball];
  cache.upcoming = { data: upcoming, ts: now };
  return upcoming;
}

export async function GET() {
  const [live, upcoming] = await Promise.all([
    fetchLiveScores(),
    fetchUpcoming(),
  ]);

  return NextResponse.json({ live, upcoming });
}