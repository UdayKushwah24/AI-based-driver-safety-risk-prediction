import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState67, heavyCompute67, transformDataset67 } from '../utils/compute67.js';
import Component661 from '../components/Component661.jsx';
import Component662 from '../components/Component662.jsx';
import Component663 from '../components/Component663.jsx';
import Component664 from '../components/Component664.jsx';
import Component665 from '../components/Component665.jsx';
import Component666 from '../components/Component666.jsx';
import Component667 from '../components/Component667.jsx';
import Component668 from '../components/Component668.jsx';
import Component669 from '../components/Component669.jsx';
import Component670 from '../components/Component670.jsx';
import '../styles/page67.css';

const initialState67 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer67(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource67(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page67() {
  const [seed, setSeed] = useState(603);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer67, initialState67);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 67,
    segment: 'S' + ((67 % 5) + 1),
    window: 5,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource67(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset67(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState67(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute67(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 67);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-67">
      <div className="header-67">
        <div>
          <h2>Page67</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-67">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-67">
        <div className="sidebar-67">
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

        <div className="content-67">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-67">
          <Component661 seed={seed + 1} title={'Page67-Component661'} />
          <Component662 seed={seed + 2} title={'Page67-Component662'} />
          <Component663 seed={seed + 3} title={'Page67-Component663'} />
          <Component664 seed={seed + 4} title={'Page67-Component664'} />
          </div>
          <div className="component-grid-67">
          <Component665 seed={seed + 7} title={'Page67-Widget665'} />
          <Component666 seed={seed + 8} title={'Page67-Widget666'} />
          <Component667 seed={seed + 9} title={'Page67-Widget667'} />
          <Component668 seed={seed + 10} title={'Page67-Widget668'} />
          <Component669 seed={seed + 11} title={'Page67-Widget669'} />
          <Component670 seed={seed + 12} title={'Page67-Widget670'} />
          </div>
        </div>
      </div>
    </div>
  );
}
