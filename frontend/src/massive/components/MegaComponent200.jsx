import { useEffect, useMemo, useReducer, useState } from 'react';
import { useMegaHook080 } from '../hooks/useMegaHook080.js';
import { buildTableState080, pipelineData080 } from '../utils/transformSet080.js';
import '../styles/component200.css';

function Meter200({ label, value, ceiling }) {
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

function NestedBlock200({ rows, onSelect, activeId }) {
  return (
    <div className="mega-list-200">
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => onSelect(row.id)}
          className="mega-item-200"
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

const initialState200 = {
  mode: 'balanced',
  count: 2,
  active: 1,
  submitted: 0,
  toggle: false
};

function reducer200(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'count') return { ...state, count: state.count + action.payload };
  if (action.type === 'active') return { ...state, active: action.payload };
  if (action.type === 'submitted') return { ...state, submitted: state.submitted + 1 };
  if (action.type === 'toggle') return { ...state, toggle: !state.toggle };
  return state;
}

export default function MegaComponent200({ seed = 200, title = 'Module 200' }) {
  const hook = useMegaHook080(seed + 200);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ vehicle: '', operator: '', speedCap: 78 + (200 % 17), profile: 'standard' });
  const [state, dispatch] = useReducer(reducer200, initialState200);

  const transformed = useMemo(() => pipelineData080(hook.series, query, state.mode), [hook.series, query, state.mode]);
  const table = useMemo(() => buildTableState080(transformed, sortBy, sortDir, page, 8), [transformed, sortBy, sortDir, page]);

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
    <section className="mega-card-200">
      <header className="mega-header-200">
        <strong>{title}</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => hook.mutate('safe')}>Safe</button>
          <button type="button" onClick={() => hook.mutate('balanced')}>Balanced</button>
          <button type="button" onClick={() => hook.mutate('aggressive')}>Aggressive</button>
        </div>
      </header>

      <div className="mega-grid-200">
        <div className="mega-pane-200">
          <Meter200 label="Average" value={summary.avg} ceiling={100} />
          <Meter200 label="Peak" value={summary.max} ceiling={130} />
          <Meter200 label="Spread" value={summary.max - summary.min} ceiling={130} />
          <Meter200 label="Quality" value={hook.state.quality} ceiling={130} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by zone or status" />
          <NestedBlock200 rows={table.pageRows} onSelect={(value) => dispatch({ type: 'active', payload: value })} activeId={state.active} />
        </div>

        <div className="mega-pane-200">
          <form className="mega-form-200" onSubmit={submitLocal}>
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
