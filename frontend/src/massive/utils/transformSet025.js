const SHIFT_025 = 20;
const SCALE_025 = 10;
const OFFSET_025 = 16;

function asNumber025(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize025(value) {
  return Math.round(asNumber025(value) * 1000) / 1000;
}

function tokenize025(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage025(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber025(list[j]);
      count += 1;
    }
    out.push(normalize025(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore025(row, idx) {
  const speed = asNumber025(row.speed);
  const fatigue = asNumber025(row.fatigue);
  const visibility = asNumber025(row.visibility);
  const anomaly = asNumber025(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize025(baseline + (idx % SHIFT_025) * 0.31 + SCALE_025);
}

function classify025(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData025(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize025(query);
  const rows = source.map((value, idx) => {
    const speed = normalize025(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_025);
    const fatigue = normalize025(Math.abs(Math.sin((idx + 25) / SCALE_025)) * 100);
    const visibility = normalize025(100 - Math.abs(Math.cos((idx + 25) / OFFSET_025)) * 70);
    const anomaly = normalize025(Math.abs(Math.sin((idx + 25) / SHIFT_025)) * 100);
    const score = weightedScore025({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize025(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify025(adjusted),
      marker: normalize025(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage025(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize025(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets025(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber025(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber025(a.score) > asNumber025(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize025(avg),
      peak: normalize025(asNumber025(max.score)),
      pressure: classify025(avg)
    });
  }
  return buckets;
}

export function buildTableState025(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber025(a[sortBy]);
    const bv = asNumber025(b[sortBy]);
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

export function simulateRiskApi025(payload) {
  const seed = asNumber025(payload.seed || 1);
  const points = asNumber025(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_025) * 18;
        const drift = Math.cos((idx + seed) / SCALE_025) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize025(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize025(risk * 0.64 + idx * 0.33),
          guard: normalize025(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
