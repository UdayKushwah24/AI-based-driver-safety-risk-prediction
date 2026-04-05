const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(repoRoot, 'ui_massive');

const COUNTS = {
  components: 1100,
  hooks: 550,
  utils: 550,
  pipelines: 550,
  pages: 140,
  componentsPerPage: 10,
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimEnd() + '\n');
}

function hookContent(index) {
  const multA = (index % 7) + 3;
  const multB = (index % 11) + 5;
  const multC = (index % 13) + 7;
  return `import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const source${index} = Array.from({ length: 96 }, (_, idx) => {
  const wave = Math.sin((idx + ${index}) / ${multA}) * 11;
  const drift = Math.cos((idx + ${index}) / ${multB}) * 9;
  const edge = ((idx * ${index}) % 19) - 9;
  return Number((48 + wave + drift + edge).toFixed(4));
});

const initialState${index} = {
  mode: 'balanced',
  granularity: ${multA},
  tick: 0,
  status: 'idle',
  queue: [],
  quality: 0,
  pressure: ${(index % 8) + 3},
  marker: 0,
};

function reducer${index}(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'granularity') return { ...state, granularity: Math.max(2, Math.min(16, action.payload)) };
  if (action.type === 'tick') return { ...state, tick: state.tick + 1 };
  if (action.type === 'status') return { ...state, status: action.payload };
  if (action.type === 'queue') return { ...state, queue: action.payload.slice(-40) };
  if (action.type === 'quality') return { ...state, quality: action.payload };
  if (action.type === 'pressure') return { ...state, pressure: Math.max(1, action.payload) };
  if (action.type === 'marker') return { ...state, marker: action.payload };
  return state;
}

function toNumber${index}(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize${index}(value) {
  return Math.round(toNumber${index}(value) * 1000) / 1000;
}

function smooth${index}(input, radius) {
  const result = [];
  for (let i = 0; i < input.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(input.length - 1, i + radius); j += 1) {
      total += input[j];
      count += 1;
    }
    result.push(normalize${index}(total / Math.max(1, count)));
  }
  return result;
}

function derive${index}(series, mode) {
  const total = series.reduce((sum, value) => sum + value, 0);
  const avg = total / Math.max(1, series.length);
  const peak = series.reduce((max, value) => Math.max(max, value), -Infinity);
  const valley = series.reduce((min, value) => Math.min(min, value), Infinity);
  const variance = series.reduce((acc, value) => acc + (value - avg) ** 2, 0) / Math.max(1, series.length);
  const spread = normalize${index}(peak - valley);
  const jitter = normalize${index}(Math.sqrt(variance));
  const modeShift = mode === 'safe' ? -5 : mode === 'aggressive' ? 8 : 1;
  const risk = normalize${index}(avg * 0.36 + spread * 0.29 + jitter * 0.35 + modeShift);
  const confidence = normalize${index}(100 - Math.abs(risk - 50) * 0.9);
  return {
    avg: normalize${index}(avg),
    peak: normalize${index}(peak),
    valley: normalize${index}(valley),
    spread,
    jitter,
    risk,
    confidence,
  };
}

function fakeFetch${index}(seed, mode, pressure) {
  return new Promise((resolve) => {
    const wait = 10 + (seed % 5) * 5 + (pressure % 4) * 3;
    setTimeout(() => {
      const payload = Array.from({ length: 22 }, (_, idx) => {
        const a = Math.sin((idx + seed) / ${multC}) * 8;
        const b = Math.cos((idx + seed) / ${multA}) * 6;
        const c = mode === 'safe' ? -4 : mode === 'aggressive' ? 6 : 0;
        return normalize${index}(a + b + c + (pressure % 7));
      });
      resolve(payload);
    }, wait);
  });
}

export function useLogic${index}(initialSeed = ${index}) {
  const [seed, setSeed] = useState(initialSeed);
  const [state, dispatch] = useReducer(reducer${index}, initialState${index});

  useEffect(() => {
    let live = true;
    dispatch({ type: 'status', payload: 'loading' });
    fakeFetch${index}(seed, state.mode, state.pressure).then((payload) => {
      if (!live) {
        return;
      }
      dispatch({ type: 'queue', payload });
      dispatch({ type: 'status', payload: 'ready' });
    });
    return () => {
      live = false;
    };
  }, [seed, state.mode, state.tick, state.pressure]);

  const series = useMemo(() => {
    const merged = source${index}.map((value, idx) => {
      const queueValue = state.queue[idx % Math.max(1, state.queue.length)] || 0;
      const modeShift = state.mode === 'safe' ? -7 : state.mode === 'aggressive' ? 9 : 0;
      const pressureShift = state.pressure * 0.4;
      return normalize${index}(value + queueValue * 0.5 + modeShift + pressureShift + idx * 0.04 + (seed % 11));
    });
    return smooth${index}(merged, state.granularity);
  }, [seed, state.queue, state.mode, state.pressure, state.granularity]);

  const trend = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < series.length; i += 6) {
      const part = series.slice(i, i + 6);
      const avg = part.reduce((sum, value) => sum + value, 0) / Math.max(1, part.length);
      chunks.push(normalize${index}(avg));
    }
    return chunks;
  }, [series]);

  const flags = useMemo(() => derive${index}(series, state.mode), [series, state.mode]);

  useEffect(() => {
    const quality = trend.reduce((sum, value, idx) => sum + value * (idx + 1), 0) / Math.max(1, trend.length * 6);
    dispatch({ type: 'quality', payload: normalize${index}(quality) });
    dispatch({ type: 'marker', payload: normalize${index}(flags.confidence * 0.7 + quality * 0.3) });
  }, [trend, flags.confidence]);

  const mutate = useCallback((type, payload) => {
    if (type === 'tick') {
      dispatch({ type: 'tick' });
      return;
    }
    if (type === 'mode') {
      dispatch({ type: 'mode', payload });
      return;
    }
    if (type === 'granularity') {
      dispatch({ type: 'granularity', payload });
      return;
    }
    if (type === 'pressure') {
      dispatch({ type: 'pressure', payload });
    }
  }, []);

  return {
    seed,
    setSeed,
    state,
    series,
    trend,
    flags,
    mutate,
  };
}
`;
}

function utilContent(index) {
  const shift = 13 + (index % 11);
  const factor = (index % 9) + 3;
  const window = (index % 7) + 4;
  return `function toNumber${index}(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize${index}(value) {
  return Math.round(toNumber${index}(value) * 1000) / 1000;
}

function tokenize${index}(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function classify${index}(score) {
  if (score >= 88) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 48) return 'medium';
  return 'low';
}

function rolling${index}(list, size) {
  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - size); j <= Math.min(list.length - 1, i + size); j += 1) {
      total += toNumber${index}(list[j]);
      count += 1;
    }
    result.push(normalize${index}(total / Math.max(1, count)));
  }
  return result;
}

export function transformDataset${index}(input, query = '', mode = 'balanced', bias = 0) {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize${index}(query);
  const rows = source.map((value, idx) => {
    const speed = normalize${index}(Math.abs(value) + (idx % ${shift}) * 1.8 + ${factor});
    const focus = normalize${index}(Math.abs(Math.sin((idx + ${index}) / ${factor})) * 100);
    const visibility = normalize${index}(100 - Math.abs(Math.cos((idx + ${index}) / ${window})) * 72);
    const anomaly = normalize${index}(Math.abs(Math.sin((idx + ${index}) / ${shift})) * 100);
    const raw = speed * 0.27 + focus * 0.23 + (100 - visibility) * 0.24 + anomaly * 0.26;
    const modeShift = mode === 'safe' ? -7 : mode === 'aggressive' ? 9 : 0;
    const score = normalize${index}(raw + modeShift + (idx % 6) * 0.61 + bias * 0.4);
    const marker = normalize${index}(score * 0.64 + visibility * 0.2 + focus * 0.16);
    return {
      id: idx + 1,
      lane: 'L' + ((idx % 16) + 1),
      speed,
      focus,
      visibility,
      anomaly,
      score,
      marker,
      status: classify${index}(score),
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.lane + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smoothed = rolling${index}(filtered.map((row) => row.score), 2).map((value, idx) => ({
    ...filtered[idx],
    smooth: value,
    blend: normalize${index}(value * 0.73 + filtered[idx].marker * 0.27),
  }));

  return smoothed;
}

export function buildTableState${index}(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 12) {
  const list = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    const av = toNumber${index}(a[sortBy]);
    const bv = toNumber${index}(b[sortBy]);
    if (av === bv) {
      return String(a.lane).localeCompare(String(b.lane)) * direction;
    }
    return (av - bv) * direction;
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const normalizedPage = Math.max(1, Math.min(totalPages, page));
  const start = (normalizedPage - 1) * pageSize;
  const pageRows = list.slice(start, start + pageSize);

  return {
    rows: list,
    total,
    totalPages,
    page: normalizedPage,
    pageRows,
  };
}

export function buildNestedTree${index}(rows, depthLimit = 3) {
  const source = Array.isArray(rows) ? rows : [];
  const root = [];
  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const node = {
      id: row.id,
      label: row.lane,
      score: row.score,
      depth: 0,
      children: [],
    };
    const count = (i % 3) + 1;
    for (let j = 0; j < count; j += 1) {
      const childScore = normalize${index}(row.score * (0.82 + j * 0.07));
      const child = {
        id: row.id * 100 + j,
        label: row.lane + '-' + (j + 1),
        score: childScore,
        depth: 1,
        children: [],
      };
      if (depthLimit > 2) {
        const leafCount = (j % 2) + 1;
        for (let k = 0; k < leafCount; k += 1) {
          child.children.push({
            id: row.id * 1000 + j * 10 + k,
            label: row.lane + '-' + (j + 1) + '-' + (k + 1),
            score: normalize${index}(childScore * (0.88 + k * 0.05)),
            depth: 2,
            children: [],
          });
        }
      }
      node.children.push(child);
    }
    root.push(node);
  }
  return root;
}

export function heavyCompute${index}(size = 18, seed = 3) {
  const matrix = [];
  for (let r = 0; r < size; r += 1) {
    const row = [];
    for (let c = 0; c < size; c += 1) {
      const wave = Math.sin((r + seed) / ${factor}) * 8;
      const drift = Math.cos((c + seed) / ${window}) * 6;
      const edge = ((r * c + ${index}) % ${shift}) - ${factor};
      row.push(normalize${index}(42 + wave + drift + edge));
    }
    matrix.push(row);
  }

  const rowTotals = matrix.map((row) => normalize${index}(row.reduce((sum, value) => sum + value, 0)));
  const colTotals = [];
  for (let c = 0; c < size; c += 1) {
    let total = 0;
    for (let r = 0; r < size; r += 1) {
      total += matrix[r][c];
    }
    colTotals.push(normalize${index}(total));
  }

  const diagonal = normalize${index}(matrix.reduce((sum, row, idx) => sum + (row[idx] || 0), 0));
  const antiDiagonal = normalize${index}(matrix.reduce((sum, row, idx) => sum + (row[size - idx - 1] || 0), 0));
  const density = normalize${index}((diagonal + antiDiagonal) / Math.max(1, size * 2));

  return {
    matrix,
    rowTotals,
    colTotals,
    diagonal,
    antiDiagonal,
    density,
  };
}

export function buildForecast${index}(rows, horizon = 18) {
  const source = Array.isArray(rows) ? rows : [];
  const base = source.slice(-24).map((row) => toNumber${index}(row.score || row.smooth || 0));
  const seed = base.length ? base.reduce((sum, value) => sum + value, 0) / base.length : 50;
  const output = [];
  for (let i = 0; i < horizon; i += 1) {
    const wave = Math.sin((i + ${index}) / ${factor}) * 6;
    const drift = Math.cos((i + ${index}) / ${window}) * 4;
    const momentum = base.length ? base[(i + base.length - 1) % base.length] * 0.08 : 0;
    const value = normalize${index}(seed + wave + drift + momentum + (i % 5) * 0.7);
    output.push({
      step: i + 1,
      value,
      guard: normalize${index}(100 - Math.abs(value - 50) * 1.1),
      load: normalize${index}(value * 0.61 + (i + 1) * 0.33),
    });
  }
  return output;
}

export function detectAnomalies${index}(rows, threshold = 72) {
  const source = Array.isArray(rows) ? rows : [];
  const anomalies = [];
  for (let i = 1; i < source.length; i += 1) {
    const prev = toNumber${index}(source[i - 1].score || source[i - 1].smooth || 0);
    const curr = toNumber${index}(source[i].score || source[i].smooth || 0);
    const delta = normalize${index}(curr - prev);
    const severity = normalize${index}(Math.abs(delta) + Math.max(0, curr - threshold) * 0.8);
    if (Math.abs(delta) > 9 || curr > threshold) {
      anomalies.push({
        id: i + 1,
        lane: source[i].lane || 'N/A',
        score: curr,
        delta,
        severity,
        level: severity > 20 ? 'critical' : severity > 11 ? 'high' : 'medium',
      });
    }
  }
  return anomalies;
}

export function segmentDistribution${index}(rows) {
  const source = Array.isArray(rows) ? rows : [];
  const map = { low: 0, medium: 0, high: 0, critical: 0 };
  for (let i = 0; i < source.length; i += 1) {
    const status = source[i].status || classify${index}(source[i].score || 0);
    if (status in map) {
      map[status] += 1;
    }
  }
  const total = source.length || 1;
  return Object.keys(map).map((key) => ({
    key,
    count: map[key],
    ratio: normalize${index}((map[key] / total) * 100),
    weight: normalize${index}(map[key] * 1.7 + (key === 'critical' ? 8 : key === 'high' ? 4 : 1)),
  }));
}
`;
}

function pipelineContent(index) {
  const stride = (index % 8) + 3;
  const phase = (index % 11) + 4;
  const gain = (index % 9) + 2;
  return `function toNumberP${index}(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeP${index}(value) {
  return Math.round(toNumberP${index}(value) * 1000) / 1000;
}

export function synthesizeFlow${index}(rows, cycle = 0) {
  const source = Array.isArray(rows) ? rows : [];
  const output = [];
  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const score = toNumberP${index}(row.score || 0);
    const smooth = toNumberP${index}(row.smooth || score);
    const wave = Math.sin((i + cycle + ${index}) / ${stride}) * 6;
    const drift = Math.cos((i + cycle + ${index}) / ${phase}) * 4;
    const route = normalizeP${index}(score * 0.58 + smooth * 0.24 + wave + drift + (i % ${gain}) * 0.7);
    const buffer = normalizeP${index}(route * 0.66 + (score - smooth) * 0.34);
    const demand = normalizeP${index}(Math.abs(route - buffer) * 3.2 + (row.visibility || 0) * 0.18);
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

export function rankBuckets${index}(flow, bucketSize = 10) {
  const source = Array.isArray(flow) ? flow : [];
  const buckets = [];
  for (let i = 0; i < source.length; i += bucketSize) {
    const part = source.slice(i, i + bucketSize);
    const avgRoute = normalizeP${index}(part.reduce((sum, row) => sum + toNumberP${index}(row.route), 0) / Math.max(1, part.length));
    const avgDemand = normalizeP${index}(part.reduce((sum, row) => sum + toNumberP${index}(row.demand), 0) / Math.max(1, part.length));
    const pressure = normalizeP${index}(avgRoute * 0.41 + avgDemand * 0.59 + (i / Math.max(1, bucketSize)) * 0.8);
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

export function buildActivityMap${index}(flow, width = 8, height = 8) {
  const source = Array.isArray(flow) ? flow : [];
  const matrix = [];
  for (let r = 0; r < height; r += 1) {
    const row = [];
    for (let c = 0; c < width; c += 1) {
      const ref = source[(r * width + c) % Math.max(1, source.length)] || { route: 0, demand: 0 };
      const value = normalizeP${index}(toNumberP${index}(ref.route) * 0.64 + toNumberP${index}(ref.demand) * 0.36 + r * 0.9 + c * 0.6);
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

export function summarizePipeline${index}(flow, buckets) {
  const list = Array.isArray(flow) ? flow : [];
  const bucketList = Array.isArray(buckets) ? buckets : [];
  const totalDemand = normalizeP${index}(list.reduce((sum, row) => sum + toNumberP${index}(row.demand), 0));
  const avgDemand = normalizeP${index}(totalDemand / Math.max(1, list.length));
  const maxPressure = normalizeP${index}(bucketList.reduce((max, row) => Math.max(max, toNumberP${index}(row.pressure)), 0));
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
      ratio: normalizeP${index}((levelCounts[key] / total) * 100),
    })),
  };
}
`;
}

function componentStyle(index) {
  const hue = (index * 19) % 360;
  return `.component-${index} {
  border: 1px solid hsla(${hue}, 70%, 64%, 0.35);
  background: linear-gradient(140deg, hsla(${hue}, 45%, 16%, 0.38), hsla(${(hue + 35) % 360}, 55%, 12%, 0.23));
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.component-${index} .header-${index} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.component-${index} .controls-${index} {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.component-${index} .grid-${index} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.component-${index} .panel-${index} {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  gap: 8px;
}

.component-${index} table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.component-${index} th,
.component-${index} td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 6px;
  text-align: left;
}

.component-${index} input,
.component-${index} select,
.component-${index} button {
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 7px 9px;
}

.component-${index} .tree-${index} {
  display: grid;
  gap: 4px;
  max-height: 220px;
  overflow-y: auto;
}

.component-${index} .node-${index} {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 5px 7px;
}
`;
}

function componentContent(index) {
  const hookId = ((index - 1) % COUNTS.hooks) + 1;
  const utilId = ((index - 1) % COUNTS.utils) + 1;
  const pageSize = 9 + (index % 4);
  return `import { useEffect, useMemo, useReducer, useState } from 'react';
import { useLogic${hookId} } from '../hooks/useLogic${hookId}.js';
import { buildNestedTree${utilId}, buildTableState${utilId}, heavyCompute${utilId}, transformDataset${utilId} } from '../utils/compute${utilId}.js';
import { buildForecast${utilId}, detectAnomalies${utilId}, segmentDistribution${utilId} } from '../utils/compute${utilId}.js';
import { buildActivityMap${utilId}, rankBuckets${utilId}, summarizePipeline${utilId}, synthesizeFlow${utilId} } from '../pipelines/pipeline${utilId}.js';
import '../styles/component${index}.css';

function MetricCard${index}({ label, value, max }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const ratio = Math.max(0, Math.min(100, (Number(value) / safeMax) * 100));
  const color = ratio > 75 ? '#ff6b6b' : ratio > 45 ? '#ffd166' : '#06d6a0';
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span>{label}</span>
        <span>{Number(value).toFixed(2)}</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.12)', borderRadius: 12 }}>
        <div style={{ height: 7, width: ratio + '%', background: color, borderRadius: 12 }} />
      </div>
    </div>
  );
}

function Badge${index}({ status }) {
  const color = status === 'critical' ? '#ff6b6b' : status === 'high' ? '#ffb703' : status === 'medium' ? '#4cc9f0' : '#80ed99';
  return (
    <span style={{ padding: '2px 7px', borderRadius: 10, border: '1px solid ' + color, color }}>
      {status}
    </span>
  );
}

function TreeNode${index}({ node, depth, activeId, onPick }) {
  const active = node.id === activeId;
  return (
    <div style={{ marginLeft: depth * 10 }}>
      <button
        type="button"
        onClick={() => onPick(node.id)}
        className="node-${index}"
        style={{ width: '100%', color: 'white', background: active ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.02)' }}
      >
        <span>{node.label}</span>
        <span>{Number(node.score).toFixed(2)}</span>
      </button>
      {depth < 4 && Array.isArray(node.children) && node.children.map((child) => (
        <TreeNode${index} key={child.id} node={child} depth={depth + 1} activeId={activeId} onPick={onPick} />
      ))}
    </div>
  );
}

const initialState${index} = {
  mode: 'balanced',
  tab: 'dashboard',
  activeId: 0,
  submissions: 0,
  status: 'idle',
  bias: ${index % 7},
};

function reducer${index}(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'activeId') return { ...state, activeId: action.payload };
  if (action.type === 'submissions') return { ...state, submissions: state.submissions + 1 };
  if (action.type === 'status') return { ...state, status: action.payload };
  if (action.type === 'bias') return { ...state, bias: state.bias + action.payload };
  return state;
}

function createForm${index}(seed) {
  return {
    operator: 'Operator-' + (seed % 9),
    vehicle: 'VH-' + (seed % 17),
    route: 'R-' + ((seed % 5) + 1),
    speedCap: 70 + (seed % 30),
    focusCap: 35 + (seed % 40),
    profile: 'balanced',
  };
}

function validateForm${index}(form) {
  const errors = {};
  if (!String(form.operator || '').trim() || String(form.operator || '').trim().length < 3) errors.operator = 'invalid';
  if (!String(form.vehicle || '').trim() || String(form.vehicle || '').trim().length < 3) errors.vehicle = 'invalid';
  if (!String(form.route || '').trim() || String(form.route || '').trim().length < 2) errors.route = 'invalid';
  const speed = Number(form.speedCap);
  const focus = Number(form.focusCap);
  if (!Number.isFinite(speed) || speed < 30 || speed > 180) errors.speedCap = 'invalid';
  if (!Number.isFinite(focus) || focus < 0 || focus > 100) errors.focusCap = 'invalid';
  return errors;
}

export default function Component${index}({ seed = ${index}, title = 'Component${index}' }) {
  const hook = useLogic${hookId}(seed + ${index});
  const [state, dispatch] = useReducer(reducer${index}, initialState${index});
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(createForm${index}(seed));
  const [errors, setErrors] = useState({});

  const rows = useMemo(() => transformDataset${utilId}(hook.series, query, state.mode, state.bias), [hook.series, query, state.mode, state.bias]);
  const table = useMemo(() => buildTableState${utilId}(rows, sortBy, sortDir, page, ${pageSize}), [rows, sortBy, sortDir, page]);
  const tree = useMemo(() => buildNestedTree${utilId}(rows.slice(0, 28), 4), [rows]);
  const compute = useMemo(() => heavyCompute${utilId}(14 + (seed % 5), 2 + (state.bias % 5)), [seed, state.bias]);
  const forecast = useMemo(() => buildForecast${utilId}(rows, 24 + (state.bias % 6)), [rows, state.bias]);
  const anomalies = useMemo(() => detectAnomalies${utilId}(rows, 68 + (state.bias % 9)), [rows, state.bias]);
  const distribution = useMemo(() => segmentDistribution${utilId}(rows), [rows]);
  const flow = useMemo(() => synthesizeFlow${utilId}(rows, state.bias), [rows, state.bias]);
  const buckets = useMemo(() => rankBuckets${utilId}(flow, 9 + (state.bias % 4)), [flow, state.bias]);
  const activity = useMemo(() => buildActivityMap${utilId}(flow, 8, 8), [flow]);
  const pipelineSummary = useMemo(() => summarizePipeline${utilId}(flow, buckets), [flow, buckets]);

  useEffect(() => {
    if (page > table.totalPages) {
      setPage(table.totalPages || 1);
    }
  }, [page, table.totalPages]);

  useEffect(() => {
    if (hook.flags.risk > 80) {
      dispatch({ type: 'status', payload: 'warning' });
    } else if (hook.flags.risk > 55) {
      dispatch({ type: 'status', payload: 'watch' });
    } else {
      dispatch({ type: 'status', payload: 'stable' });
    }
  }, [hook.flags.risk]);

  function handleField(event) {
    const name = event.target.name;
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateForm${index}(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      dispatch({ type: 'submissions' });
      dispatch({ type: 'bias', payload: 1 });
      hook.mutate('tick');
      hook.setSeed((prev) => prev + Number(form.speedCap) + Number(form.focusCap));
    }
  }

  const cards = useMemo(() => {
    return [
      { label: 'Risk', value: hook.flags.risk, max: 120 },
      { label: 'Confidence', value: hook.flags.confidence, max: 120 },
      { label: 'Quality', value: hook.state.quality, max: 120 },
      { label: 'Density', value: compute.density, max: 120 },
      { label: 'Rows', value: rows.length, max: 140 },
      { label: 'Page Rows', value: table.pageRows.length, max: 50 },
      { label: 'Anomalies', value: anomalies.length, max: 120 },
      { label: 'Forecast Avg', value: forecast.reduce((sum, item) => sum + item.value, 0) / Math.max(1, forecast.length), max: 140 },
      { label: 'Pipe Pressure', value: pipelineSummary.maxPressure, max: 120 },
    ];
  }, [hook.flags.risk, hook.flags.confidence, hook.state.quality, compute.density, rows.length, table.pageRows.length, anomalies.length, forecast, pipelineSummary.maxPressure]);

  return (
    <section className="component-${index}">
      <div className="header-${index}">
        <div>
          <h3>{title}</h3>
          <div style={{ fontSize: 12 }}>status {state.status} submissions {state.submissions}</div>
        </div>
        <div className="controls-${index}">
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'safe' }); hook.mutate('mode', 'safe'); }}>Safe</button>
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'balanced' }); hook.mutate('mode', 'balanced'); }}>Balanced</button>
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'aggressive' }); hook.mutate('mode', 'aggressive'); }}>Aggressive</button>
          <button type="button" onClick={() => hook.mutate('granularity', Math.max(2, hook.state.granularity - 1))}>Gran-</button>
          <button type="button" onClick={() => hook.mutate('granularity', hook.state.granularity + 1)}>Gran+</button>
        </div>
      </div>

      <div className="grid-${index}">
        <div className="panel-${index}">
          {cards.map((item, idx) => (
            <MetricCard${index} key={item.label + '-' + idx} label={item.label} value={item.value} max={item.max} />
          ))}
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="filter lane or status" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 6 }}>
            {table.pageRows.slice(0, 6).map((row) => (
              <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 6px' }}>
                <span>{row.lane}</span>
                <Badge${index} status={row.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel-${index}">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 7 }}>
            <input name="operator" value={form.operator} onChange={handleField} />
            <input name="vehicle" value={form.vehicle} onChange={handleField} />
            <input name="route" value={form.route} onChange={handleField} />
            <input name="speedCap" type="number" min="30" max="180" value={form.speedCap} onChange={handleField} />
            <input name="focusCap" type="number" min="0" max="100" value={form.focusCap} onChange={handleField} />
            <select name="profile" value={form.profile} onChange={handleField}>
              <option value="safe">safe</option>
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
            <button type="submit">Apply</button>
          </form>
          <div style={{ fontSize: 12, color: '#ffd6d6' }}>{Object.keys(errors).join(' | ')}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setSortBy('score')}>Sort score</button>
            <button type="button" onClick={() => setSortBy('visibility')}>Sort visibility</button>
            <button type="button" onClick={() => setSortDir((prev) => prev === 'asc' ? 'desc' : 'asc')}>Toggle dir</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Prev</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(table.totalPages, prev + 1))}>Next</button>
          </div>
          <div style={{ fontSize: 12 }}>page {table.page} / {table.totalPages} total {table.total}</div>
        </div>

        <div className="panel-${index}">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Lane</th>
                <th>Status</th>
                <th>Score</th>
                <th>Vis</th>
                <th>Anom</th>
              </tr>
            </thead>
            <tbody>
              {table.pageRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.lane}</td>
                  <td>{row.status}</td>
                  <td>{row.score.toFixed(2)}</td>
                  <td>{row.visibility.toFixed(2)}</td>
                  <td>{row.anomaly.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
            {compute.rowTotals.slice(0, 9).map((value, idx) => (
              <div key={'row-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 5, fontSize: 11 }}>
                <div>R{idx + 1}</div>
                <div>{value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-${index}">
          <div className="tree-${index}">
            {tree.slice(0, 8).map((node) => (
              <TreeNode${index}
                key={node.id}
                node={node}
                depth={0}
                activeId={state.activeId}
                onPick={(id) => dispatch({ type: 'activeId', payload: id })}
              />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
            {hook.trend.slice(0, 8).map((value, idx) => (
              <div key={'trend-' + idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 6 }}>
                <div style={{ fontSize: 10 }}>T{idx + 1}</div>
                <div>{value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-${index}">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
            {forecast.slice(0, 12).map((item) => (
              <div key={'fc-' + item.step} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>F{item.step}</div>
                <div>{item.value.toFixed(2)}</div>
                <div>{item.guard.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Lane</th>
                <th>Score</th>
                <th>Delta</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.slice(0, 10).map((item) => (
                <tr key={'an-' + item.id}>
                  <td>{item.id}</td>
                  <td>{item.lane}</td>
                  <td>{item.score.toFixed(2)}</td>
                  <td>{item.delta.toFixed(2)}</td>
                  <td>{item.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gap: 6 }}>
            {distribution.map((item) => (
              <div key={'dist-' + item.key} style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 8, alignItems: 'center' }}>
                <span>{item.key}</span>
                <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.12)' }}>
                  <div style={{ width: item.ratio + '%', height: 8, borderRadius: 8, background: item.key === 'critical' ? '#ff6b6b' : item.key === 'high' ? '#ffb703' : item.key === 'medium' ? '#4cc9f0' : '#80ed99' }} />
                </div>
                <span>{item.ratio.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>B</th>
                <th>Route</th>
                <th>Demand</th>
                <th>Pressure</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {buckets.slice(0, 8).map((item) => (
                <tr key={'bk-' + item.bucket}>
                  <td>{item.bucket}</td>
                  <td>{item.avgRoute.toFixed(2)}</td>
                  <td>{item.avgDemand.toFixed(2)}</td>
                  <td>{item.pressure.toFixed(2)}</td>
                  <td>{item.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0,1fr))', gap: 4 }}>
            {activity.slice(0, 8).flatMap((row, rIdx) => row.slice(0, 8).map((cell, cIdx) => (
              <div
                key={'act-' + rIdx + '-' + cIdx}
                style={{
                  height: 16,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,229,255,' + Math.max(0.1, Math.min(0.9, cell / 100)).toFixed(2) + ')',
                }}
              />
            )))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 12 }}>
            <div>Demand {pipelineSummary.totalDemand.toFixed(2)}</div>
            <div>Avg {pipelineSummary.avgDemand.toFixed(2)}</div>
            <div>MaxP {pipelineSummary.maxPressure.toFixed(2)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
            {pipelineSummary.levels.map((item) => (
              <div key={'lvl-' + item.key} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>{item.key}</div>
                <div>{item.count}</div>
                <div>{item.ratio.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function pageStyle(index) {
  const hue = (index * 27) % 360;
  return `.page-${index} {
  padding: 16px;
  display: grid;
  gap: 14px;
}

.page-${index} .header-${index} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 1px solid hsla(${hue}, 70%, 66%, 0.4);
  border-radius: 14px;
  padding: 12px;
  background: linear-gradient(120deg, hsla(${hue}, 50%, 18%, 0.4), hsla(${(hue + 30) % 360}, 45%, 12%, 0.24));
}

.page-${index} .controls-${index} {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-${index} .layout-${index} {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 12px;
}

.page-${index} .sidebar-${index},
.page-${index} .content-${index} {
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255,255,255,0.03);
  display: grid;
  gap: 9px;
}

.page-${index} input,
.page-${index} select,
.page-${index} textarea,
.page-${index} button {
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.18);
  color: white;
  padding: 7px 9px;
}

.page-${index} table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.page-${index} th,
.page-${index} td {
  border-bottom: 1px solid rgba(255,255,255,0.12);
  padding: 6px;
  text-align: left;
}

.page-${index} .component-grid-${index} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 10px;
}

@media (max-width: 1100px) {
  .page-${index} .layout-${index} {
    grid-template-columns: 1fr;
  }
}
`;
}

function pageContent(index) {
  const utilId = ((index - 1) % COUNTS.utils) + 1;
  const start = (index - 1) * COUNTS.componentsPerPage + 1;
  const ids = [];
  for (let i = 0; i < COUNTS.componentsPerPage; i += 1) {
    const componentId = ((start + i - 1) % COUNTS.components) + 1;
    ids.push(componentId);
  }

  const importLines = ids.map((id) => `import Component${id} from '../components/Component${id}.jsx';`).join('\n');
  const componentNodes = ids.slice(0, 4).map((id, idx) => `          <Component${id} seed={seed + ${idx + 1}} title={'Page${index}-Component${id}'} />`).join('\n');
  const secondaryNodes = ids.slice(4).map((id, idx) => `          <Component${id} seed={seed + ${idx + 7}} title={'Page${index}-Widget${id}'} />`).join('\n');

  return `import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState${utilId}, heavyCompute${utilId}, transformDataset${utilId} } from '../utils/compute${utilId}.js';
${importLines}
import '../styles/page${index}.css';

const initialState${index} = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer${index}(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource${index}(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / ${(index % 8) + 3}) * 16;
    const drift = Math.cos((idx + seed) / ${(index % 10) + 4}) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page${index}() {
  const [seed, setSeed] = useState(${index * 9});
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer${index}, initialState${index});
  const [form, setForm] = useState({
    fleet: 'Fleet-' + ${index},
    segment: 'S' + ((${index} % 5) + 1),
    window: ${(index % 6) + 4},
    offset: ${(index % 7) + 2},
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource${index}(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset${utilId}(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState${utilId}(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute${utilId}(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

  useEffect(() => {
    if (state.page > table.totalPages) {
      dispatch({ type: 'page', payload: table.totalPages || 1 });
    }
  }, [state.page, table.totalPages]);

  function handleField(event) {
    const name = event.target.name;
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function refresh() {
    const gain = Number(form.window) * 3 + Number(form.offset) * 2;
    setSeed((prev) => prev + gain + ${index});
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-${index}">
      <div className="header-${index}">
        <div>
          <h2>Page${index}</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-${index}">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-${index}">
        <div className="sidebar-${index}">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="filter" />
          <input name="fleet" value={form.fleet} onChange={handleField} />
          <input name="segment" value={form.segment} onChange={handleField} />
          <input name="window" type="number" value={form.window} onChange={handleField} />
          <input name="offset" type="number" value={form.offset} onChange={handleField} />
          <textarea name="note" rows="4" value={form.note} onChange={handleField} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'score' })}>Sort score</button>
            <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'visibility' })}>Sort vis</button>
            <button type="button" onClick={() => dispatch({ type: 'sortDir', payload: state.sortDir === 'asc' ? 'desc' : 'asc' })}>Toggle dir</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.max(1, state.page - 1) })}>Prev</button>
            <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.min(table.totalPages, state.page + 1) })}>Next</button>
          </div>
          <div style={{ fontSize: 12 }}>page {table.page} / {table.totalPages}</div>
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {table.pageRows.slice(0, 10).map((row) => (
                <tr key={row.id}>
                  <td>{row.lane}</td>
                  <td>{row.status}</td>
                  <td>{row.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-${index}">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-${index}">
${componentNodes}
          </div>
          <div className="component-grid-${index}">
${secondaryNodes}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

function routesContent() {
  const imports = [];
  const links = [];
  const routes = [];
  for (let i = 1; i <= COUNTS.pages; i += 1) {
    imports.push(`import Page${i} from '../pages/Page${i}.jsx';`);
    links.push(`        <NavLink key="p${i}" to="/ui_massive/p${i}" style={({ isActive }) => ({ padding: '6px 10px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.22)' : 'rgba(255,255,255,0.07)' })}>P${i}</NavLink>`);
    routes.push(`        <Route path="p${i}" element={<Page${i} />} />`);
  }

  return `import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
${imports.join('\n')}
import '../styles/base.css';

export default function MassiveRoutes() {
  return (
    <div className="ui-massive-shell">
      <div className="ui-massive-nav">
${links.join('\n')}
      </div>
      <div className="ui-massive-content">
        <Routes>
${routes.join('\n')}
          <Route path="*" element={<Navigate to="/ui_massive/p1" replace />} />
        </Routes>
      </div>
    </div>
  );
}
`;
}

function appContent() {
  return `import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MassiveRoutes from './routes/MassiveRoutes';
import './styles/base.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ui_massive/*" element={<MassiveRoutes />} />
        <Route path="*" element={<Navigate to="/ui_massive/p1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
`;
}

function mainContent() {
  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
}

function baseStyleContent() {
  const lines = [];
  lines.push('html, body, #root { margin: 0; width: 100%; height: 100%; }');
  lines.push('body { font-family: "Segoe UI", sans-serif; background: #0f1220; color: white; }');
  lines.push('.ui-massive-shell { min-height: 100vh; display: grid; gap: 10px; padding: 12px; }');
  lines.push('.ui-massive-nav { display: flex; flex-wrap: wrap; gap: 6px; }');
  lines.push('.ui-massive-nav a { color: white; text-decoration: none; font-size: 12px; }');
  lines.push('.ui-massive-content { display: grid; gap: 10px; }');
  for (let i = 0; i < 3000; i += 1) {
    const hue = (i * 21) % 360;
    lines.push(`.token-${i} { border: 1px solid hsla(${hue},70%,64%,0.25); background: hsla(${hue},55%,20%,0.12); border-radius: ${(i % 9) + 3}px; padding: ${(i % 5) + 2}px; }`);
  }
  return lines.join('\n') + '\n';
}

function generate() {
  ensureDir(outputRoot);
  ensureDir(path.join(outputRoot, 'components'));
  ensureDir(path.join(outputRoot, 'hooks'));
  ensureDir(path.join(outputRoot, 'utils'));
  ensureDir(path.join(outputRoot, 'pipelines'));
  ensureDir(path.join(outputRoot, 'pages'));
  ensureDir(path.join(outputRoot, 'routes'));
  ensureDir(path.join(outputRoot, 'styles'));

  for (let i = 1; i <= COUNTS.hooks; i += 1) {
    write(path.join(outputRoot, 'hooks', `useLogic${i}.js`), hookContent(i));
  }

  for (let i = 1; i <= COUNTS.utils; i += 1) {
    write(path.join(outputRoot, 'utils', `compute${i}.js`), utilContent(i));
  }

  for (let i = 1; i <= COUNTS.pipelines; i += 1) {
    write(path.join(outputRoot, 'pipelines', `pipeline${i}.js`), pipelineContent(i));
  }

  for (let i = 1; i <= COUNTS.components; i += 1) {
    write(path.join(outputRoot, 'components', `Component${i}.jsx`), componentContent(i));
    write(path.join(outputRoot, 'styles', `component${i}.css`), componentStyle(i));
  }

  for (let i = 1; i <= COUNTS.pages; i += 1) {
    write(path.join(outputRoot, 'pages', `Page${i}.jsx`), pageContent(i));
    write(path.join(outputRoot, 'styles', `page${i}.css`), pageStyle(i));
  }

  write(path.join(outputRoot, 'routes', 'MassiveRoutes.jsx'), routesContent());
  write(path.join(outputRoot, 'App.jsx'), appContent());
  write(path.join(outputRoot, 'main.jsx'), mainContent());
  write(path.join(outputRoot, 'styles', 'base.css'), baseStyleContent());

  const summary = {
    hooks: COUNTS.hooks,
    utils: COUNTS.utils,
    pipelines: COUNTS.pipelines,
    components: COUNTS.components,
    componentStyles: COUNTS.components,
    pages: COUNTS.pages,
    pageStyles: COUNTS.pages,
    routes: 1,
    app: 1,
    main: 1,
    baseStyles: 1,
  };

  const totalFiles = Object.values(summary).reduce((sum, value) => sum + value, 0);
  write(path.join(outputRoot, 'summary.json'), JSON.stringify({ summary, totalFiles }, null, 2));
  return totalFiles;
}

const totalFiles = generate();
console.log('ui_massive_generated_files=' + totalFiles);
