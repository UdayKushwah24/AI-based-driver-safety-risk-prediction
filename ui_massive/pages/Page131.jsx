import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState131, heavyCompute131, transformDataset131 } from '../utils/compute131.js';
import Component201 from '../components/Component201.jsx';
import Component202 from '../components/Component202.jsx';
import Component203 from '../components/Component203.jsx';
import Component204 from '../components/Component204.jsx';
import Component205 from '../components/Component205.jsx';
import Component206 from '../components/Component206.jsx';
import Component207 from '../components/Component207.jsx';
import Component208 from '../components/Component208.jsx';
import Component209 from '../components/Component209.jsx';
import Component210 from '../components/Component210.jsx';
import '../styles/page131.css';

const initialState131 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer131(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource131(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page131() {
  const [seed, setSeed] = useState(1179);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer131, initialState131);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 131,
    segment: 'S' + ((131 % 5) + 1),
    window: 9,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource131(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset131(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState131(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute131(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 131);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-131">
      <div className="header-131">
        <div>
          <h2>Page131</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-131">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-131">
        <div className="sidebar-131">
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

        <div className="content-131">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-131">
          <Component201 seed={seed + 1} title={'Page131-Component201'} />
          <Component202 seed={seed + 2} title={'Page131-Component202'} />
          <Component203 seed={seed + 3} title={'Page131-Component203'} />
          <Component204 seed={seed + 4} title={'Page131-Component204'} />
          </div>
          <div className="component-grid-131">
          <Component205 seed={seed + 7} title={'Page131-Widget205'} />
          <Component206 seed={seed + 8} title={'Page131-Widget206'} />
          <Component207 seed={seed + 9} title={'Page131-Widget207'} />
          <Component208 seed={seed + 10} title={'Page131-Widget208'} />
          <Component209 seed={seed + 11} title={'Page131-Widget209'} />
          <Component210 seed={seed + 12} title={'Page131-Widget210'} />
          </div>
        </div>
      </div>
    </div>
  );
}
