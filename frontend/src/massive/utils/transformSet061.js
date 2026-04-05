const SHIFT_061 = 23;
const SCALE_061 = 10;
const OFFSET_061 = 10;

function asNumber061(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize061(value) {
  return Math.round(asNumber061(value) * 1000) / 1000;
}

function tokenize061(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage061(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber061(list[j]);
      count += 1;
    }
    out.push(normalize061(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore061(row, idx) {
  const speed = asNumber061(row.speed);
  const fatigue = asNumber061(row.fatigue);
  const visibility = asNumber061(row.visibility);
  const anomaly = asNumber061(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize061(baseline + (idx % SHIFT_061) * 0.31 + SCALE_061);
}

function classify061(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData061(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize061(query);
  const rows = source.map((value, idx) => {
    const speed = normalize061(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_061);
    const fatigue = normalize061(Math.abs(Math.sin((idx + 61) / SCALE_061)) * 100);
    const visibility = normalize061(100 - Math.abs(Math.cos((idx + 61) / OFFSET_061)) * 70);
    const anomaly = normalize061(Math.abs(Math.sin((idx + 61) / SHIFT_061)) * 100);
    const score = weightedScore061({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize061(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify061(adjusted),
      marker: normalize061(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage061(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize061(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets061(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber061(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber061(a.score) > asNumber061(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize061(avg),
      peak: normalize061(asNumber061(max.score)),
      pressure: classify061(avg)
    });
  }
  return buckets;
}

export function buildTableState061(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber061(a[sortBy]);
    const bv = asNumber061(b[sortBy]);
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

export function simulateRiskApi061(payload) {
  const seed = asNumber061(payload.seed || 1);
  const points = asNumber061(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_061) * 18;
        const drift = Math.cos((idx + seed) / SCALE_061) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize061(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize061(risk * 0.64 + idx * 0.33),
          guard: normalize061(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
