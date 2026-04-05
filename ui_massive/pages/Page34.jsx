import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState34, heavyCompute34, transformDataset34 } from '../utils/compute34.js';
import Component331 from '../components/Component331.jsx';
import Component332 from '../components/Component332.jsx';
import Component333 from '../components/Component333.jsx';
import Component334 from '../components/Component334.jsx';
import Component335 from '../components/Component335.jsx';
import Component336 from '../components/Component336.jsx';
import Component337 from '../components/Component337.jsx';
import Component338 from '../components/Component338.jsx';
import Component339 from '../components/Component339.jsx';
import Component340 from '../components/Component340.jsx';
import '../styles/page34.css';

const initialState34 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer34(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource34(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page34() {
  const [seed, setSeed] = useState(306);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer34, initialState34);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 34,
    segment: 'S' + ((34 % 5) + 1),
    window: 8,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource34(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset34(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState34(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute34(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 34);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-34">
      <div className="header-34">
        <div>
          <h2>Page34</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-34">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-34">
        <div className="sidebar-34">
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

        <div className="content-34">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-34">
          <Component331 seed={seed + 1} title={'Page34-Component331'} />
          <Component332 seed={seed + 2} title={'Page34-Component332'} />
          <Component333 seed={seed + 3} title={'Page34-Component333'} />
          <Component334 seed={seed + 4} title={'Page34-Component334'} />
          </div>
          <div className="component-grid-34">
          <Component335 seed={seed + 7} title={'Page34-Widget335'} />
          <Component336 seed={seed + 8} title={'Page34-Widget336'} />
          <Component337 seed={seed + 9} title={'Page34-Widget337'} />
          <Component338 seed={seed + 10} title={'Page34-Widget338'} />
          <Component339 seed={seed + 11} title={'Page34-Widget339'} />
          <Component340 seed={seed + 12} title={'Page34-Widget340'} />
          </div>
        </div>
      </div>
    </div>
  );
}
