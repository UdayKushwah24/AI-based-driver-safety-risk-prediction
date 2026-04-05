const SHIFT_035 = 19;
const SCALE_035 = 11;
const OFFSET_035 = 12;

function asNumber035(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize035(value) {
  return Math.round(asNumber035(value) * 1000) / 1000;
}

function tokenize035(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage035(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber035(list[j]);
      count += 1;
    }
    out.push(normalize035(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore035(row, idx) {
  const speed = asNumber035(row.speed);
  const fatigue = asNumber035(row.fatigue);
  const visibility = asNumber035(row.visibility);
  const anomaly = asNumber035(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize035(baseline + (idx % SHIFT_035) * 0.31 + SCALE_035);
}

function classify035(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData035(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize035(query);
  const rows = source.map((value, idx) => {
    const speed = normalize035(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_035);
    const fatigue = normalize035(Math.abs(Math.sin((idx + 35) / SCALE_035)) * 100);
    const visibility = normalize035(100 - Math.abs(Math.cos((idx + 35) / OFFSET_035)) * 70);
    const anomaly = normalize035(Math.abs(Math.sin((idx + 35) / SHIFT_035)) * 100);
    const score = weightedScore035({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize035(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify035(adjusted),
      marker: normalize035(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage035(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize035(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets035(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber035(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber035(a.score) > asNumber035(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize035(avg),
      peak: normalize035(asNumber035(max.score)),
      pressure: classify035(avg)
    });
  }
  return buckets;
}

export function buildTableState035(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber035(a[sortBy]);
    const bv = asNumber035(b[sortBy]);
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

export function simulateRiskApi035(payload) {
  const seed = asNumber035(payload.seed || 1);
  const points = asNumber035(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_035) * 18;
        const drift = Math.cos((idx + seed) / SCALE_035) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize035(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize035(risk * 0.64 + idx * 0.33),
          guard: normalize035(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
