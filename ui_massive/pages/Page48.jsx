import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState48, heavyCompute48, transformDataset48 } from '../utils/compute48.js';
import Component471 from '../components/Component471.jsx';
import Component472 from '../components/Component472.jsx';
import Component473 from '../components/Component473.jsx';
import Component474 from '../components/Component474.jsx';
import Component475 from '../components/Component475.jsx';
import Component476 from '../components/Component476.jsx';
import Component477 from '../components/Component477.jsx';
import Component478 from '../components/Component478.jsx';
import Component479 from '../components/Component479.jsx';
import Component480 from '../components/Component480.jsx';
import '../styles/page48.css';

const initialState48 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer48(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource48(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page48() {
  const [seed, setSeed] = useState(432);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer48, initialState48);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 48,
    segment: 'S' + ((48 % 5) + 1),
    window: 4,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource48(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset48(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState48(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute48(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 48);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-48">
      <div className="header-48">
        <div>
          <h2>Page48</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-48">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-48">
        <div className="sidebar-48">
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

        <div className="content-48">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-48">
          <Component471 seed={seed + 1} title={'Page48-Component471'} />
          <Component472 seed={seed + 2} title={'Page48-Component472'} />
          <Component473 seed={seed + 3} title={'Page48-Component473'} />
          <Component474 seed={seed + 4} title={'Page48-Component474'} />
          </div>
          <div className="component-grid-48">
          <Component475 seed={seed + 7} title={'Page48-Widget475'} />
          <Component476 seed={seed + 8} title={'Page48-Widget476'} />
          <Component477 seed={seed + 9} title={'Page48-Widget477'} />
          <Component478 seed={seed + 10} title={'Page48-Widget478'} />
          <Component479 seed={seed + 11} title={'Page48-Widget479'} />
          <Component480 seed={seed + 12} title={'Page48-Widget480'} />
          </div>
        </div>
      </div>
    </div>
  );
}
