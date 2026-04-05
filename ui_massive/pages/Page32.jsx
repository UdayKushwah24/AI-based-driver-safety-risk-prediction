import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState32, heavyCompute32, transformDataset32 } from '../utils/compute32.js';
import Component311 from '../components/Component311.jsx';
import Component312 from '../components/Component312.jsx';
import Component313 from '../components/Component313.jsx';
import Component314 from '../components/Component314.jsx';
import Component315 from '../components/Component315.jsx';
import Component316 from '../components/Component316.jsx';
import Component317 from '../components/Component317.jsx';
import Component318 from '../components/Component318.jsx';
import Component319 from '../components/Component319.jsx';
import Component320 from '../components/Component320.jsx';
import '../styles/page32.css';

const initialState32 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer32(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource32(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page32() {
  const [seed, setSeed] = useState(288);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer32, initialState32);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 32,
    segment: 'S' + ((32 % 5) + 1),
    window: 6,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource32(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset32(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState32(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute32(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 32);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-32">
      <div className="header-32">
        <div>
          <h2>Page32</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-32">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-32">
        <div className="sidebar-32">
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

        <div className="content-32">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-32">
          <Component311 seed={seed + 1} title={'Page32-Component311'} />
          <Component312 seed={seed + 2} title={'Page32-Component312'} />
          <Component313 seed={seed + 3} title={'Page32-Component313'} />
          <Component314 seed={seed + 4} title={'Page32-Component314'} />
          </div>
          <div className="component-grid-32">
          <Component315 seed={seed + 7} title={'Page32-Widget315'} />
          <Component316 seed={seed + 8} title={'Page32-Widget316'} />
          <Component317 seed={seed + 9} title={'Page32-Widget317'} />
          <Component318 seed={seed + 10} title={'Page32-Widget318'} />
          <Component319 seed={seed + 11} title={'Page32-Widget319'} />
          <Component320 seed={seed + 12} title={'Page32-Widget320'} />
          </div>
        </div>
      </div>
    </div>
  );
}
