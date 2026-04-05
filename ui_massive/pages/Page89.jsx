import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState89, heavyCompute89, transformDataset89 } from '../utils/compute89.js';
import Component881 from '../components/Component881.jsx';
import Component882 from '../components/Component882.jsx';
import Component883 from '../components/Component883.jsx';
import Component884 from '../components/Component884.jsx';
import Component885 from '../components/Component885.jsx';
import Component886 from '../components/Component886.jsx';
import Component887 from '../components/Component887.jsx';
import Component888 from '../components/Component888.jsx';
import Component889 from '../components/Component889.jsx';
import Component890 from '../components/Component890.jsx';
import '../styles/page89.css';

const initialState89 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer89(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource89(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page89() {
  const [seed, setSeed] = useState(801);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer89, initialState89);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 89,
    segment: 'S' + ((89 % 5) + 1),
    window: 9,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource89(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset89(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState89(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute89(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 89);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-89">
      <div className="header-89">
        <div>
          <h2>Page89</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-89">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-89">
        <div className="sidebar-89">
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

        <div className="content-89">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-89">
          <Component881 seed={seed + 1} title={'Page89-Component881'} />
          <Component882 seed={seed + 2} title={'Page89-Component882'} />
          <Component883 seed={seed + 3} title={'Page89-Component883'} />
          <Component884 seed={seed + 4} title={'Page89-Component884'} />
          </div>
          <div className="component-grid-89">
          <Component885 seed={seed + 7} title={'Page89-Widget885'} />
          <Component886 seed={seed + 8} title={'Page89-Widget886'} />
          <Component887 seed={seed + 9} title={'Page89-Widget887'} />
          <Component888 seed={seed + 10} title={'Page89-Widget888'} />
          <Component889 seed={seed + 11} title={'Page89-Widget889'} />
          <Component890 seed={seed + 12} title={'Page89-Widget890'} />
          </div>
        </div>
      </div>
    </div>
  );
}
