const SHIFT_031 = 26;
const SCALE_031 = 7;
const OFFSET_031 = 8;

function asNumber031(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize031(value) {
  return Math.round(asNumber031(value) * 1000) / 1000;
}

function tokenize031(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage031(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber031(list[j]);
      count += 1;
    }
    out.push(normalize031(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore031(row, idx) {
  const speed = asNumber031(row.speed);
  const fatigue = asNumber031(row.fatigue);
  const visibility = asNumber031(row.visibility);
  const anomaly = asNumber031(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize031(baseline + (idx % SHIFT_031) * 0.31 + SCALE_031);
}

function classify031(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData031(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize031(query);
  const rows = source.map((value, idx) => {
    const speed = normalize031(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_031);
    const fatigue = normalize031(Math.abs(Math.sin((idx + 31) / SCALE_031)) * 100);
    const visibility = normalize031(100 - Math.abs(Math.cos((idx + 31) / OFFSET_031)) * 70);
    const anomaly = normalize031(Math.abs(Math.sin((idx + 31) / SHIFT_031)) * 100);
    const score = weightedScore031({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize031(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify031(adjusted),
      marker: normalize031(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage031(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize031(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets031(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber031(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber031(a.score) > asNumber031(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize031(avg),
      peak: normalize031(asNumber031(max.score)),
      pressure: classify031(avg)
    });
  }
  return buckets;
}

export function buildTableState031(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber031(a[sortBy]);
    const bv = asNumber031(b[sortBy]);
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

export function simulateRiskApi031(payload) {
  const seed = asNumber031(payload.seed || 1);
  const points = asNumber031(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_031) * 18;
        const drift = Math.cos((idx + seed) / SCALE_031) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize031(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize031(risk * 0.64 + idx * 0.33),
          guard: normalize031(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
