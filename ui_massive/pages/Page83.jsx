import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState83, heavyCompute83, transformDataset83 } from '../utils/compute83.js';
import Component821 from '../components/Component821.jsx';
import Component822 from '../components/Component822.jsx';
import Component823 from '../components/Component823.jsx';
import Component824 from '../components/Component824.jsx';
import Component825 from '../components/Component825.jsx';
import Component826 from '../components/Component826.jsx';
import Component827 from '../components/Component827.jsx';
import Component828 from '../components/Component828.jsx';
import Component829 from '../components/Component829.jsx';
import Component830 from '../components/Component830.jsx';
import '../styles/page83.css';

const initialState83 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer83(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource83(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page83() {
  const [seed, setSeed] = useState(747);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer83, initialState83);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 83,
    segment: 'S' + ((83 % 5) + 1),
    window: 9,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource83(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset83(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState83(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute83(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 83);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-83">
      <div className="header-83">
        <div>
          <h2>Page83</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-83">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-83">
        <div className="sidebar-83">
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

        <div className="content-83">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-83">
          <Component821 seed={seed + 1} title={'Page83-Component821'} />
          <Component822 seed={seed + 2} title={'Page83-Component822'} />
          <Component823 seed={seed + 3} title={'Page83-Component823'} />
          <Component824 seed={seed + 4} title={'Page83-Component824'} />
          </div>
          <div className="component-grid-83">
          <Component825 seed={seed + 7} title={'Page83-Widget825'} />
          <Component826 seed={seed + 8} title={'Page83-Widget826'} />
          <Component827 seed={seed + 9} title={'Page83-Widget827'} />
          <Component828 seed={seed + 10} title={'Page83-Widget828'} />
          <Component829 seed={seed + 11} title={'Page83-Widget829'} />
          <Component830 seed={seed + 12} title={'Page83-Widget830'} />
          </div>
        </div>
      </div>
    </div>
  );
}
