import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState60, heavyCompute60, transformDataset60 } from '../utils/compute60.js';
import Component591 from '../components/Component591.jsx';
import Component592 from '../components/Component592.jsx';
import Component593 from '../components/Component593.jsx';
import Component594 from '../components/Component594.jsx';
import Component595 from '../components/Component595.jsx';
import Component596 from '../components/Component596.jsx';
import Component597 from '../components/Component597.jsx';
import Component598 from '../components/Component598.jsx';
import Component599 from '../components/Component599.jsx';
import Component600 from '../components/Component600.jsx';
import '../styles/page60.css';

const initialState60 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer60(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource60(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page60() {
  const [seed, setSeed] = useState(540);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer60, initialState60);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 60,
    segment: 'S' + ((60 % 5) + 1),
    window: 4,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource60(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset60(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState60(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute60(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 60);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-60">
      <div className="header-60">
        <div>
          <h2>Page60</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-60">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-60">
        <div className="sidebar-60">
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

        <div className="content-60">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-60">
          <Component591 seed={seed + 1} title={'Page60-Component591'} />
          <Component592 seed={seed + 2} title={'Page60-Component592'} />
          <Component593 seed={seed + 3} title={'Page60-Component593'} />
          <Component594 seed={seed + 4} title={'Page60-Component594'} />
          </div>
          <div className="component-grid-60">
          <Component595 seed={seed + 7} title={'Page60-Widget595'} />
          <Component596 seed={seed + 8} title={'Page60-Widget596'} />
          <Component597 seed={seed + 9} title={'Page60-Widget597'} />
          <Component598 seed={seed + 10} title={'Page60-Widget598'} />
          <Component599 seed={seed + 11} title={'Page60-Widget599'} />
          <Component600 seed={seed + 12} title={'Page60-Widget600'} />
          </div>
        </div>
      </div>
    </div>
  );
}
