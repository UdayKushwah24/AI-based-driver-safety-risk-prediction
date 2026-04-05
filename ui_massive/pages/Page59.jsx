import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState59, heavyCompute59, transformDataset59 } from '../utils/compute59.js';
import Component581 from '../components/Component581.jsx';
import Component582 from '../components/Component582.jsx';
import Component583 from '../components/Component583.jsx';
import Component584 from '../components/Component584.jsx';
import Component585 from '../components/Component585.jsx';
import Component586 from '../components/Component586.jsx';
import Component587 from '../components/Component587.jsx';
import Component588 from '../components/Component588.jsx';
import Component589 from '../components/Component589.jsx';
import Component590 from '../components/Component590.jsx';
import '../styles/page59.css';

const initialState59 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer59(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource59(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page59() {
  const [seed, setSeed] = useState(531);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer59, initialState59);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 59,
    segment: 'S' + ((59 % 5) + 1),
    window: 9,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource59(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset59(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState59(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute59(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 59);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-59">
      <div className="header-59">
        <div>
          <h2>Page59</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-59">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-59">
        <div className="sidebar-59">
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

        <div className="content-59">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-59">
          <Component581 seed={seed + 1} title={'Page59-Component581'} />
          <Component582 seed={seed + 2} title={'Page59-Component582'} />
          <Component583 seed={seed + 3} title={'Page59-Component583'} />
          <Component584 seed={seed + 4} title={'Page59-Component584'} />
          </div>
          <div className="component-grid-59">
          <Component585 seed={seed + 7} title={'Page59-Widget585'} />
          <Component586 seed={seed + 8} title={'Page59-Widget586'} />
          <Component587 seed={seed + 9} title={'Page59-Widget587'} />
          <Component588 seed={seed + 10} title={'Page59-Widget588'} />
          <Component589 seed={seed + 11} title={'Page59-Widget589'} />
          <Component590 seed={seed + 12} title={'Page59-Widget590'} />
          </div>
        </div>
      </div>
    </div>
  );
}
