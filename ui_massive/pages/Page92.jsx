import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState92, heavyCompute92, transformDataset92 } from '../utils/compute92.js';
import Component911 from '../components/Component911.jsx';
import Component912 from '../components/Component912.jsx';
import Component913 from '../components/Component913.jsx';
import Component914 from '../components/Component914.jsx';
import Component915 from '../components/Component915.jsx';
import Component916 from '../components/Component916.jsx';
import Component917 from '../components/Component917.jsx';
import Component918 from '../components/Component918.jsx';
import Component919 from '../components/Component919.jsx';
import Component920 from '../components/Component920.jsx';
import '../styles/page92.css';

const initialState92 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer92(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource92(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page92() {
  const [seed, setSeed] = useState(828);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer92, initialState92);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 92,
    segment: 'S' + ((92 % 5) + 1),
    window: 6,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource92(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset92(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState92(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute92(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 92);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-92">
      <div className="header-92">
        <div>
          <h2>Page92</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-92">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-92">
        <div className="sidebar-92">
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

        <div className="content-92">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-92">
          <Component911 seed={seed + 1} title={'Page92-Component911'} />
          <Component912 seed={seed + 2} title={'Page92-Component912'} />
          <Component913 seed={seed + 3} title={'Page92-Component913'} />
          <Component914 seed={seed + 4} title={'Page92-Component914'} />
          </div>
          <div className="component-grid-92">
          <Component915 seed={seed + 7} title={'Page92-Widget915'} />
          <Component916 seed={seed + 8} title={'Page92-Widget916'} />
          <Component917 seed={seed + 9} title={'Page92-Widget917'} />
          <Component918 seed={seed + 10} title={'Page92-Widget918'} />
          <Component919 seed={seed + 11} title={'Page92-Widget919'} />
          <Component920 seed={seed + 12} title={'Page92-Widget920'} />
          </div>
        </div>
      </div>
    </div>
  );
}
