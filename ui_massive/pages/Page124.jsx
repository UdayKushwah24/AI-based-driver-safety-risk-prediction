import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState124, heavyCompute124, transformDataset124 } from '../utils/compute124.js';
import Component131 from '../components/Component131.jsx';
import Component132 from '../components/Component132.jsx';
import Component133 from '../components/Component133.jsx';
import Component134 from '../components/Component134.jsx';
import Component135 from '../components/Component135.jsx';
import Component136 from '../components/Component136.jsx';
import Component137 from '../components/Component137.jsx';
import Component138 from '../components/Component138.jsx';
import Component139 from '../components/Component139.jsx';
import Component140 from '../components/Component140.jsx';
import '../styles/page124.css';

const initialState124 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer124(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource124(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page124() {
  const [seed, setSeed] = useState(1116);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer124, initialState124);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 124,
    segment: 'S' + ((124 % 5) + 1),
    window: 8,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource124(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset124(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState124(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute124(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 124);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-124">
      <div className="header-124">
        <div>
          <h2>Page124</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-124">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-124">
        <div className="sidebar-124">
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

        <div className="content-124">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-124">
          <Component131 seed={seed + 1} title={'Page124-Component131'} />
          <Component132 seed={seed + 2} title={'Page124-Component132'} />
          <Component133 seed={seed + 3} title={'Page124-Component133'} />
          <Component134 seed={seed + 4} title={'Page124-Component134'} />
          </div>
          <div className="component-grid-124">
          <Component135 seed={seed + 7} title={'Page124-Widget135'} />
          <Component136 seed={seed + 8} title={'Page124-Widget136'} />
          <Component137 seed={seed + 9} title={'Page124-Widget137'} />
          <Component138 seed={seed + 10} title={'Page124-Widget138'} />
          <Component139 seed={seed + 11} title={'Page124-Widget139'} />
          <Component140 seed={seed + 12} title={'Page124-Widget140'} />
          </div>
        </div>
      </div>
    </div>
  );
}
