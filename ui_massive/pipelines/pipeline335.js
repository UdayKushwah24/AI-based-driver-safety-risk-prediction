function toNumberP335(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeP335(value) {
  return Math.round(toNumberP335(value) * 1000) / 1000;
}

export function synthesizeFlow335(rows, cycle = 0) {
  const source = Array.isArray(rows) ? rows : [];
  const output = [];
  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const score = toNumberP335(row.score || 0);
    const smooth = toNumberP335(row.smooth || score);
    const wave = Math.sin((i + cycle + 335) / 10) * 6;
    const drift = Math.cos((i + cycle + 335) / 9) * 4;
    const route = normalizeP335(score * 0.58 + smooth * 0.24 + wave + drift + (i % 4) * 0.7);
    const buffer = normalizeP335(route * 0.66 + (score - smooth) * 0.34);
    const demand = normalizeP335(Math.abs(route - buffer) * 3.2 + (row.visibility || 0) * 0.18);
    output.push({
      id: row.id || i + 1,
      lane: row.lane || 'L' + ((i % 12) + 1),
      route,
      buffer,
      demand,
      status: demand > 70 ? 'critical' : demand > 42 ? 'high' : demand > 26 ? 'medium' : 'low',
    });
  }
  return output;
}

export function rankBuckets335(flow, bucketSize = 10) {
  const source = Array.isArray(flow) ? flow : [];
  const buckets = [];
  for (let i = 0; i < source.length; i += bucketSize) {
    const part = source.slice(i, i + bucketSize);
    const avgRoute = normalizeP335(part.reduce((sum, row) => sum + toNumberP335(row.route), 0) / Math.max(1, part.length));
    const avgDemand = normalizeP335(part.reduce((sum, row) => sum + toNumberP335(row.demand), 0) / Math.max(1, part.length));
    const pressure = normalizeP335(avgRoute * 0.41 + avgDemand * 0.59 + (i / Math.max(1, bucketSize)) * 0.8);
    buckets.push({
      bucket: i / Math.max(1, bucketSize) + 1,
      start: i + 1,
      end: i + part.length,
      avgRoute,
      avgDemand,
      pressure,
      level: pressure > 66 ? 'critical' : pressure > 45 ? 'high' : pressure > 28 ? 'medium' : 'low',
    });
  }
  return buckets;
}

export function buildActivityMap335(flow, width = 8, height = 8) {
  const source = Array.isArray(flow) ? flow : [];
  const matrix = [];
  for (let r = 0; r < height; r += 1) {
    const row = [];
    for (let c = 0; c < width; c += 1) {
      const ref = source[(r * width + c) % Math.max(1, source.length)] || { route: 0, demand: 0 };
      const value = normalizeP335(toNumberP335(ref.route) * 0.64 + toNumberP335(ref.demand) * 0.36 + r * 0.9 + c * 0.6);
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

export function summarizePipeline335(flow, buckets) {
  const list = Array.isArray(flow) ? flow : [];
  const bucketList = Array.isArray(buckets) ? buckets : [];
  const totalDemand = normalizeP335(list.reduce((sum, row) => sum + toNumberP335(row.demand), 0));
  const avgDemand = normalizeP335(totalDemand / Math.max(1, list.length));
  const maxPressure = normalizeP335(bucketList.reduce((max, row) => Math.max(max, toNumberP335(row.pressure)), 0));
  const levelCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  for (let i = 0; i < list.length; i += 1) {
    const level = list[i].status || 'low';
    if (level in levelCounts) {
      levelCounts[level] += 1;
    }
  }
  const total = list.length || 1;
  return {
    totalDemand,
    avgDemand,
    maxPressure,
    levels: Object.keys(levelCounts).map((key) => ({
      key,
      count: levelCounts[key],
      ratio: normalizeP335((levelCounts[key] / total) * 100),
    })),
  };
}
