function toNumberP58(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeP58(value) {
  return Math.round(toNumberP58(value) * 1000) / 1000;
}

export function synthesizeFlow58(rows, cycle = 0) {
  const source = Array.isArray(rows) ? rows : [];
  const output = [];
  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const score = toNumberP58(row.score || 0);
    const smooth = toNumberP58(row.smooth || score);
    const wave = Math.sin((i + cycle + 58) / 5) * 6;
    const drift = Math.cos((i + cycle + 58) / 7) * 4;
    const route = normalizeP58(score * 0.58 + smooth * 0.24 + wave + drift + (i % 6) * 0.7);
    const buffer = normalizeP58(route * 0.66 + (score - smooth) * 0.34);
    const demand = normalizeP58(Math.abs(route - buffer) * 3.2 + (row.visibility || 0) * 0.18);
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

export function rankBuckets58(flow, bucketSize = 10) {
  const source = Array.isArray(flow) ? flow : [];
  const buckets = [];
  for (let i = 0; i < source.length; i += bucketSize) {
    const part = source.slice(i, i + bucketSize);
    const avgRoute = normalizeP58(part.reduce((sum, row) => sum + toNumberP58(row.route), 0) / Math.max(1, part.length));
    const avgDemand = normalizeP58(part.reduce((sum, row) => sum + toNumberP58(row.demand), 0) / Math.max(1, part.length));
    const pressure = normalizeP58(avgRoute * 0.41 + avgDemand * 0.59 + (i / Math.max(1, bucketSize)) * 0.8);
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

export function buildActivityMap58(flow, width = 8, height = 8) {
  const source = Array.isArray(flow) ? flow : [];
  const matrix = [];
  for (let r = 0; r < height; r += 1) {
    const row = [];
    for (let c = 0; c < width; c += 1) {
      const ref = source[(r * width + c) % Math.max(1, source.length)] || { route: 0, demand: 0 };
      const value = normalizeP58(toNumberP58(ref.route) * 0.64 + toNumberP58(ref.demand) * 0.36 + r * 0.9 + c * 0.6);
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

export function summarizePipeline58(flow, buckets) {
  const list = Array.isArray(flow) ? flow : [];
  const bucketList = Array.isArray(buckets) ? buckets : [];
  const totalDemand = normalizeP58(list.reduce((sum, row) => sum + toNumberP58(row.demand), 0));
  const avgDemand = normalizeP58(totalDemand / Math.max(1, list.length));
  const maxPressure = normalizeP58(bucketList.reduce((max, row) => Math.max(max, toNumberP58(row.pressure)), 0));
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
      ratio: normalizeP58((levelCounts[key] / total) * 100),
    })),
  };
}
