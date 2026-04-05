import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState57, heavyCompute57, transformDataset57 } from '../utils/compute57.js';
import Component561 from '../components/Component561.jsx';
import Component562 from '../components/Component562.jsx';
import Component563 from '../components/Component563.jsx';
import Component564 from '../components/Component564.jsx';
import Component565 from '../components/Component565.jsx';
import Component566 from '../components/Component566.jsx';
import Component567 from '../components/Component567.jsx';
import Component568 from '../components/Component568.jsx';
import Component569 from '../components/Component569.jsx';
import Component570 from '../components/Component570.jsx';
import '../styles/page57.css';

const initialState57 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer57(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource57(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page57() {
  const [seed, setSeed] = useState(513);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer57, initialState57);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 57,
    segment: 'S' + ((57 % 5) + 1),
    window: 7,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource57(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset57(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState57(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute57(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 57);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-57">
      <div className="header-57">
        <div>
          <h2>Page57</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-57">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-57">
        <div className="sidebar-57">
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

        <div className="content-57">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-57">
          <Component561 seed={seed + 1} title={'Page57-Component561'} />
          <Component562 seed={seed + 2} title={'Page57-Component562'} />
          <Component563 seed={seed + 3} title={'Page57-Component563'} />
          <Component564 seed={seed + 4} title={'Page57-Component564'} />
          </div>
          <div className="component-grid-57">
          <Component565 seed={seed + 7} title={'Page57-Widget565'} />
          <Component566 seed={seed + 8} title={'Page57-Widget566'} />
          <Component567 seed={seed + 9} title={'Page57-Widget567'} />
          <Component568 seed={seed + 10} title={'Page57-Widget568'} />
          <Component569 seed={seed + 11} title={'Page57-Widget569'} />
          <Component570 seed={seed + 12} title={'Page57-Widget570'} />
          </div>
        </div>
      </div>
    </div>
  );
}
