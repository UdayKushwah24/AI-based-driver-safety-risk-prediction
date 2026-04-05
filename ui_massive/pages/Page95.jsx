import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState95, heavyCompute95, transformDataset95 } from '../utils/compute95.js';
import Component941 from '../components/Component941.jsx';
import Component942 from '../components/Component942.jsx';
import Component943 from '../components/Component943.jsx';
import Component944 from '../components/Component944.jsx';
import Component945 from '../components/Component945.jsx';
import Component946 from '../components/Component946.jsx';
import Component947 from '../components/Component947.jsx';
import Component948 from '../components/Component948.jsx';
import Component949 from '../components/Component949.jsx';
import Component950 from '../components/Component950.jsx';
import '../styles/page95.css';

const initialState95 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer95(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource95(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page95() {
  const [seed, setSeed] = useState(855);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer95, initialState95);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 95,
    segment: 'S' + ((95 % 5) + 1),
    window: 9,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource95(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset95(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState95(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute95(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 95);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-95">
      <div className="header-95">
        <div>
          <h2>Page95</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-95">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-95">
        <div className="sidebar-95">
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

        <div className="content-95">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-95">
          <Component941 seed={seed + 1} title={'Page95-Component941'} />
          <Component942 seed={seed + 2} title={'Page95-Component942'} />
          <Component943 seed={seed + 3} title={'Page95-Component943'} />
          <Component944 seed={seed + 4} title={'Page95-Component944'} />
          </div>
          <div className="component-grid-95">
          <Component945 seed={seed + 7} title={'Page95-Widget945'} />
          <Component946 seed={seed + 8} title={'Page95-Widget946'} />
          <Component947 seed={seed + 9} title={'Page95-Widget947'} />
          <Component948 seed={seed + 10} title={'Page95-Widget948'} />
          <Component949 seed={seed + 11} title={'Page95-Widget949'} />
          <Component950 seed={seed + 12} title={'Page95-Widget950'} />
          </div>
        </div>
      </div>
    </div>
  );
}
