const SHIFT_116 = 23;
const SCALE_116 = 11;
const OFFSET_116 = 9;

function asNumber116(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize116(value) {
  return Math.round(asNumber116(value) * 1000) / 1000;
}

function tokenize116(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage116(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber116(list[j]);
      count += 1;
    }
    out.push(normalize116(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore116(row, idx) {
  const speed = asNumber116(row.speed);
  const fatigue = asNumber116(row.fatigue);
  const visibility = asNumber116(row.visibility);
  const anomaly = asNumber116(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize116(baseline + (idx % SHIFT_116) * 0.31 + SCALE_116);
}

function classify116(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData116(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize116(query);
  const rows = source.map((value, idx) => {
    const speed = normalize116(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_116);
    const fatigue = normalize116(Math.abs(Math.sin((idx + 116) / SCALE_116)) * 100);
    const visibility = normalize116(100 - Math.abs(Math.cos((idx + 116) / OFFSET_116)) * 70);
    const anomaly = normalize116(Math.abs(Math.sin((idx + 116) / SHIFT_116)) * 100);
    const score = weightedScore116({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize116(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify116(adjusted),
      marker: normalize116(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage116(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize116(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets116(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber116(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber116(a.score) > asNumber116(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize116(avg),
      peak: normalize116(asNumber116(max.score)),
      pressure: classify116(avg)
    });
  }
  return buckets;
}

export function buildTableState116(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber116(a[sortBy]);
    const bv = asNumber116(b[sortBy]);
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

export function simulateRiskApi116(payload) {
  const seed = asNumber116(payload.seed || 1);
  const points = asNumber116(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_116) * 18;
        const drift = Math.cos((idx + seed) / SCALE_116) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize116(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize116(risk * 0.64 + idx * 0.33),
          guard: normalize116(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
