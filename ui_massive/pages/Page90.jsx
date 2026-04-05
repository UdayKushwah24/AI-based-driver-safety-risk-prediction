import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState90, heavyCompute90, transformDataset90 } from '../utils/compute90.js';
import Component891 from '../components/Component891.jsx';
import Component892 from '../components/Component892.jsx';
import Component893 from '../components/Component893.jsx';
import Component894 from '../components/Component894.jsx';
import Component895 from '../components/Component895.jsx';
import Component896 from '../components/Component896.jsx';
import Component897 from '../components/Component897.jsx';
import Component898 from '../components/Component898.jsx';
import Component899 from '../components/Component899.jsx';
import Component900 from '../components/Component900.jsx';
import '../styles/page90.css';

const initialState90 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer90(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource90(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page90() {
  const [seed, setSeed] = useState(810);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer90, initialState90);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 90,
    segment: 'S' + ((90 % 5) + 1),
    window: 4,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource90(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset90(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState90(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute90(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 90);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-90">
      <div className="header-90">
        <div>
          <h2>Page90</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-90">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-90">
        <div className="sidebar-90">
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

        <div className="content-90">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-90">
          <Component891 seed={seed + 1} title={'Page90-Component891'} />
          <Component892 seed={seed + 2} title={'Page90-Component892'} />
          <Component893 seed={seed + 3} title={'Page90-Component893'} />
          <Component894 seed={seed + 4} title={'Page90-Component894'} />
          </div>
          <div className="component-grid-90">
          <Component895 seed={seed + 7} title={'Page90-Widget895'} />
          <Component896 seed={seed + 8} title={'Page90-Widget896'} />
          <Component897 seed={seed + 9} title={'Page90-Widget897'} />
          <Component898 seed={seed + 10} title={'Page90-Widget898'} />
          <Component899 seed={seed + 11} title={'Page90-Widget899'} />
          <Component900 seed={seed + 12} title={'Page90-Widget900'} />
          </div>
        </div>
      </div>
    </div>
  );
}
