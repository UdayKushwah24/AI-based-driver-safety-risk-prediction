import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState100, heavyCompute100, transformDataset100 } from '../utils/compute100.js';
import Component991 from '../components/Component991.jsx';
import Component992 from '../components/Component992.jsx';
import Component993 from '../components/Component993.jsx';
import Component994 from '../components/Component994.jsx';
import Component995 from '../components/Component995.jsx';
import Component996 from '../components/Component996.jsx';
import Component997 from '../components/Component997.jsx';
import Component998 from '../components/Component998.jsx';
import Component999 from '../components/Component999.jsx';
import Component1000 from '../components/Component1000.jsx';
import '../styles/page100.css';

const initialState100 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer100(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource100(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page100() {
  const [seed, setSeed] = useState(900);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer100, initialState100);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 100,
    segment: 'S' + ((100 % 5) + 1),
    window: 8,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource100(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset100(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState100(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute100(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 100);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-100">
      <div className="header-100">
        <div>
          <h2>Page100</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-100">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-100">
        <div className="sidebar-100">
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

        <div className="content-100">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-100">
          <Component991 seed={seed + 1} title={'Page100-Component991'} />
          <Component992 seed={seed + 2} title={'Page100-Component992'} />
          <Component993 seed={seed + 3} title={'Page100-Component993'} />
          <Component994 seed={seed + 4} title={'Page100-Component994'} />
          </div>
          <div className="component-grid-100">
          <Component995 seed={seed + 7} title={'Page100-Widget995'} />
          <Component996 seed={seed + 8} title={'Page100-Widget996'} />
          <Component997 seed={seed + 9} title={'Page100-Widget997'} />
          <Component998 seed={seed + 10} title={'Page100-Widget998'} />
          <Component999 seed={seed + 11} title={'Page100-Widget999'} />
          <Component1000 seed={seed + 12} title={'Page100-Widget1000'} />
          </div>
        </div>
      </div>
    </div>
  );
}
