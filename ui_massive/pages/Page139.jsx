import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState139, heavyCompute139, transformDataset139 } from '../utils/compute139.js';
import Component281 from '../components/Component281.jsx';
import Component282 from '../components/Component282.jsx';
import Component283 from '../components/Component283.jsx';
import Component284 from '../components/Component284.jsx';
import Component285 from '../components/Component285.jsx';
import Component286 from '../components/Component286.jsx';
import Component287 from '../components/Component287.jsx';
import Component288 from '../components/Component288.jsx';
import Component289 from '../components/Component289.jsx';
import Component290 from '../components/Component290.jsx';
import '../styles/page139.css';

const initialState139 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer139(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource139(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page139() {
  const [seed, setSeed] = useState(1251);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer139, initialState139);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 139,
    segment: 'S' + ((139 % 5) + 1),
    window: 5,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource139(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset139(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState139(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute139(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 139);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-139">
      <div className="header-139">
        <div>
          <h2>Page139</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-139">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-139">
        <div className="sidebar-139">
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

        <div className="content-139">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-139">
          <Component281 seed={seed + 1} title={'Page139-Component281'} />
          <Component282 seed={seed + 2} title={'Page139-Component282'} />
          <Component283 seed={seed + 3} title={'Page139-Component283'} />
          <Component284 seed={seed + 4} title={'Page139-Component284'} />
          </div>
          <div className="component-grid-139">
          <Component285 seed={seed + 7} title={'Page139-Widget285'} />
          <Component286 seed={seed + 8} title={'Page139-Widget286'} />
          <Component287 seed={seed + 9} title={'Page139-Widget287'} />
          <Component288 seed={seed + 10} title={'Page139-Widget288'} />
          <Component289 seed={seed + 11} title={'Page139-Widget289'} />
          <Component290 seed={seed + 12} title={'Page139-Widget290'} />
          </div>
        </div>
      </div>
    </div>
  );
}
