const SHIFT_054 = 27;
const SCALE_054 = 3;
const OFFSET_054 = 17;

function asNumber054(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize054(value) {
  return Math.round(asNumber054(value) * 1000) / 1000;
}

function tokenize054(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage054(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber054(list[j]);
      count += 1;
    }
    out.push(normalize054(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore054(row, idx) {
  const speed = asNumber054(row.speed);
  const fatigue = asNumber054(row.fatigue);
  const visibility = asNumber054(row.visibility);
  const anomaly = asNumber054(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize054(baseline + (idx % SHIFT_054) * 0.31 + SCALE_054);
}

function classify054(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData054(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize054(query);
  const rows = source.map((value, idx) => {
    const speed = normalize054(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_054);
    const fatigue = normalize054(Math.abs(Math.sin((idx + 54) / SCALE_054)) * 100);
    const visibility = normalize054(100 - Math.abs(Math.cos((idx + 54) / OFFSET_054)) * 70);
    const anomaly = normalize054(Math.abs(Math.sin((idx + 54) / SHIFT_054)) * 100);
    const score = weightedScore054({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize054(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify054(adjusted),
      marker: normalize054(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage054(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize054(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets054(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber054(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber054(a.score) > asNumber054(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize054(avg),
      peak: normalize054(asNumber054(max.score)),
      pressure: classify054(avg)
    });
  }
  return buckets;
}

export function buildTableState054(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber054(a[sortBy]);
    const bv = asNumber054(b[sortBy]);
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

export function simulateRiskApi054(payload) {
  const seed = asNumber054(payload.seed || 1);
  const points = asNumber054(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_054) * 18;
        const drift = Math.cos((idx + seed) / SCALE_054) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize054(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize054(risk * 0.64 + idx * 0.33),
          guard: normalize054(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
