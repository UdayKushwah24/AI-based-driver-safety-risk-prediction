import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState138, heavyCompute138, transformDataset138 } from '../utils/compute138.js';
import Component271 from '../components/Component271.jsx';
import Component272 from '../components/Component272.jsx';
import Component273 from '../components/Component273.jsx';
import Component274 from '../components/Component274.jsx';
import Component275 from '../components/Component275.jsx';
import Component276 from '../components/Component276.jsx';
import Component277 from '../components/Component277.jsx';
import Component278 from '../components/Component278.jsx';
import Component279 from '../components/Component279.jsx';
import Component280 from '../components/Component280.jsx';
import '../styles/page138.css';

const initialState138 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer138(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource138(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page138() {
  const [seed, setSeed] = useState(1242);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer138, initialState138);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 138,
    segment: 'S' + ((138 % 5) + 1),
    window: 4,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource138(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset138(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState138(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute138(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 138);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-138">
      <div className="header-138">
        <div>
          <h2>Page138</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-138">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-138">
        <div className="sidebar-138">
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

        <div className="content-138">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-138">
          <Component271 seed={seed + 1} title={'Page138-Component271'} />
          <Component272 seed={seed + 2} title={'Page138-Component272'} />
          <Component273 seed={seed + 3} title={'Page138-Component273'} />
          <Component274 seed={seed + 4} title={'Page138-Component274'} />
          </div>
          <div className="component-grid-138">
          <Component275 seed={seed + 7} title={'Page138-Widget275'} />
          <Component276 seed={seed + 8} title={'Page138-Widget276'} />
          <Component277 seed={seed + 9} title={'Page138-Widget277'} />
          <Component278 seed={seed + 10} title={'Page138-Widget278'} />
          <Component279 seed={seed + 11} title={'Page138-Widget279'} />
          <Component280 seed={seed + 12} title={'Page138-Widget280'} />
          </div>
        </div>
      </div>
    </div>
  );
}
