import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState46, heavyCompute46, transformDataset46 } from '../utils/compute46.js';
import Component451 from '../components/Component451.jsx';
import Component452 from '../components/Component452.jsx';
import Component453 from '../components/Component453.jsx';
import Component454 from '../components/Component454.jsx';
import Component455 from '../components/Component455.jsx';
import Component456 from '../components/Component456.jsx';
import Component457 from '../components/Component457.jsx';
import Component458 from '../components/Component458.jsx';
import Component459 from '../components/Component459.jsx';
import Component460 from '../components/Component460.jsx';
import '../styles/page46.css';

const initialState46 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer46(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource46(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page46() {
  const [seed, setSeed] = useState(414);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer46, initialState46);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 46,
    segment: 'S' + ((46 % 5) + 1),
    window: 8,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource46(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset46(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState46(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute46(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 46);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-46">
      <div className="header-46">
        <div>
          <h2>Page46</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-46">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-46">
        <div className="sidebar-46">
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

        <div className="content-46">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-46">
          <Component451 seed={seed + 1} title={'Page46-Component451'} />
          <Component452 seed={seed + 2} title={'Page46-Component452'} />
          <Component453 seed={seed + 3} title={'Page46-Component453'} />
          <Component454 seed={seed + 4} title={'Page46-Component454'} />
          </div>
          <div className="component-grid-46">
          <Component455 seed={seed + 7} title={'Page46-Widget455'} />
          <Component456 seed={seed + 8} title={'Page46-Widget456'} />
          <Component457 seed={seed + 9} title={'Page46-Widget457'} />
          <Component458 seed={seed + 10} title={'Page46-Widget458'} />
          <Component459 seed={seed + 11} title={'Page46-Widget459'} />
          <Component460 seed={seed + 12} title={'Page46-Widget460'} />
          </div>
        </div>
      </div>
    </div>
  );
}
