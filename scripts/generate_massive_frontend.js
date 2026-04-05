const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'frontend', 'src');
const massiveRoot = path.join(srcRoot, 'massive');

const COUNTS = {
  hooks: 120,
  utils: 120,
  components: 300,
  pages: 30,
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pad(value, width = 3) {
  return String(value).padStart(width, '0');
}

function write(relPath, content) {
  const filePath = path.join(massiveRoot, relPath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimEnd() + '\n');
}

function hookContent(index) {
  const id = pad(index);
  const alpha = (index % 7) + 3;
  const beta = (index % 11) + 5;
  const gamma = (index % 13) + 7;
  return `import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const baseSeries${id} = Array.from({ length: 64 }, (_, idx) => {
  const wave = Math.sin((idx + ${index}) / ${alpha}) * 12;
  const drift = Math.cos((idx + ${index}) / ${beta}) * 8;
  const offset = ((idx * ${index}) % 17) - 8;
  return Number((45 + wave + drift + offset).toFixed(3));
});

const initialState${id} = {
  mode: 'balanced',
  window: ${alpha},
  tick: 0,
  loading: false,
  history: [],
  quality: 0,
  budget: ${(index % 10) + 4}
};

function reducer${id}(state, action) {
  switch (action.type) {
    case 'mode':
      return { ...state, mode: action.payload };
    case 'window':
      return { ...state, window: Math.max(2, Math.min(18, action.payload)) };
    case 'tick':
      return { ...state, tick: state.tick + 1 };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'history':
      return { ...state, history: action.payload.slice(-36) };
    case 'quality':
      return { ...state, quality: action.payload };
    case 'budget':
      return { ...state, budget: Math.max(1, action.payload) };
    default:
      return state;
  }
}

function normalize${id}(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value * 1000) / 1000;
}

function smooth${id}(values, width) {
  const list = [];
  for (let i = 0; i < values.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - width); j <= Math.min(values.length - 1, i + width); j += 1) {
      total += values[j];
      count += 1;
    }
    list.push(normalize${id}(total / Math.max(1, count)));
  }
  return list;
}

function deriveFlags${id}(values, mode) {
  const avg = values.reduce((sum, n) => sum + n, 0) / Math.max(1, values.length);
  const peak = values.reduce((max, n) => Math.max(max, n), -Infinity);
  const valley = values.reduce((min, n) => Math.min(min, n), Infinity);
  const variance = values.reduce((acc, n) => acc + (n - avg) ** 2, 0) / Math.max(1, values.length);
  const spread = normalize${id}(peak - valley);
  const jitter = normalize${id}(Math.sqrt(variance));
  const risk = normalize${id}(avg * 0.37 + spread * 0.29 + jitter * 0.34 + (${index} % 9));
  return {
    avg: normalize${id}(avg),
    peak: normalize${id}(peak),
    valley: normalize${id}(valley),
    spread,
    jitter,
    risk,
    mode,
    stable: jitter < (mode === 'safe' ? 6 : mode === 'aggressive' ? 11 : 8)
  };
}

function fakeApi${id}(seed, mode, budget) {
  return new Promise((resolve) => {
    const delay = 8 + (seed % 6) * 4 + (budget % 4) * 3;
    setTimeout(() => {
      const shape = Array.from({ length: 16 }, (_, idx) => {
        const base = Math.sin((idx + seed) / ${gamma}) * 9 + Math.cos((idx + seed) / ${alpha}) * 6;
        const adjust = mode === 'safe' ? -5 : mode === 'aggressive' ? 7 : 1;
        return normalize${id}(base + adjust + (budget % 9));
      });
      resolve(shape);
    }, delay);
  });
}

export function useMegaHook${id}(initialSeed = ${index}) {
  const [seed, setSeed] = useState(initialSeed);
  const [state, dispatch] = useReducer(reducer${id}, initialState${id});

  useEffect(() => {
    let active = true;
    dispatch({ type: 'loading', payload: true });
    fakeApi${id}(seed, state.mode, state.budget).then((response) => {
      if (!active) {
        return;
      }
      dispatch({ type: 'history', payload: response });
      dispatch({ type: 'loading', payload: false });
    });
    return () => {
      active = false;
    };
  }, [seed, state.mode, state.tick, state.budget]);

  const series = useMemo(() => {
    const merged = baseSeries${id}.map((n, idx) => {
      const drift = state.history[idx % Math.max(1, state.history.length)] || 0;
      const mod = state.mode === 'safe' ? -6 : state.mode === 'aggressive' ? 10 : 0;
      return normalize${id}(n + drift * 0.45 + mod + (seed % 13) * 0.2 + idx * 0.03);
    });
    return smooth${id}(merged, state.window);
  }, [seed, state.mode, state.window, state.history]);

  const trend = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < series.length; i += 8) {
      const part = series.slice(i, i + 8);
      const avg = part.reduce((sum, n) => sum + n, 0) / Math.max(1, part.length);
      chunks.push(normalize${id}(avg));
    }
    return chunks;
  }, [series]);

  const flags = useMemo(() => deriveFlags${id}(series, state.mode), [series, state.mode]);

  useEffect(() => {
    const quality = trend.reduce((sum, n, idx) => sum + n * (idx + 1), 0) / Math.max(1, trend.length * 6);
    dispatch({ type: 'quality', payload: normalize${id}(quality) });
  }, [trend]);

  const mutate = useCallback((mode, payload = 0) => {
    if (mode === 'tick') {
      dispatch({ type: 'tick' });
      return;
    }
    if (mode === 'window') {
      dispatch({ type: 'window', payload: payload || state.window + 1 });
      return;
    }
    if (mode === 'budget') {
      dispatch({ type: 'budget', payload: payload || state.budget + 1 });
      return;
    }
    dispatch({ type: 'mode', payload: mode });
  }, [state.window, state.budget]);

  return {
    seed,
    setSeed,
    state,
    series,
    trend,
    flags,
    mutate
  };
}
`;
}

function utilContent(index) {
  const id = pad(index);
  const prime = 17 + (index % 11);
  const mul = (index % 9) + 3;
  const offset = (index % 14) + 5;
  return `const SHIFT_${id} = ${prime};
const SCALE_${id} = ${mul};
const OFFSET_${id} = ${offset};

function asNumber${id}(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize${id}(value) {
  return Math.round(asNumber${id}(value) * 1000) / 1000;
}

function tokenize${id}(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function movingAverage${id}(list, span) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - span); j <= Math.min(list.length - 1, i + span); j += 1) {
      total += asNumber${id}(list[j]);
      count += 1;
    }
    out.push(normalize${id}(total / Math.max(1, count)));
  }
  return out;
}

function weightedScore${id}(row, idx) {
  const speed = asNumber${id}(row.speed);
  const fatigue = asNumber${id}(row.fatigue);
  const visibility = asNumber${id}(row.visibility);
  const anomaly = asNumber${id}(row.anomaly);
  const baseline = speed * 0.28 + fatigue * 0.26 + (100 - visibility) * 0.22 + anomaly * 0.24;
  return normalize${id}(baseline + (idx % SHIFT_${id}) * 0.31 + SCALE_${id});
}

function classify${id}(score) {
  if (score >= 86) return 'critical';
  if (score >= 68) return 'high';
  if (score >= 44) return 'medium';
  return 'low';
}

export function pipelineData${id}(input, query = '', mode = 'balanced') {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize${id}(query);
  const rows = source.map((value, idx) => {
    const speed = normalize${id}(Math.abs(value) + (idx % 11) * 1.9 + OFFSET_${id});
    const fatigue = normalize${id}(Math.abs(Math.sin((idx + ${index}) / SCALE_${id})) * 100);
    const visibility = normalize${id}(100 - Math.abs(Math.cos((idx + ${index}) / OFFSET_${id})) * 70);
    const anomaly = normalize${id}(Math.abs(Math.sin((idx + ${index}) / SHIFT_${id})) * 100);
    const score = weightedScore${id}({ speed, fatigue, visibility, anomaly }, idx);
    const modeBias = mode === 'safe' ? -8 : mode === 'aggressive' ? 9 : 0;
    const adjusted = normalize${id}(score + modeBias + (idx % 5) * 0.7);
    return {
      id: idx + 1,
      zone: 'Z-' + ((idx % 24) + 1),
      speed,
      fatigue,
      visibility,
      anomaly,
      score: adjusted,
      status: classify${id}(adjusted),
      marker: normalize${id}(adjusted * 0.42 + visibility * 0.18 + fatigue * 0.15)
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.zone + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smooth = movingAverage${id}(filtered.map((r) => r.score), 2).map((n, idx) => ({
    ...filtered[idx],
    scoreSmooth: n,
    signature: normalize${id}(n * 0.73 + filtered[idx].marker * 0.27)
  }));

  return smooth;
}

export function createBuckets${id}(rows, groupSize = 12) {
  const list = Array.isArray(rows) ? rows : [];
  const buckets = [];
  for (let i = 0; i < list.length; i += groupSize) {
    const chunk = list.slice(i, i + groupSize);
    const avg = chunk.reduce((sum, row) => sum + asNumber${id}(row.score), 0) / Math.max(1, chunk.length);
    const max = chunk.reduce((a, b) => (asNumber${id}(a.score) > asNumber${id}(b.score) ? a : b), chunk[0] || { score: 0 });
    buckets.push({
      key: i / groupSize + 1,
      start: i + 1,
      end: i + chunk.length,
      average: normalize${id}(avg),
      peak: normalize${id}(asNumber${id}(max.score)),
      pressure: classify${id}(avg)
    });
  }
  return buckets;
}

export function buildTableState${id}(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 10) {
  const data = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    const av = asNumber${id}(a[sortBy]);
    const bv = asNumber${id}(b[sortBy]);
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

export function simulateRiskApi${id}(payload) {
  const seed = asNumber${id}(payload.seed || 1);
  const points = asNumber${id}(payload.points || 24);
  const mode = String(payload.mode || 'balanced');
  return new Promise((resolve) => {
    const wait = 20 + (seed % 9) * 6;
    setTimeout(() => {
      const data = Array.from({ length: points }, (_, idx) => {
        const wave = Math.sin((idx + seed) / OFFSET_${id}) * 18;
        const drift = Math.cos((idx + seed) / SCALE_${id}) * 13;
        const modeBias = mode === 'safe' ? -6 : mode === 'aggressive' ? 8 : 1;
        const risk = normalize${id}(52 + wave + drift + modeBias + (idx % 7) * 1.2);
        return {
          step: idx + 1,
          risk,
          load: normalize${id}(risk * 0.64 + idx * 0.33),
          guard: normalize${id}(100 - Math.abs(risk - 50))
        };
      });
      resolve(data);
    }, wait);
  });
}
`;
}

function componentStyle(index) {
  const id = pad(index);
  const hue = (index * 17) % 360;
  return `.mega-card-${id} {
  border: 1px solid hsla(${hue}, 70%, 65%, 0.35);
  background: linear-gradient(145deg, hsla(${hue}, 55%, 16%, 0.38), hsla(${(hue + 30) % 360}, 65%, 12%, 0.22));
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.mega-header-${id} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.mega-grid-${id} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.mega-pane-${id} {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  gap: 8px;
}

.mega-list-${id} {
  display: grid;
  gap: 6px;
  max-height: 210px;
  overflow-y: auto;
}

.mega-item-${id} {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.mega-form-${id} input,
.mega-form-${id} select,
.mega-form-${id} button {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.16);
  color: white;
  padding: 7px 9px;
}
`;
}

function componentContent(index) {
  const id = pad(index);
  const hookId = pad(((index - 1) % COUNTS.hooks) + 1);
  const utilId = hookId;
  const pageSize = 8 + (index % 5);
  return `import { useEffect, useMemo, useReducer, useState } from 'react';
import { useMegaHook${hookId} } from '../hooks/useMegaHook${hookId}.js';
import { buildTableState${utilId}, pipelineData${utilId} } from '../utils/transformSet${utilId}.js';
import '../styles/component${id}.css';

function Meter${id}({ label, value, ceiling }) {
  const safeCeil = Math.max(1, ceiling);
  const ratio = Math.max(0, Math.min(100, (value / safeCeil) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span>{label}</span>
        <span>{Number(value).toFixed(2)}</span>
      </div>
      <div style={{ height: 7, borderRadius: 10, background: 'rgba(255,255,255,0.1)' }}>
        <div
          style={{
            width: ratio + '%',
            height: 7,
            borderRadius: 10,
            background: ratio > 75 ? '#ff6b6b' : ratio > 45 ? '#ffd166' : '#06d6a0'
          }}
        />
      </div>
    </div>
  );
}

function NestedBlock${id}({ rows, onSelect, activeId }) {
  return (
    <div className="mega-list-${id}">
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onSelect(row.id)}
          className="mega-item-${id}"
          style={{
            border: row.id === activeId ? '1px solid rgba(0, 230, 255, 0.9)' : '1px solid transparent',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <span>{row.zone}</span>
          <span>{row.status}</span>
          <span>{row.score.toFixed(2)}</span>
        </button>
      ))}
    </div>
  );
}

const initialState${id} = {
  mode: 'balanced',
  count: ${index % 9},
  active: 1,
  submitted: 0,
  toggle: false
};

function reducer${id}(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'count') return { ...state, count: state.count + action.payload };
  if (action.type === 'active') return { ...state, active: action.payload };
  if (action.type === 'submitted') return { ...state, submitted: state.submitted + 1 };
  if (action.type === 'toggle') return { ...state, toggle: !state.toggle };
  return state;
}

export default function MegaComponent${id}({ seed = ${index}, title = 'Module ${index}' }) {
  const hook = useMegaHook${hookId}(seed + ${index});
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ vehicle: '', operator: '', speedCap: 78 + (${index} % 17), profile: 'standard' });
  const [state, dispatch] = useReducer(reducer${id}, initialState${id});

  const transformed = useMemo(() => pipelineData${utilId}(hook.series, query, state.mode), [hook.series, query, state.mode]);
  const table = useMemo(() => buildTableState${utilId}(transformed, sortBy, sortDir, page, ${pageSize}), [transformed, sortBy, sortDir, page]);

  useEffect(() => {
    if (page > table.totalPages) {
      setPage(table.totalPages || 1);
    }
  }, [page, table.totalPages]);

  const summary = useMemo(() => {
    const total = table.pageRows.reduce((sum, row) => sum + row.score, 0);
    const avg = total / Math.max(1, table.pageRows.length);
    const max = table.pageRows.reduce((m, row) => Math.max(m, row.score), 0);
    const min = table.pageRows.reduce((m, row) => Math.min(m, row.score), Infinity);
    const bias = form.profile === 'aggressive' ? 8 : form.profile === 'safe' ? -6 : 0;
    return {
      total,
      avg,
      max,
      min: Number.isFinite(min) ? min : 0,
      normalized: avg + state.count + bias + (state.toggle ? 2 : 0)
    };
  }, [table.pageRows, state.count, state.toggle, form.profile]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitLocal(event) {
    event.preventDefault();
    const checks = [];
    checks.push(form.vehicle.trim().length >= 3);
    checks.push(form.operator.trim().length >= 3);
    checks.push(Number(form.speedCap) >= 30 && Number(form.speedCap) <= 180);
    if (checks.every(Boolean)) {
      dispatch({ type: 'submitted' });
      dispatch({ type: 'toggle' });
      hook.mutate('tick');
    }
  }

  return (
    <section className="mega-card-${id}">
      <header className="mega-header-${id}">
        <strong>{title}</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => hook.mutate('safe')}>Safe</button>
          <button type="button" onClick={() => hook.mutate('balanced')}>Balanced</button>
          <button type="button" onClick={() => hook.mutate('aggressive')}>Aggressive</button>
        </div>
      </header>

      <div className="mega-grid-${id}">
        <div className="mega-pane-${id}">
          <Meter${id} label="Average" value={summary.avg} ceiling={100} />
          <Meter${id} label="Peak" value={summary.max} ceiling={130} />
          <Meter${id} label="Spread" value={summary.max - summary.min} ceiling={130} />
          <Meter${id} label="Quality" value={hook.state.quality} ceiling={130} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by zone or status" />
          <NestedBlock${id} rows={table.pageRows} onSelect={(value) => dispatch({ type: 'active', payload: value })} activeId={state.active} />
        </div>

        <div className="mega-pane-${id}">
          <form className="mega-form-${id}" onSubmit={submitLocal}>
            <input name="vehicle" value={form.vehicle} onChange={updateField} placeholder="Vehicle" />
            <input name="operator" value={form.operator} onChange={updateField} placeholder="Operator" />
            <input name="speedCap" type="number" value={form.speedCap} onChange={updateField} min="30" max="180" />
            <select name="profile" value={form.profile} onChange={updateField}>
              <option value="safe">Safe</option>
              <option value="standard">Standard</option>
              <option value="aggressive">Aggressive</option>
            </select>
            <button type="submit">Apply</button>
          </form>

          <div style={{ display: 'grid', gap: 8 }}>
            <div>Rows: {table.total}</div>
            <div>Page: {table.page} / {table.totalPages}</div>
            <div>Submitted: {state.submitted}</div>
            <div>Normalized: {summary.normalized.toFixed(2)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setSortBy('score')}>Sort Score</button>
              <button type="button" onClick={() => setSortBy('visibility')}>Sort Visibility</button>
              <button type="button" onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}>Toggle Dir</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <button type="button" onClick={() => setPage((p) => Math.min(table.totalPages, p + 1))}>Next</button>
              <button type="button" onClick={() => dispatch({ type: 'count', payload: 1 })}>Increment</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function pageStyle(index) {
  const id = pad(index, 2);
  const hue = (index * 23) % 360;
  return `.scale-page-${id} {
  padding: 18px;
  display: grid;
  gap: 14px;
}

.scale-header-${id} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid hsla(${hue}, 75%, 70%, 0.35);
  background: linear-gradient(120deg, hsla(${hue}, 40%, 22%, 0.42), hsla(${(hue + 35) % 360}, 65%, 14%, 0.25));
}

.scale-grid-${id} {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 12px;
}

.scale-panel-${id} {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 11px;
  display: grid;
  gap: 9px;
  background: rgba(255, 255, 255, 0.03);
}

.scale-table-${id} {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.scale-table-${id} th,
.scale-table-${id} td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 7px;
  text-align: left;
}

.scale-form-${id} {
  display: grid;
  gap: 8px;
}

.scale-form-${id} input,
.scale-form-${id} select,
.scale-form-${id} button,
.scale-form-${id} textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 8px 10px;
}

.scale-modal-${id} {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 40;
}

.scale-modal-body-${id} {
  width: min(760px, 92vw);
  max-height: 82vh;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(15, 17, 25, 0.95);
  padding: 14px;
  display: grid;
  gap: 10px;
}
`;
}

function pageContent(index) {
  const id = pad(index, 2);
  const utilId = pad(((index - 1) % COUNTS.utils) + 1);
  const componentStart = (index - 1) * 8 + 1;
  const componentIds = Array.from({ length: 8 }, (_, idx) => pad(componentStart + idx));

  const imports = componentIds
    .map((componentId) => `import MegaComponent${componentId} from '../components/MegaComponent${componentId}.jsx';`)
    .join('\n');

  const usageGrid = componentIds
    .slice(0, 4)
    .map((componentId, idx) => `        <MegaComponent${componentId} seed={seed + ${idx + 1}} title="Page ${index} Cluster ${idx + 1}" />`)
    .join('\n');

  const usageModal = componentIds
    .slice(4)
    .map((componentId, idx) => `              <MegaComponent${componentId} seed={seed + ${idx + 9}} title="Overlay ${idx + 1}" />`)
    .join('\n');

  return `import { useEffect, useMemo, useReducer, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buildTableState${utilId}, pipelineData${utilId}, simulateRiskApi${utilId} } from '../utils/transformSet${utilId}.js';
${imports}
import '../styles/page${id}.css';

const initialState${id} = {
  tab: 'overview',
  modalOpen: false,
  loading: false,
  records: [],
  message: '',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1
};

function reducer${id}(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'modal') return { ...state, modalOpen: action.payload };
  if (action.type === 'loading') return { ...state, loading: action.payload };
  if (action.type === 'records') return { ...state, records: action.payload };
  if (action.type === 'message') return { ...state, message: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  return state;
}

function validate${id}(form) {
  const errors = {};
  if (!form.driver.trim() || form.driver.trim().length < 3) errors.driver = 'invalid';
  if (!form.vehicle.trim() || form.vehicle.trim().length < 3) errors.vehicle = 'invalid';
  if (!form.route.trim() || form.route.trim().length < 2) errors.route = 'invalid';
  const speed = Number(form.speed);
  if (!Number.isFinite(speed) || speed < 20 || speed > 200) errors.speed = 'invalid';
  const fatigue = Number(form.fatigue);
  if (!Number.isFinite(fatigue) || fatigue < 0 || fatigue > 100) errors.fatigue = 'invalid';
  if (!form.notes.trim() || form.notes.trim().length < 10) errors.notes = 'invalid';
  return errors;
}

function transformChart${id}(records) {
  return records.map((item, idx) => ({
    name: 'T' + (idx + 1),
    risk: Number(item.risk.toFixed(2)),
    load: Number(item.load.toFixed(2)),
    guard: Number(item.guard.toFixed(2)),
    blend: Number((item.risk * 0.58 + item.load * 0.21 + (100 - item.guard) * 0.21).toFixed(2))
  }));
}

export default function ScalePage${id}() {
  const [seed, setSeed] = useState(${index * 7});
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    driver: '',
    vehicle: '',
    route: '',
    speed: 78,
    fatigue: 32,
    mode: 'balanced',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [state, dispatch] = useReducer(reducer${id}, initialState${id});

  useEffect(() => {
    let active = true;
    dispatch({ type: 'loading', payload: true });
    simulateRiskApi${utilId}({ seed, points: 36, mode: form.mode }).then((payload) => {
      if (!active) return;
      dispatch({ type: 'records', payload });
      dispatch({ type: 'loading', payload: false });
      dispatch({ type: 'message', payload: 'loaded-' + payload.length + '-rows' });
    });
    return () => {
      active = false;
    };
  }, [seed, form.mode]);

  const rows = useMemo(() => pipelineData${utilId}(state.records.map((r) => r.risk), query, form.mode), [state.records, query, form.mode]);
  const table = useMemo(() => buildTableState${utilId}(rows, state.sortBy, state.sortDir, state.page, 9), [rows, state.sortBy, state.sortDir, state.page]);
  const chartData = useMemo(() => transformChart${id}(state.records), [state.records]);

  useEffect(() => {
    if (state.page > table.totalPages) {
      dispatch({ type: 'page', payload: table.totalPages || 1 });
    }
  }, [state.page, table.totalPages]);

  const stats = useMemo(() => {
    const total = chartData.reduce((sum, row) => sum + row.risk, 0);
    const avg = total / Math.max(1, chartData.length);
    const max = chartData.reduce((m, row) => Math.max(m, row.risk), 0);
    const min = chartData.reduce((m, row) => Math.min(m, row.risk), Infinity);
    const drift = chartData.reduce((sum, row, idx) => sum + row.blend * (idx + 1), 0) / Math.max(1, chartData.length * 7);
    return {
      total,
      avg,
      max,
      min: Number.isFinite(min) ? min : 0,
      drift
    };
  }, [chartData]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    const nextErrors = validate${id}(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSeed((s) => s + Number(form.speed) + Number(form.fatigue) + ${index});
      dispatch({ type: 'tab', payload: 'table' });
      dispatch({ type: 'modal', payload: true });
    }
  }

  return (
    <div className="scale-page-${id}">
      <header className="scale-header-${id}">
        <div>
          <h2>Scale Page ${index}</h2>
          <div>{state.message}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'table' })}>Table</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'forms' })}>Forms</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'charts' })}>Charts</button>
        </div>
      </header>

      <div className="scale-grid-${id}">
${usageGrid}
      </div>

      <div className="scale-panel-${id}">
        <form className="scale-form-${id}" onSubmit={submitForm}>
          <input name="driver" value={form.driver} onChange={updateField} placeholder="Driver" />
          <input name="vehicle" value={form.vehicle} onChange={updateField} placeholder="Vehicle" />
          <input name="route" value={form.route} onChange={updateField} placeholder="Route" />
          <input name="speed" type="number" min="20" max="200" value={form.speed} onChange={updateField} />
          <input name="fatigue" type="number" min="0" max="100" value={form.fatigue} onChange={updateField} />
          <select name="mode" value={form.mode} onChange={updateField}>
            <option value="safe">Safe</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <textarea name="notes" rows="4" value={form.notes} onChange={updateField} placeholder="Notes" />
          <button type="submit">Run Validation</button>
        </form>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }}>
          <div>Avg {stats.avg.toFixed(2)}</div>
          <div>Max {stats.max.toFixed(2)}</div>
          <div>Min {stats.min.toFixed(2)}</div>
          <div>Drift {stats.drift.toFixed(2)}</div>
        </div>
        <div style={{ color: '#ffbdbd' }}>{Object.keys(errors).join(' | ')}</div>
      </div>

      <div className="scale-panel-${id}">
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter zones" />
          <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'score' })}>Score</button>
          <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'visibility' })}>Visibility</button>
          <button type="button" onClick={() => dispatch({ type: 'sortDir', payload: state.sortDir === 'asc' ? 'desc' : 'asc' })}>Dir</button>
          <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.max(1, state.page - 1) })}>Prev</button>
          <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.min(table.totalPages, state.page + 1) })}>Next</button>
        </div>
        <table className="scale-table-${id}">
          <thead>
            <tr>
              <th>ID</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Score</th>
              <th>Visibility</th>
              <th>Anomaly</th>
            </tr>
          </thead>
          <tbody>
            {table.pageRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.zone}</td>
                <td>{row.status}</td>
                <td>{row.score.toFixed(2)}</td>
                <td>{row.visibility.toFixed(2)}</td>
                <td>{row.anomaly.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>{table.page} / {table.totalPages} | {table.total}</div>
      </div>

      <div className="scale-panel-${id}">
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#00e5ff" dot={false} />
              <Line type="monotone" dataKey="blend" stroke="#ff8c42" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="load" stroke="#7bf1a8" fill="#7bf1a8" fillOpacity={0.18} />
              <Area type="monotone" dataKey="guard" stroke="#f6d365" fill="#f6d365" fillOpacity={0.16} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {state.modalOpen && (
        <div className="scale-modal-${id}" onClick={() => dispatch({ type: 'modal', payload: false })}>
          <div className="scale-modal-body-${id}" onClick={(event) => event.stopPropagation()}>
${usageModal}
            <button type="button" onClick={() => dispatch({ type: 'modal', payload: false })}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
}

function massiveRoutesContent(pageCount) {
  const imports = Array.from({ length: pageCount }, (_, idx) => {
    const id = pad(idx + 1, 2);
    return `import ScalePage${id} from '../pages/ScalePage${id}.jsx';`;
  }).join('\n');

  const links = Array.from({ length: pageCount }, (_, idx) => {
    const id = pad(idx + 1, 2);
    return `          <NavLink key="${id}" to="/scale/p${id}" style={({ isActive }) => ({ padding: '6px 9px', borderRadius: 8, background: isActive ? 'rgba(0,229,255,0.24)' : 'rgba(255,255,255,0.07)' })}>P${id}</NavLink>`;
  }).join('\n');

  const routes = Array.from({ length: pageCount }, (_, idx) => {
    const id = pad(idx + 1, 2);
    return `          <Route path="p${id}" element={<ScalePage${id} />} />`;
  }).join('\n');

  return `import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
${imports}
import '../styles/massiveBase.css';

export default function MassiveRoutes() {
  return (
    <div className="massive-routes-shell">
      <div className="massive-route-nav">
${links}
      </div>
      <div className="massive-route-content">
        <Routes>
${routes}
          <Route path="*" element={<Navigate to="/scale/p01" replace />} />
        </Routes>
      </div>
    </div>
  );
}
`;
}

function massiveBaseStyle() {
  const lines = [];
  lines.push('.massive-routes-shell { display: grid; gap: 14px; padding: 14px; }');
  lines.push('.massive-route-nav { display: flex; flex-wrap: wrap; gap: 6px; }');
  lines.push('.massive-route-nav a { color: white; font-size: 12px; }');
  lines.push('.massive-route-content { display: grid; gap: 10px; }');
  for (let i = 0; i < 480; i += 1) {
    const hue = (i * 19) % 360;
    lines.push(`.massive-token-${i} { border-color: hsla(${hue}, 70%, 64%, 0.31); background: hsla(${hue}, 52%, 18%, 0.17); color: hsl(${(hue + 160) % 360}, 80%, 88%); padding: ${(i % 6) + 2}px; border-radius: ${(i % 9) + 3}px; }`);
  }
  return lines.join('\n') + '\n';
}

function generate() {
  ensureDir(massiveRoot);
  ensureDir(path.join(massiveRoot, 'hooks'));
  ensureDir(path.join(massiveRoot, 'utils'));
  ensureDir(path.join(massiveRoot, 'components'));
  ensureDir(path.join(massiveRoot, 'pages'));
  ensureDir(path.join(massiveRoot, 'routes'));
  ensureDir(path.join(massiveRoot, 'styles'));

  for (let i = 1; i <= COUNTS.hooks; i += 1) {
    write(`hooks/useMegaHook${pad(i)}.js`, hookContent(i));
  }

  for (let i = 1; i <= COUNTS.utils; i += 1) {
    write(`utils/transformSet${pad(i)}.js`, utilContent(i));
  }

  for (let i = 1; i <= COUNTS.components; i += 1) {
    write(`components/MegaComponent${pad(i)}.jsx`, componentContent(i));
    write(`styles/component${pad(i)}.css`, componentStyle(i));
  }

  for (let i = 1; i <= COUNTS.pages; i += 1) {
    write(`pages/ScalePage${pad(i, 2)}.jsx`, pageContent(i));
    write(`styles/page${pad(i, 2)}.css`, pageStyle(i));
  }

  write('routes/MassiveRoutes.jsx', massiveRoutesContent(COUNTS.pages));
  write('styles/massiveBase.css', massiveBaseStyle());

  const summary = {
    hooks: COUNTS.hooks,
    utils: COUNTS.utils,
    components: COUNTS.components,
    componentStyles: COUNTS.components,
    pages: COUNTS.pages,
    pageStyles: COUNTS.pages,
    routes: 1,
    baseStyles: 1,
  };

  const totalFiles = Object.values(summary).reduce((sum, n) => sum + n, 0);
  fs.writeFileSync(path.join(srcRoot, 'massive-generation-summary.json'), JSON.stringify({ summary, totalFiles }, null, 2));
  return totalFiles;
}

const totalFiles = generate();
console.log(`Generated files: ${totalFiles}`);
