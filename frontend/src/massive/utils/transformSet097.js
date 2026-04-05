const SHIFT_097 = 26;
const SCALE_097 = 10;
const OFFSET_097 = 18;

function asNumber097(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize097(value) {
  return Math.round(asNumber097(value) * 1000) / 1000;
}

function tokenize097(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage097(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber097(list[j]);
      count += 1;
    }
    out.push(normalize097(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore097(row, idx) {
  const speed = asNumber097(row.speed);
  const fatigue = asNumber097(row.fatigue);
  const visibility = asNumber097(row.visibility);
  const anomaly = asNumber097(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize097(baseline + (idx % SHIFT_097) * 0.31 + SCALE_097);
}

function classify097(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData097(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize097(query);
  const rows = source.map((value, idx) => {
    const speed = normalize097(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_097);
    const fatigue = normalize097(Math.abs(Math.sin((idx + 97) / SCALE_097)) * 100);
    const visibility = normalize097(100 - Math.abs(Math.cos((idx + 97) / OFFSET_097)) * 70);
    const anomaly = normalize097(Math.abs(Math.sin((idx + 97) / SHIFT_097)) * 100);
    const score = weightedScore097({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize097(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify097(adjusted),
      marker: normalize097(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage097(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize097(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets097(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber097(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber097(a.score) > asNumber097(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize097(avg),
      peak: normalize097(asNumber097(max.score)),
      pressure: classify097(avg)
    });
  }
  return buckets;
}

export function buildTableState097(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber097(a[sortBy]);
    const bv = asNumber097(b[sortBy]);
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

export function simulateRiskApi097(payload) {
  const seed = asNumber097(payload.seed || 1);
  const points = asNumber097(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_097) * 18;
        const drift = Math.cos((idx + seed) / SCALE_097) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize097(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize097(risk * 0.64 + idx * 0.33),
          guard: normalize097(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
