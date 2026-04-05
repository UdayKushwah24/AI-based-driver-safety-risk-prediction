import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState123, heavyCompute123, transformDataset123 } from '../utils/compute123.js';
import Component121 from '../components/Component121.jsx';
import Component122 from '../components/Component122.jsx';
import Component123 from '../components/Component123.jsx';
import Component124 from '../components/Component124.jsx';
import Component125 from '../components/Component125.jsx';
import Component126 from '../components/Component126.jsx';
import Component127 from '../components/Component127.jsx';
import Component128 from '../components/Component128.jsx';
import Component129 from '../components/Component129.jsx';
import Component130 from '../components/Component130.jsx';
import '../styles/page123.css';

const initialState123 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer123(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource123(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page123() {
  const [seed, setSeed] = useState(1107);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer123, initialState123);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 123,
    segment: 'S' + ((123 % 5) + 1),
    window: 7,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource123(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset123(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState123(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute123(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 123);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-123">
      <div className="header-123">
        <div>
          <h2>Page123</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-123">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-123">
        <div className="sidebar-123">
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

        <div className="content-123">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-123">
          <Component121 seed={seed + 1} title={'Page123-Component121'} />
          <Component122 seed={seed + 2} title={'Page123-Component122'} />
          <Component123 seed={seed + 3} title={'Page123-Component123'} />
          <Component124 seed={seed + 4} title={'Page123-Component124'} />
          </div>
          <div className="component-grid-123">
          <Component125 seed={seed + 7} title={'Page123-Widget125'} />
          <Component126 seed={seed + 8} title={'Page123-Widget126'} />
          <Component127 seed={seed + 9} title={'Page123-Widget127'} />
          <Component128 seed={seed + 10} title={'Page123-Widget128'} />
          <Component129 seed={seed + 11} title={'Page123-Widget129'} />
          <Component130 seed={seed + 12} title={'Page123-Widget130'} />
          </div>
        </div>
      </div>
    </div>
  );
}
