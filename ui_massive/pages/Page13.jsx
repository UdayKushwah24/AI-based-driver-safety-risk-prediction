import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState13, heavyCompute13, transformDataset13 } from '../utils/compute13.js';
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
import '../styles/page13.css';

const initialState13 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer13(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource13(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page13() {
  const [seed, setSeed] = useState(117);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer13, initialState13);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 13,
    segment: 'S' + ((13 % 5) + 1),
    window: 5,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource13(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset13(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState13(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute13(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 13);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-13">
      <div className="header-13">
        <div>
          <h2>Page13</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-13">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-13">
        <div className="sidebar-13">
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

        <div className="content-13">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-13">
          <Component121 seed={seed + 1} title={'Page13-Component121'} />
          <Component122 seed={seed + 2} title={'Page13-Component122'} />
          <Component123 seed={seed + 3} title={'Page13-Component123'} />
          <Component124 seed={seed + 4} title={'Page13-Component124'} />
          </div>
          <div className="component-grid-13">
          <Component125 seed={seed + 7} title={'Page13-Widget125'} />
          <Component126 seed={seed + 8} title={'Page13-Widget126'} />
          <Component127 seed={seed + 9} title={'Page13-Widget127'} />
          <Component128 seed={seed + 10} title={'Page13-Widget128'} />
          <Component129 seed={seed + 11} title={'Page13-Widget129'} />
          <Component130 seed={seed + 12} title={'Page13-Widget130'} />
          </div>
        </div>
      </div>
    </div>
  );
}
