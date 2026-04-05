const SHIFT_036 = 20;
const SCALE_036 = 3;
const OFFSET_036 = 13;

function asNumber036(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize036(value) {
  return Math.round(asNumber036(value) * 1000) / 1000;
}

function tokenize036(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage036(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber036(list[j]);
      count += 1;
    }
    out.push(normalize036(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore036(row, idx) {
  const speed = asNumber036(row.speed);
  const fatigue = asNumber036(row.fatigue);
  const visibility = asNumber036(row.visibility);
  const anomaly = asNumber036(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize036(baseline + (idx % SHIFT_036) * 0.31 + SCALE_036);
}

function classify036(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData036(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize036(query);
  const rows = source.map((value, idx) => {
    const speed = normalize036(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_036);
    const fatigue = normalize036(Math.abs(Math.sin((idx + 36) / SCALE_036)) * 100);
    const visibility = normalize036(100 - Math.abs(Math.cos((idx + 36) / OFFSET_036)) * 70);
    const anomaly = normalize036(Math.abs(Math.sin((idx + 36) / SHIFT_036)) * 100);
    const score = weightedScore036({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize036(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify036(adjusted),
      marker: normalize036(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage036(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize036(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets036(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber036(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber036(a.score) > asNumber036(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize036(avg),
      peak: normalize036(asNumber036(max.score)),
      pressure: classify036(avg)
    });
  }
  return buckets;
}

export function buildTableState036(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber036(a[sortBy]);
    const bv = asNumber036(b[sortBy]);
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

export function simulateRiskApi036(payload) {
  const seed = asNumber036(payload.seed || 1);
  const points = asNumber036(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_036) * 18;
        const drift = Math.cos((idx + seed) / SCALE_036) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize036(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize036(risk * 0.64 + idx * 0.33),
          guard: normalize036(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
