import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState5, heavyCompute5, transformDataset5 } from '../utils/compute5.js';
import Component41 from '../components/Component41.jsx';
import Component42 from '../components/Component42.jsx';
import Component43 from '../components/Component43.jsx';
import Component44 from '../components/Component44.jsx';
import Component45 from '../components/Component45.jsx';
import Component46 from '../components/Component46.jsx';
import Component47 from '../components/Component47.jsx';
import Component48 from '../components/Component48.jsx';
import Component49 from '../components/Component49.jsx';
import Component50 from '../components/Component50.jsx';
import '../styles/page5.css';

const initialState5 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer5(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource5(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page5() {
  const [seed, setSeed] = useState(45);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer5, initialState5);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 5,
    segment: 'S' + ((5 % 5) + 1),
    window: 9,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource5(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset5(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState5(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute5(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 5);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-5">
      <div className="header-5">
        <div>
          <h2>Page5</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-5">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-5">
        <div className="sidebar-5">
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

        <div className="content-5">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-5">
          <Component41 seed={seed + 1} title={'Page5-Component41'} />
          <Component42 seed={seed + 2} title={'Page5-Component42'} />
          <Component43 seed={seed + 3} title={'Page5-Component43'} />
          <Component44 seed={seed + 4} title={'Page5-Component44'} />
          </div>
          <div className="component-grid-5">
          <Component45 seed={seed + 7} title={'Page5-Widget45'} />
          <Component46 seed={seed + 8} title={'Page5-Widget46'} />
          <Component47 seed={seed + 9} title={'Page5-Widget47'} />
          <Component48 seed={seed + 10} title={'Page5-Widget48'} />
          <Component49 seed={seed + 11} title={'Page5-Widget49'} />
          <Component50 seed={seed + 12} title={'Page5-Widget50'} />
          </div>
        </div>
      </div>
    </div>
  );
}
