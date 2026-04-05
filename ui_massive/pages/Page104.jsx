import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState104, heavyCompute104, transformDataset104 } from '../utils/compute104.js';
import Component1031 from '../components/Component1031.jsx';
import Component1032 from '../components/Component1032.jsx';
import Component1033 from '../components/Component1033.jsx';
import Component1034 from '../components/Component1034.jsx';
import Component1035 from '../components/Component1035.jsx';
import Component1036 from '../components/Component1036.jsx';
import Component1037 from '../components/Component1037.jsx';
import Component1038 from '../components/Component1038.jsx';
import Component1039 from '../components/Component1039.jsx';
import Component1040 from '../components/Component1040.jsx';
import '../styles/page104.css';

const initialState104 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer104(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource104(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page104() {
  const [seed, setSeed] = useState(936);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer104, initialState104);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 104,
    segment: 'S' + ((104 % 5) + 1),
    window: 6,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource104(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset104(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState104(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute104(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 104);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-104">
      <div className="header-104">
        <div>
          <h2>Page104</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-104">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-104">
        <div className="sidebar-104">
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

        <div className="content-104">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-104">
          <Component1031 seed={seed + 1} title={'Page104-Component1031'} />
          <Component1032 seed={seed + 2} title={'Page104-Component1032'} />
          <Component1033 seed={seed + 3} title={'Page104-Component1033'} />
          <Component1034 seed={seed + 4} title={'Page104-Component1034'} />
          </div>
          <div className="component-grid-104">
          <Component1035 seed={seed + 7} title={'Page104-Widget1035'} />
          <Component1036 seed={seed + 8} title={'Page104-Widget1036'} />
          <Component1037 seed={seed + 9} title={'Page104-Widget1037'} />
          <Component1038 seed={seed + 10} title={'Page104-Widget1038'} />
          <Component1039 seed={seed + 11} title={'Page104-Widget1039'} />
          <Component1040 seed={seed + 12} title={'Page104-Widget1040'} />
          </div>
        </div>
      </div>
    </div>
  );
}
