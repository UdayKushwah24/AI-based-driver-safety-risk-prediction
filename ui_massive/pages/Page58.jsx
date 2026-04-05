import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState58, heavyCompute58, transformDataset58 } from '../utils/compute58.js';
import Component571 from '../components/Component571.jsx';
import Component572 from '../components/Component572.jsx';
import Component573 from '../components/Component573.jsx';
import Component574 from '../components/Component574.jsx';
import Component575 from '../components/Component575.jsx';
import Component576 from '../components/Component576.jsx';
import Component577 from '../components/Component577.jsx';
import Component578 from '../components/Component578.jsx';
import Component579 from '../components/Component579.jsx';
import Component580 from '../components/Component580.jsx';
import '../styles/page58.css';

const initialState58 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer58(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource58(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page58() {
  const [seed, setSeed] = useState(522);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer58, initialState58);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 58,
    segment: 'S' + ((58 % 5) + 1),
    window: 8,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource58(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset58(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState58(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute58(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 58);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-58">
      <div className="header-58">
        <div>
          <h2>Page58</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-58">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-58">
        <div className="sidebar-58">
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

        <div className="content-58">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-58">
          <Component571 seed={seed + 1} title={'Page58-Component571'} />
          <Component572 seed={seed + 2} title={'Page58-Component572'} />
          <Component573 seed={seed + 3} title={'Page58-Component573'} />
          <Component574 seed={seed + 4} title={'Page58-Component574'} />
          </div>
          <div className="component-grid-58">
          <Component575 seed={seed + 7} title={'Page58-Widget575'} />
          <Component576 seed={seed + 8} title={'Page58-Widget576'} />
          <Component577 seed={seed + 9} title={'Page58-Widget577'} />
          <Component578 seed={seed + 10} title={'Page58-Widget578'} />
          <Component579 seed={seed + 11} title={'Page58-Widget579'} />
          <Component580 seed={seed + 12} title={'Page58-Widget580'} />
          </div>
        </div>
      </div>
    </div>
  );
}
