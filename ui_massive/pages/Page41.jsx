import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState41, heavyCompute41, transformDataset41 } from '../utils/compute41.js';
import Component401 from '../components/Component401.jsx';
import Component402 from '../components/Component402.jsx';
import Component403 from '../components/Component403.jsx';
import Component404 from '../components/Component404.jsx';
import Component405 from '../components/Component405.jsx';
import Component406 from '../components/Component406.jsx';
import Component407 from '../components/Component407.jsx';
import Component408 from '../components/Component408.jsx';
import Component409 from '../components/Component409.jsx';
import Component410 from '../components/Component410.jsx';
import '../styles/page41.css';

const initialState41 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer41(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource41(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page41() {
  const [seed, setSeed] = useState(369);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer41, initialState41);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 41,
    segment: 'S' + ((41 % 5) + 1),
    window: 9,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource41(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset41(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState41(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute41(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 41);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-41">
      <div className="header-41">
        <div>
          <h2>Page41</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-41">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-41">
        <div className="sidebar-41">
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

        <div className="content-41">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-41">
          <Component401 seed={seed + 1} title={'Page41-Component401'} />
          <Component402 seed={seed + 2} title={'Page41-Component402'} />
          <Component403 seed={seed + 3} title={'Page41-Component403'} />
          <Component404 seed={seed + 4} title={'Page41-Component404'} />
          </div>
          <div className="component-grid-41">
          <Component405 seed={seed + 7} title={'Page41-Widget405'} />
          <Component406 seed={seed + 8} title={'Page41-Widget406'} />
          <Component407 seed={seed + 9} title={'Page41-Widget407'} />
          <Component408 seed={seed + 10} title={'Page41-Widget408'} />
          <Component409 seed={seed + 11} title={'Page41-Widget409'} />
          <Component410 seed={seed + 12} title={'Page41-Widget410'} />
          </div>
        </div>
      </div>
    </div>
  );
}
