import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState30, heavyCompute30, transformDataset30 } from '../utils/compute30.js';
import Component291 from '../components/Component291.jsx';
import Component292 from '../components/Component292.jsx';
import Component293 from '../components/Component293.jsx';
import Component294 from '../components/Component294.jsx';
import Component295 from '../components/Component295.jsx';
import Component296 from '../components/Component296.jsx';
import Component297 from '../components/Component297.jsx';
import Component298 from '../components/Component298.jsx';
import Component299 from '../components/Component299.jsx';
import Component300 from '../components/Component300.jsx';
import '../styles/page30.css';

const initialState30 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer30(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource30(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page30() {
  const [seed, setSeed] = useState(270);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer30, initialState30);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 30,
    segment: 'S' + ((30 % 5) + 1),
    window: 4,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource30(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset30(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState30(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute30(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 30);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-30">
      <div className="header-30">
        <div>
          <h2>Page30</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-30">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-30">
        <div className="sidebar-30">
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

        <div className="content-30">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-30">
          <Component291 seed={seed + 1} title={'Page30-Component291'} />
          <Component292 seed={seed + 2} title={'Page30-Component292'} />
          <Component293 seed={seed + 3} title={'Page30-Component293'} />
          <Component294 seed={seed + 4} title={'Page30-Component294'} />
          </div>
          <div className="component-grid-30">
          <Component295 seed={seed + 7} title={'Page30-Widget295'} />
          <Component296 seed={seed + 8} title={'Page30-Widget296'} />
          <Component297 seed={seed + 9} title={'Page30-Widget297'} />
          <Component298 seed={seed + 10} title={'Page30-Widget298'} />
          <Component299 seed={seed + 11} title={'Page30-Widget299'} />
          <Component300 seed={seed + 12} title={'Page30-Widget300'} />
          </div>
        </div>
      </div>
    </div>
  );
}
