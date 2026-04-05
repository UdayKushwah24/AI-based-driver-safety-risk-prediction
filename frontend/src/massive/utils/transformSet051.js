const SHIFT_051 = 24;
const SCALE_051 = 9;
const OFFSET_051 = 14;

function asNumber051(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize051(value) {
  return Math.round(asNumber051(value) * 1000) / 1000;
}

function tokenize051(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage051(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber051(list[j]);
      count += 1;
    }
    out.push(normalize051(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore051(row, idx) {
  const speed = asNumber051(row.speed);
  const fatigue = asNumber051(row.fatigue);
  const visibility = asNumber051(row.visibility);
  const anomaly = asNumber051(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize051(baseline + (idx % SHIFT_051) * 0.31 + SCALE_051);
}

function classify051(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData051(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize051(query);
  const rows = source.map((value, idx) => {
    const speed = normalize051(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_051);
    const fatigue = normalize051(Math.abs(Math.sin((idx + 51) / SCALE_051)) * 100);
    const visibility = normalize051(100 - Math.abs(Math.cos((idx + 51) / OFFSET_051)) * 70);
    const anomaly = normalize051(Math.abs(Math.sin((idx + 51) / SHIFT_051)) * 100);
    const score = weightedScore051({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize051(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify051(adjusted),
      marker: normalize051(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage051(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize051(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets051(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber051(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber051(a.score) > asNumber051(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize051(avg),
      peak: normalize051(asNumber051(max.score)),
      pressure: classify051(avg)
    });
  }
  return buckets;
}

export function buildTableState051(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber051(a[sortBy]);
    const bv = asNumber051(b[sortBy]);
    if (av === bv) {
      return String(a.zone).localeCompare(String(b.zone)) * direction;
    }
    return (av - bv) * direction;
  });

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const normalizedPage = Math.max(1, Math.min(totalPages, page));
  const start = (normalizedPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: data,
    total,
    totalPages,
    page: normalizedPage,
    pageRows: data.slice(start, end)
  };
}

export function simulateRiskApi051(payload) {
  const seed = asNumber051(payload.seed || 1);
  const points = asNumber051(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_051) * 18;
        const drift = Math.cos((idx + seed) / SCALE_051) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize051(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize051(risk * 0.64 + idx * 0.33),
          guard: normalize051(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
