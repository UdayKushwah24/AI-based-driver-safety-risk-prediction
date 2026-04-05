import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState103, heavyCompute103, transformDataset103 } from '../utils/compute103.js';
import Component1021 from '../components/Component1021.jsx';
import Component1022 from '../components/Component1022.jsx';
import Component1023 from '../components/Component1023.jsx';
import Component1024 from '../components/Component1024.jsx';
import Component1025 from '../components/Component1025.jsx';
import Component1026 from '../components/Component1026.jsx';
import Component1027 from '../components/Component1027.jsx';
import Component1028 from '../components/Component1028.jsx';
import Component1029 from '../components/Component1029.jsx';
import Component1030 from '../components/Component1030.jsx';
import '../styles/page103.css';

const initialState103 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer103(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource103(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page103() {
  const [seed, setSeed] = useState(927);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer103, initialState103);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 103,
    segment: 'S' + ((103 % 5) + 1),
    window: 5,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource103(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset103(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState103(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute103(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 103);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-103">
      <div className="header-103">
        <div>
          <h2>Page103</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-103">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-103">
        <div className="sidebar-103">
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

        <div className="content-103">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-103">
          <Component1021 seed={seed + 1} title={'Page103-Component1021'} />
          <Component1022 seed={seed + 2} title={'Page103-Component1022'} />
          <Component1023 seed={seed + 3} title={'Page103-Component1023'} />
          <Component1024 seed={seed + 4} title={'Page103-Component1024'} />
          </div>
          <div className="component-grid-103">
          <Component1025 seed={seed + 7} title={'Page103-Widget1025'} />
          <Component1026 seed={seed + 8} title={'Page103-Widget1026'} />
          <Component1027 seed={seed + 9} title={'Page103-Widget1027'} />
          <Component1028 seed={seed + 10} title={'Page103-Widget1028'} />
          <Component1029 seed={seed + 11} title={'Page103-Widget1029'} />
          <Component1030 seed={seed + 12} title={'Page103-Widget1030'} />
          </div>
        </div>
      </div>
    </div>
  );
}
