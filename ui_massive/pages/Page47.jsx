import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState47, heavyCompute47, transformDataset47 } from '../utils/compute47.js';
import Component461 from '../components/Component461.jsx';
import Component462 from '../components/Component462.jsx';
import Component463 from '../components/Component463.jsx';
import Component464 from '../components/Component464.jsx';
import Component465 from '../components/Component465.jsx';
import Component466 from '../components/Component466.jsx';
import Component467 from '../components/Component467.jsx';
import Component468 from '../components/Component468.jsx';
import Component469 from '../components/Component469.jsx';
import Component470 from '../components/Component470.jsx';
import '../styles/page47.css';

const initialState47 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer47(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource47(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page47() {
  const [seed, setSeed] = useState(423);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer47, initialState47);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 47,
    segment: 'S' + ((47 % 5) + 1),
    window: 9,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource47(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset47(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState47(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute47(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 47);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-47">
      <div className="header-47">
        <div>
          <h2>Page47</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-47">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-47">
        <div className="sidebar-47">
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

        <div className="content-47">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-47">
          <Component461 seed={seed + 1} title={'Page47-Component461'} />
          <Component462 seed={seed + 2} title={'Page47-Component462'} />
          <Component463 seed={seed + 3} title={'Page47-Component463'} />
          <Component464 seed={seed + 4} title={'Page47-Component464'} />
          </div>
          <div className="component-grid-47">
          <Component465 seed={seed + 7} title={'Page47-Widget465'} />
          <Component466 seed={seed + 8} title={'Page47-Widget466'} />
          <Component467 seed={seed + 9} title={'Page47-Widget467'} />
          <Component468 seed={seed + 10} title={'Page47-Widget468'} />
          <Component469 seed={seed + 11} title={'Page47-Widget469'} />
          <Component470 seed={seed + 12} title={'Page47-Widget470'} />
          </div>
        </div>
      </div>
    </div>
  );
}
