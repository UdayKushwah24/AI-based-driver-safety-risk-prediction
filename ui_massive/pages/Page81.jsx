import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState81, heavyCompute81, transformDataset81 } from '../utils/compute81.js';
import Component801 from '../components/Component801.jsx';
import Component802 from '../components/Component802.jsx';
import Component803 from '../components/Component803.jsx';
import Component804 from '../components/Component804.jsx';
import Component805 from '../components/Component805.jsx';
import Component806 from '../components/Component806.jsx';
import Component807 from '../components/Component807.jsx';
import Component808 from '../components/Component808.jsx';
import Component809 from '../components/Component809.jsx';
import Component810 from '../components/Component810.jsx';
import '../styles/page81.css';

const initialState81 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer81(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource81(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page81() {
  const [seed, setSeed] = useState(729);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer81, initialState81);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 81,
    segment: 'S' + ((81 % 5) + 1),
    window: 7,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource81(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset81(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState81(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute81(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 81);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-81">
      <div className="header-81">
        <div>
          <h2>Page81</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-81">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-81">
        <div className="sidebar-81">
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

        <div className="content-81">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-81">
          <Component801 seed={seed + 1} title={'Page81-Component801'} />
          <Component802 seed={seed + 2} title={'Page81-Component802'} />
          <Component803 seed={seed + 3} title={'Page81-Component803'} />
          <Component804 seed={seed + 4} title={'Page81-Component804'} />
          </div>
          <div className="component-grid-81">
          <Component805 seed={seed + 7} title={'Page81-Widget805'} />
          <Component806 seed={seed + 8} title={'Page81-Widget806'} />
          <Component807 seed={seed + 9} title={'Page81-Widget807'} />
          <Component808 seed={seed + 10} title={'Page81-Widget808'} />
          <Component809 seed={seed + 11} title={'Page81-Widget809'} />
          <Component810 seed={seed + 12} title={'Page81-Widget810'} />
          </div>
        </div>
      </div>
    </div>
  );
}
