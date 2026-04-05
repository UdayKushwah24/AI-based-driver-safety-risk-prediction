import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState45, heavyCompute45, transformDataset45 } from '../utils/compute45.js';
import Component441 from '../components/Component441.jsx';
import Component442 from '../components/Component442.jsx';
import Component443 from '../components/Component443.jsx';
import Component444 from '../components/Component444.jsx';
import Component445 from '../components/Component445.jsx';
import Component446 from '../components/Component446.jsx';
import Component447 from '../components/Component447.jsx';
import Component448 from '../components/Component448.jsx';
import Component449 from '../components/Component449.jsx';
import Component450 from '../components/Component450.jsx';
import '../styles/page45.css';

const initialState45 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer45(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource45(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page45() {
  const [seed, setSeed] = useState(405);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer45, initialState45);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 45,
    segment: 'S' + ((45 % 5) + 1),
    window: 7,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource45(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset45(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState45(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute45(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 45);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-45">
      <div className="header-45">
        <div>
          <h2>Page45</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-45">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-45">
        <div className="sidebar-45">
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

        <div className="content-45">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-45">
          <Component441 seed={seed + 1} title={'Page45-Component441'} />
          <Component442 seed={seed + 2} title={'Page45-Component442'} />
          <Component443 seed={seed + 3} title={'Page45-Component443'} />
          <Component444 seed={seed + 4} title={'Page45-Component444'} />
          </div>
          <div className="component-grid-45">
          <Component445 seed={seed + 7} title={'Page45-Widget445'} />
          <Component446 seed={seed + 8} title={'Page45-Widget446'} />
          <Component447 seed={seed + 9} title={'Page45-Widget447'} />
          <Component448 seed={seed + 10} title={'Page45-Widget448'} />
          <Component449 seed={seed + 11} title={'Page45-Widget449'} />
          <Component450 seed={seed + 12} title={'Page45-Widget450'} />
          </div>
        </div>
      </div>
    </div>
  );
}
