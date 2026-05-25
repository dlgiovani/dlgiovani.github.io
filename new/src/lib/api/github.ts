import { generateHeatmap } from '../github';

export interface LangEntry { name: string; pct: number; color: string; }

export interface GithubData {
  heatmap: number[][];
  langs: LangEntry[];
  stats: { commits: number; repos: number; streak: number; avgPerDay: number };
}

const FALLBACK: GithubData = {
  heatmap: generateHeatmap(42),
  langs: [
    { name: 'TypeScript', pct: 38, color: '#3178c6' },
    { name: 'Python',     pct: 24, color: '#3572a5' },
    { name: 'Rust',       pct: 14, color: '#b7410e' },
    { name: 'Go',         pct: 11, color: '#00add8' },
    { name: 'SQL',        pct:  7, color: '#cc6699' },
    { name: 'Shell',      pct:  6, color: '#89e051' },
  ],
  stats: { commits: 1247, repos: 38, streak: 24, avgPerDay: 14 },
};

const QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

function normCount(n: number): number {
  if (n === 0) return 0;
  if (n <= 3)  return 1;
  if (n <= 6)  return 2;
  if (n <= 9)  return 3;
  return 4;
}

function buildHeatmap(weeks: { contributionDays: { date: string; contributionCount: number }[] }[]): number[][] {
  return weeks.map(w => w.contributionDays.map(d => normCount(d.contributionCount)));
}

function calcStreak(weeks: { contributionDays: { date: string; contributionCount: number }[] }[]): number {
  const days = weeks.flatMap(w => w.contributionDays).reverse();
  let streak = 0;
  for (const d of days) {
    if (d.contributionCount > 0) streak++;
    else break;
  }
  return streak;
}

function calcAvgThisMonth(weeks: { contributionDays: { date: string; contributionCount: number }[] }[]): number {
  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const days = weeks.flatMap(w => w.contributionDays).filter(d => d.date.startsWith(ym));
  if (days.length === 0) return 0;
  const total = days.reduce((s, d) => s + d.contributionCount, 0);
  return Math.round(total / days.length);
}

function buildLangs(repos: { languages: { edges: { size: number; node: { name: string; color: string | null } }[] } }[]): LangEntry[] {
  const bytes = new Map<string, { size: number; color: string }>();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      const prev = bytes.get(node.name);
      bytes.set(node.name, { size: (prev?.size ?? 0) + size, color: node.color ?? '#888' });
    }
  }
  const sorted = [...bytes.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 6);
  const total = sorted.reduce((s, [, v]) => s + v.size, 0);
  return sorted.map(([name, v]) => ({
    name,
    pct: Math.round(v.size / total * 100),
    color: v.color,
  }));
}

let cache: GithubData | null = null;

export async function fetchGithubData(): Promise<GithubData> {
  if (cache) return cache;

  const token = import.meta.env.GITHUB_PAT;
  if (!token) {
    console.warn('[github] GITHUB_PAT not set — using mock data');
    return FALLBACK;
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: 'dlgiovani' } }),
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const json = await res.json() as {
      data?: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
            };
          };
          repositories: {
            totalCount: number;
            nodes: { languages: { edges: { size: number; node: { name: string; color: string | null } }[] } }[];
          };
        };
      };
      errors?: { message: string }[];
    };

    if (json.errors?.length) throw new Error(json.errors[0].message);

    const user = json.data!.user;
    const weeks = user.contributionsCollection.contributionCalendar.weeks;
    const allDays = weeks.flatMap(w => w.contributionDays);

    cache = {
      heatmap: buildHeatmap(weeks),
      langs: buildLangs(user.repositories.nodes),
      stats: {
        commits: allDays.reduce((s, d) => s + d.contributionCount, 0),
        repos: user.repositories.totalCount,
        streak: calcStreak(weeks),
        avgPerDay: calcAvgThisMonth(weeks),
      },
    };
    return cache;
  } catch (err) {
    console.warn('[github] API error, using mock data:', err);
    return FALLBACK;
  }
}
