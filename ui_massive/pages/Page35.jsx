import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState35, heavyCompute35, transformDataset35 } from '../utils/compute35.js';
import Component341 from '../components/Component341.jsx';
import Component342 from '../components/Component342.jsx';
import Component343 from '../components/Component343.jsx';
import Component344 from '../components/Component344.jsx';
import Component345 from '../components/Component345.jsx';
import Component346 from '../components/Component346.jsx';
import Component347 from '../components/Component347.jsx';
import Component348 from '../components/Component348.jsx';
import Component349 from '../components/Component349.jsx';
import Component350 from '../components/Component350.jsx';
import '../styles/page35.css';

const initialState35 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer35(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource35(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page35() {
  const [seed, setSeed] = useState(315);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer35, initialState35);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 35,
    segment: 'S' + ((35 % 5) + 1),
    window: 9,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource35(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset35(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState35(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute35(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 35);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-35">
      <div className="header-35">
        <div>
          <h2>Page35</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-35">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-35">
        <div className="sidebar-35">
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

        <div className="content-35">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-35">
          <Component341 seed={seed + 1} title={'Page35-Component341'} />
          <Component342 seed={seed + 2} title={'Page35-Component342'} />
          <Component343 seed={seed + 3} title={'Page35-Component343'} />
          <Component344 seed={seed + 4} title={'Page35-Component344'} />
          </div>
          <div className="component-grid-35">
          <Component345 seed={seed + 7} title={'Page35-Widget345'} />
          <Component346 seed={seed + 8} title={'Page35-Widget346'} />
          <Component347 seed={seed + 9} title={'Page35-Widget347'} />
          <Component348 seed={seed + 10} title={'Page35-Widget348'} />
          <Component349 seed={seed + 11} title={'Page35-Widget349'} />
          <Component350 seed={seed + 12} title={'Page35-Widget350'} />
          </div>
        </div>
      </div>
    </div>
  );
}
