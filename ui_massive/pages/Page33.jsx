import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState33, heavyCompute33, transformDataset33 } from '../utils/compute33.js';
import Component321 from '../components/Component321.jsx';
import Component322 from '../components/Component322.jsx';
import Component323 from '../components/Component323.jsx';
import Component324 from '../components/Component324.jsx';
import Component325 from '../components/Component325.jsx';
import Component326 from '../components/Component326.jsx';
import Component327 from '../components/Component327.jsx';
import Component328 from '../components/Component328.jsx';
import Component329 from '../components/Component329.jsx';
import Component330 from '../components/Component330.jsx';
import '../styles/page33.css';

const initialState33 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer33(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource33(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page33() {
  const [seed, setSeed] = useState(297);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer33, initialState33);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 33,
    segment: 'S' + ((33 % 5) + 1),
    window: 7,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource33(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset33(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState33(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute33(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 33);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-33">
      <div className="header-33">
        <div>
          <h2>Page33</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-33">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-33">
        <div className="sidebar-33">
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

        <div className="content-33">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-33">
          <Component321 seed={seed + 1} title={'Page33-Component321'} />
          <Component322 seed={seed + 2} title={'Page33-Component322'} />
          <Component323 seed={seed + 3} title={'Page33-Component323'} />
          <Component324 seed={seed + 4} title={'Page33-Component324'} />
          </div>
          <div className="component-grid-33">
          <Component325 seed={seed + 7} title={'Page33-Widget325'} />
          <Component326 seed={seed + 8} title={'Page33-Widget326'} />
          <Component327 seed={seed + 9} title={'Page33-Widget327'} />
          <Component328 seed={seed + 10} title={'Page33-Widget328'} />
          <Component329 seed={seed + 11} title={'Page33-Widget329'} />
          <Component330 seed={seed + 12} title={'Page33-Widget330'} />
          </div>
        </div>
      </div>
    </div>
  );
}
