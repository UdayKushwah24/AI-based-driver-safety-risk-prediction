import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState56, heavyCompute56, transformDataset56 } from '../utils/compute56.js';
import Component551 from '../components/Component551.jsx';
import Component552 from '../components/Component552.jsx';
import Component553 from '../components/Component553.jsx';
import Component554 from '../components/Component554.jsx';
import Component555 from '../components/Component555.jsx';
import Component556 from '../components/Component556.jsx';
import Component557 from '../components/Component557.jsx';
import Component558 from '../components/Component558.jsx';
import Component559 from '../components/Component559.jsx';
import Component560 from '../components/Component560.jsx';
import '../styles/page56.css';

const initialState56 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer56(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource56(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page56() {
  const [seed, setSeed] = useState(504);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer56, initialState56);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 56,
    segment: 'S' + ((56 % 5) + 1),
    window: 6,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource56(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset56(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState56(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute56(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 56);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-56">
      <div className="header-56">
        <div>
          <h2>Page56</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-56">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-56">
        <div className="sidebar-56">
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

        <div className="content-56">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-56">
          <Component551 seed={seed + 1} title={'Page56-Component551'} />
          <Component552 seed={seed + 2} title={'Page56-Component552'} />
          <Component553 seed={seed + 3} title={'Page56-Component553'} />
          <Component554 seed={seed + 4} title={'Page56-Component554'} />
          </div>
          <div className="component-grid-56">
          <Component555 seed={seed + 7} title={'Page56-Widget555'} />
          <Component556 seed={seed + 8} title={'Page56-Widget556'} />
          <Component557 seed={seed + 9} title={'Page56-Widget557'} />
          <Component558 seed={seed + 10} title={'Page56-Widget558'} />
          <Component559 seed={seed + 11} title={'Page56-Widget559'} />
          <Component560 seed={seed + 12} title={'Page56-Widget560'} />
          </div>
        </div>
      </div>
    </div>
  );
}
