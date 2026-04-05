import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState84, heavyCompute84, transformDataset84 } from '../utils/compute84.js';
import Component831 from '../components/Component831.jsx';
import Component832 from '../components/Component832.jsx';
import Component833 from '../components/Component833.jsx';
import Component834 from '../components/Component834.jsx';
import Component835 from '../components/Component835.jsx';
import Component836 from '../components/Component836.jsx';
import Component837 from '../components/Component837.jsx';
import Component838 from '../components/Component838.jsx';
import Component839 from '../components/Component839.jsx';
import Component840 from '../components/Component840.jsx';
import '../styles/page84.css';

const initialState84 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer84(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource84(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page84() {
  const [seed, setSeed] = useState(756);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer84, initialState84);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 84,
    segment: 'S' + ((84 % 5) + 1),
    window: 4,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource84(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset84(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState84(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute84(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 84);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-84">
      <div className="header-84">
        <div>
          <h2>Page84</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-84">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-84">
        <div className="sidebar-84">
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

        <div className="content-84">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-84">
          <Component831 seed={seed + 1} title={'Page84-Component831'} />
          <Component832 seed={seed + 2} title={'Page84-Component832'} />
          <Component833 seed={seed + 3} title={'Page84-Component833'} />
          <Component834 seed={seed + 4} title={'Page84-Component834'} />
          </div>
          <div className="component-grid-84">
          <Component835 seed={seed + 7} title={'Page84-Widget835'} />
          <Component836 seed={seed + 8} title={'Page84-Widget836'} />
          <Component837 seed={seed + 9} title={'Page84-Widget837'} />
          <Component838 seed={seed + 10} title={'Page84-Widget838'} />
          <Component839 seed={seed + 11} title={'Page84-Widget839'} />
          <Component840 seed={seed + 12} title={'Page84-Widget840'} />
          </div>
        </div>
      </div>
    </div>
  );
}
