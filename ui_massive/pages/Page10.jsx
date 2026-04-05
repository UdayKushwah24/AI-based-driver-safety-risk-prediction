import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState10, heavyCompute10, transformDataset10 } from '../utils/compute10.js';
import Component91 from '../components/Component91.jsx';
import Component92 from '../components/Component92.jsx';
import Component93 from '../components/Component93.jsx';
import Component94 from '../components/Component94.jsx';
import Component95 from '../components/Component95.jsx';
import Component96 from '../components/Component96.jsx';
import Component97 from '../components/Component97.jsx';
import Component98 from '../components/Component98.jsx';
import Component99 from '../components/Component99.jsx';
import Component100 from '../components/Component100.jsx';
import '../styles/page10.css';

const initialState10 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer10(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource10(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page10() {
  const [seed, setSeed] = useState(90);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer10, initialState10);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 10,
    segment: 'S' + ((10 % 5) + 1),
    window: 8,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource10(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset10(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState10(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute10(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 10);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-10">
      <div className="header-10">
        <div>
          <h2>Page10</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-10">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-10">
        <div className="sidebar-10">
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

        <div className="content-10">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-10">
          <Component91 seed={seed + 1} title={'Page10-Component91'} />
          <Component92 seed={seed + 2} title={'Page10-Component92'} />
          <Component93 seed={seed + 3} title={'Page10-Component93'} />
          <Component94 seed={seed + 4} title={'Page10-Component94'} />
          </div>
          <div className="component-grid-10">
          <Component95 seed={seed + 7} title={'Page10-Widget95'} />
          <Component96 seed={seed + 8} title={'Page10-Widget96'} />
          <Component97 seed={seed + 9} title={'Page10-Widget97'} />
          <Component98 seed={seed + 10} title={'Page10-Widget98'} />
          <Component99 seed={seed + 11} title={'Page10-Widget99'} />
          <Component100 seed={seed + 12} title={'Page10-Widget100'} />
          </div>
        </div>
      </div>
    </div>
  );
}
