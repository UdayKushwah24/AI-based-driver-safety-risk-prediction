import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState111, heavyCompute111, transformDataset111 } from '../utils/compute111.js';
import Component1 from '../components/Component1.jsx';
import Component2 from '../components/Component2.jsx';
import Component3 from '../components/Component3.jsx';
import Component4 from '../components/Component4.jsx';
import Component5 from '../components/Component5.jsx';
import Component6 from '../components/Component6.jsx';
import Component7 from '../components/Component7.jsx';
import Component8 from '../components/Component8.jsx';
import Component9 from '../components/Component9.jsx';
import Component10 from '../components/Component10.jsx';
import '../styles/page111.css';

const initialState111 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer111(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource111(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page111() {
  const [seed, setSeed] = useState(999);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer111, initialState111);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 111,
    segment: 'S' + ((111 % 5) + 1),
    window: 7,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource111(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset111(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState111(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute111(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 111);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-111">
      <div className="header-111">
        <div>
          <h2>Page111</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-111">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-111">
        <div className="sidebar-111">
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

        <div className="content-111">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-111">
          <Component1 seed={seed + 1} title={'Page111-Component1'} />
          <Component2 seed={seed + 2} title={'Page111-Component2'} />
          <Component3 seed={seed + 3} title={'Page111-Component3'} />
          <Component4 seed={seed + 4} title={'Page111-Component4'} />
          </div>
          <div className="component-grid-111">
          <Component5 seed={seed + 7} title={'Page111-Widget5'} />
          <Component6 seed={seed + 8} title={'Page111-Widget6'} />
          <Component7 seed={seed + 9} title={'Page111-Widget7'} />
          <Component8 seed={seed + 10} title={'Page111-Widget8'} />
          <Component9 seed={seed + 11} title={'Page111-Widget9'} />
          <Component10 seed={seed + 12} title={'Page111-Widget10'} />
          </div>
        </div>
      </div>
    </div>
  );
}
