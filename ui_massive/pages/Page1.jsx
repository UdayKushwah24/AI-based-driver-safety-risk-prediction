import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState1, heavyCompute1, transformDataset1 } from '../utils/compute1.js';
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
import '../styles/page1.css';

const initialState1 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer1(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource1(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page1() {
  const [seed, setSeed] = useState(9);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer1, initialState1);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 1,
    segment: 'S' + ((1 % 5) + 1),
    window: 5,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource1(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset1(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState1(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute1(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 1);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-1">
      <div className="header-1">
        <div>
          <h2>Page1</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-1">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-1">
        <div className="sidebar-1">
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

        <div className="content-1">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-1">
          <Component1 seed={seed + 1} title={'Page1-Component1'} />
          <Component2 seed={seed + 2} title={'Page1-Component2'} />
          <Component3 seed={seed + 3} title={'Page1-Component3'} />
          <Component4 seed={seed + 4} title={'Page1-Component4'} />
          </div>
          <div className="component-grid-1">
          <Component5 seed={seed + 7} title={'Page1-Widget5'} />
          <Component6 seed={seed + 8} title={'Page1-Widget6'} />
          <Component7 seed={seed + 9} title={'Page1-Widget7'} />
          <Component8 seed={seed + 10} title={'Page1-Widget8'} />
          <Component9 seed={seed + 11} title={'Page1-Widget9'} />
          <Component10 seed={seed + 12} title={'Page1-Widget10'} />
          </div>
        </div>
      </div>
    </div>
  );
}
