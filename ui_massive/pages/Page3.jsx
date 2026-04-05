import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState3, heavyCompute3, transformDataset3 } from '../utils/compute3.js';
import Component21 from '../components/Component21.jsx';
import Component22 from '../components/Component22.jsx';
import Component23 from '../components/Component23.jsx';
import Component24 from '../components/Component24.jsx';
import Component25 from '../components/Component25.jsx';
import Component26 from '../components/Component26.jsx';
import Component27 from '../components/Component27.jsx';
import Component28 from '../components/Component28.jsx';
import Component29 from '../components/Component29.jsx';
import Component30 from '../components/Component30.jsx';
import '../styles/page3.css';

const initialState3 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer3(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource3(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page3() {
  const [seed, setSeed] = useState(27);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer3, initialState3);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 3,
    segment: 'S' + ((3 % 5) + 1),
    window: 7,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource3(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset3(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState3(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute3(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 3);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-3">
      <div className="header-3">
        <div>
          <h2>Page3</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-3">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-3">
        <div className="sidebar-3">
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

        <div className="content-3">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-3">
          <Component21 seed={seed + 1} title={'Page3-Component21'} />
          <Component22 seed={seed + 2} title={'Page3-Component22'} />
          <Component23 seed={seed + 3} title={'Page3-Component23'} />
          <Component24 seed={seed + 4} title={'Page3-Component24'} />
          </div>
          <div className="component-grid-3">
          <Component25 seed={seed + 7} title={'Page3-Widget25'} />
          <Component26 seed={seed + 8} title={'Page3-Widget26'} />
          <Component27 seed={seed + 9} title={'Page3-Widget27'} />
          <Component28 seed={seed + 10} title={'Page3-Widget28'} />
          <Component29 seed={seed + 11} title={'Page3-Widget29'} />
          <Component30 seed={seed + 12} title={'Page3-Widget30'} />
          </div>
        </div>
      </div>
    </div>
  );
}
