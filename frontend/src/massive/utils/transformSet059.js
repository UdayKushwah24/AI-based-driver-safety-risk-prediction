const SHIFT_059 = 21;
const SCALE_059 = 8;
const OFFSET_059 = 8;

function asNumber059(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize059(value) {
  return Math.round(asNumber059(value) * 1000) / 1000;
}

function tokenize059(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage059(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber059(list[j]);
      count += 1;
    }
    out.push(normalize059(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore059(row, idx) {
  const speed = asNumber059(row.speed);
  const fatigue = asNumber059(row.fatigue);
  const visibility = asNumber059(row.visibility);
  const anomaly = asNumber059(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize059(baseline + (idx % SHIFT_059) * 0.31 + SCALE_059);
}

function classify059(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData059(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize059(query);
  const rows = source.map((value, idx) => {
    const speed = normalize059(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_059);
    const fatigue = normalize059(Math.abs(Math.sin((idx + 59) / SCALE_059)) * 100);
    const visibility = normalize059(100 - Math.abs(Math.cos((idx + 59) / OFFSET_059)) * 70);
    const anomaly = normalize059(Math.abs(Math.sin((idx + 59) / SHIFT_059)) * 100);
    const score = weightedScore059({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize059(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify059(adjusted),
      marker: normalize059(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage059(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize059(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets059(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber059(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber059(a.score) > asNumber059(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize059(avg),
      peak: normalize059(asNumber059(max.score)),
      pressure: classify059(avg)
    });
  }
  return buckets;
}

export function buildTableState059(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber059(a[sortBy]);
    const bv = asNumber059(b[sortBy]);
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

export function simulateRiskApi059(payload) {
  const seed = asNumber059(payload.seed || 1);
  const points = asNumber059(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_059) * 18;
        const drift = Math.cos((idx + seed) / SCALE_059) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize059(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize059(risk * 0.64 + idx * 0.33),
          guard: normalize059(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
