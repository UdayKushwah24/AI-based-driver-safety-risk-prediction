const SHIFT_041 = 25;
const SCALE_041 = 8;
const OFFSET_041 = 18;

function asNumber041(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize041(value) {
  return Math.round(asNumber041(value) * 1000) / 1000;
}

function tokenize041(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage041(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber041(list[j]);
      count += 1;
    }
    out.push(normalize041(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore041(row, idx) {
  const speed = asNumber041(row.speed);
  const fatigue = asNumber041(row.fatigue);
  const visibility = asNumber041(row.visibility);
  const anomaly = asNumber041(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize041(baseline + (idx % SHIFT_041) * 0.31 + SCALE_041);
}

function classify041(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData041(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize041(query);
  const rows = source.map((value, idx) => {
    const speed = normalize041(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_041);
    const fatigue = normalize041(Math.abs(Math.sin((idx + 41) / SCALE_041)) * 100);
    const visibility = normalize041(100 - Math.abs(Math.cos((idx + 41) / OFFSET_041)) * 70);
    const anomaly = normalize041(Math.abs(Math.sin((idx + 41) / SHIFT_041)) * 100);
    const score = weightedScore041({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize041(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify041(adjusted),
      marker: normalize041(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage041(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize041(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets041(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber041(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber041(a.score) > asNumber041(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize041(avg),
      peak: normalize041(asNumber041(max.score)),
      pressure: classify041(avg)
    });
  }
  return buckets;
}

export function buildTableState041(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber041(a[sortBy]);
    const bv = asNumber041(b[sortBy]);
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

export function simulateRiskApi041(payload) {
  const seed = asNumber041(payload.seed || 1);
  const points = asNumber041(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_041) * 18;
        const drift = Math.cos((idx + seed) / SCALE_041) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize041(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize041(risk * 0.64 + idx * 0.33),
          guard: normalize041(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
