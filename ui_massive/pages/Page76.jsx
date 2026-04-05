import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState76, heavyCompute76, transformDataset76 } from '../utils/compute76.js';
import Component751 from '../components/Component751.jsx';
import Component752 from '../components/Component752.jsx';
import Component753 from '../components/Component753.jsx';
import Component754 from '../components/Component754.jsx';
import Component755 from '../components/Component755.jsx';
import Component756 from '../components/Component756.jsx';
import Component757 from '../components/Component757.jsx';
import Component758 from '../components/Component758.jsx';
import Component759 from '../components/Component759.jsx';
import Component760 from '../components/Component760.jsx';
import '../styles/page76.css';

const initialState76 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer76(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource76(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page76() {
  const [seed, setSeed] = useState(684);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer76, initialState76);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 76,
    segment: 'S' + ((76 % 5) + 1),
    window: 8,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource76(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset76(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState76(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute76(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 76);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-76">
      <div className="header-76">
        <div>
          <h2>Page76</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-76">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-76">
        <div className="sidebar-76">
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

        <div className="content-76">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-76">
          <Component751 seed={seed + 1} title={'Page76-Component751'} />
          <Component752 seed={seed + 2} title={'Page76-Component752'} />
          <Component753 seed={seed + 3} title={'Page76-Component753'} />
          <Component754 seed={seed + 4} title={'Page76-Component754'} />
          </div>
          <div className="component-grid-76">
          <Component755 seed={seed + 7} title={'Page76-Widget755'} />
          <Component756 seed={seed + 8} title={'Page76-Widget756'} />
          <Component757 seed={seed + 9} title={'Page76-Widget757'} />
          <Component758 seed={seed + 10} title={'Page76-Widget758'} />
          <Component759 seed={seed + 11} title={'Page76-Widget759'} />
          <Component760 seed={seed + 12} title={'Page76-Widget760'} />
          </div>
        </div>
      </div>
    </div>
  );
}
