import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState50, heavyCompute50, transformDataset50 } from '../utils/compute50.js';
import Component491 from '../components/Component491.jsx';
import Component492 from '../components/Component492.jsx';
import Component493 from '../components/Component493.jsx';
import Component494 from '../components/Component494.jsx';
import Component495 from '../components/Component495.jsx';
import Component496 from '../components/Component496.jsx';
import Component497 from '../components/Component497.jsx';
import Component498 from '../components/Component498.jsx';
import Component499 from '../components/Component499.jsx';
import Component500 from '../components/Component500.jsx';
import '../styles/page50.css';

const initialState50 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer50(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource50(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page50() {
  const [seed, setSeed] = useState(450);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer50, initialState50);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 50,
    segment: 'S' + ((50 % 5) + 1),
    window: 6,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource50(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset50(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState50(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute50(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 50);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-50">
      <div className="header-50">
        <div>
          <h2>Page50</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-50">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-50">
        <div className="sidebar-50">
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

        <div className="content-50">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-50">
          <Component491 seed={seed + 1} title={'Page50-Component491'} />
          <Component492 seed={seed + 2} title={'Page50-Component492'} />
          <Component493 seed={seed + 3} title={'Page50-Component493'} />
          <Component494 seed={seed + 4} title={'Page50-Component494'} />
          </div>
          <div className="component-grid-50">
          <Component495 seed={seed + 7} title={'Page50-Widget495'} />
          <Component496 seed={seed + 8} title={'Page50-Widget496'} />
          <Component497 seed={seed + 9} title={'Page50-Widget497'} />
          <Component498 seed={seed + 10} title={'Page50-Widget498'} />
          <Component499 seed={seed + 11} title={'Page50-Widget499'} />
          <Component500 seed={seed + 12} title={'Page50-Widget500'} />
          </div>
        </div>
      </div>
    </div>
  );
}
