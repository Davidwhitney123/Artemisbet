import { NextResponse } from "next/server";

const ODDS_KEY = process.env.ODDS_API_KEY!;
const BASE = "https://api.the-odds-api.com/v4";

async function fetchLiveScores() {
  try {
    const res = await fetch(
      `${BASE}/sports/soccer_epl/scores/?apiKey=${ODDS_KEY}&daysFrom=1`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((g: any) => g.completed === false && g.scores)
      .map((g: any) => ({
        id: `live-${g.id}`,
        sport: "football",
        type: "live",
        homeTeam: g.home_team,
        awayTeam: g.away_team,
        league: "Premier League",
        homeScore: g.scores?.find((s: any) => s.name === g.home_team)?.score ?? null,
        awayScore: g.scores?.find((s: any) => s.name === g.away_team)?.score ?? null,
        status: "LIVE",
        elapsed: null,
        startTime: g.commence_time,
        odds: null,
      }));
  } catch { return []; }
}

async function fetchUpcomingWithOdds(sport: string, label: string, sportEmoji: string) {
  try {
    const res = await fetch(
      `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_KEY}&regions=uk&markets=h2h&oddsFormat=decimal&dateFormat=iso`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.slice(0, 8).map((g: any) => {
      const bookmaker = g.bookmakers?.[0];
      const market = bookmaker?.markets?.find((m: any) => m.key === "h2h");
      const outcomes = market?.outcomes ?? [];
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

export async function GET() {
  const [live, football, basketball] = await Promise.all([
    fetchLiveScores(),
    fetchUpcomingWithOdds("soccer_epl", "⚽ Premier League", "⚽"),
    fetchUpcomingWithOdds("basketball_nba", "🏀 NBA", "🏀"),
  ]);

  return NextResponse.json({
    live,
    upcoming: [...football, ...basketball],
  });
}