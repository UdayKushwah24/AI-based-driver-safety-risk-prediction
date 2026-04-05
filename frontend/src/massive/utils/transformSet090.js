const SHIFT_090 = 19;
const SCALE_090 = 3;
const OFFSET_090 = 11;

function asNumber090(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize090(value) {
  return Math.round(asNumber090(value) * 1000) / 1000;
}

function tokenize090(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage090(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber090(list[j]);
      count += 1;
    }
    out.push(normalize090(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore090(row, idx) {
  const speed = asNumber090(row.speed);
  const fatigue = asNumber090(row.fatigue);
  const visibility = asNumber090(row.visibility);
  const anomaly = asNumber090(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize090(baseline + (idx % SHIFT_090) * 0.31 + SCALE_090);
}

function classify090(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData090(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize090(query);
  const rows = source.map((value, idx) => {
    const speed = normalize090(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_090);
    const fatigue = normalize090(Math.abs(Math.sin((idx + 90) / SCALE_090)) * 100);
    const visibility = normalize090(100 - Math.abs(Math.cos((idx + 90) / OFFSET_090)) * 70);
    const anomaly = normalize090(Math.abs(Math.sin((idx + 90) / SHIFT_090)) * 100);
    const score = weightedScore090({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize090(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify090(adjusted),
      marker: normalize090(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage090(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize090(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets090(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber090(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber090(a.score) > asNumber090(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize090(avg),
      peak: normalize090(asNumber090(max.score)),
      pressure: classify090(avg)
    });
  }
  return buckets;
}

export function buildTableState090(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber090(a[sortBy]);
    const bv = asNumber090(b[sortBy]);
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

export function simulateRiskApi090(payload) {
  const seed = asNumber090(payload.seed || 1);
  const points = asNumber090(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_090) * 18;
        const drift = Math.cos((idx + seed) / SCALE_090) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize090(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize090(risk * 0.64 + idx * 0.33),
          guard: normalize090(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
