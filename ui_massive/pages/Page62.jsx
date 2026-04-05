import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState62, heavyCompute62, transformDataset62 } from '../utils/compute62.js';
import Component611 from '../components/Component611.jsx';
import Component612 from '../components/Component612.jsx';
import Component613 from '../components/Component613.jsx';
import Component614 from '../components/Component614.jsx';
import Component615 from '../components/Component615.jsx';
import Component616 from '../components/Component616.jsx';
import Component617 from '../components/Component617.jsx';
import Component618 from '../components/Component618.jsx';
import Component619 from '../components/Component619.jsx';
import Component620 from '../components/Component620.jsx';
import '../styles/page62.css';

const initialState62 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer62(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource62(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page62() {
  const [seed, setSeed] = useState(558);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer62, initialState62);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 62,
    segment: 'S' + ((62 % 5) + 1),
    window: 6,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource62(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset62(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState62(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute62(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 62);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-62">
      <div className="header-62">
        <div>
          <h2>Page62</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-62">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-62">
        <div className="sidebar-62">
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

        <div className="content-62">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-62">
          <Component611 seed={seed + 1} title={'Page62-Component611'} />
          <Component612 seed={seed + 2} title={'Page62-Component612'} />
          <Component613 seed={seed + 3} title={'Page62-Component613'} />
          <Component614 seed={seed + 4} title={'Page62-Component614'} />
          </div>
          <div className="component-grid-62">
          <Component615 seed={seed + 7} title={'Page62-Widget615'} />
          <Component616 seed={seed + 8} title={'Page62-Widget616'} />
          <Component617 seed={seed + 9} title={'Page62-Widget617'} />
          <Component618 seed={seed + 10} title={'Page62-Widget618'} />
          <Component619 seed={seed + 11} title={'Page62-Widget619'} />
          <Component620 seed={seed + 12} title={'Page62-Widget620'} />
          </div>
        </div>
      </div>
    </div>
  );
}
