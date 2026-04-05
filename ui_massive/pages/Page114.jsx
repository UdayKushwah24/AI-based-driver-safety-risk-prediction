import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState114, heavyCompute114, transformDataset114 } from '../utils/compute114.js';
import Component31 from '../components/Component31.jsx';
import Component32 from '../components/Component32.jsx';
import Component33 from '../components/Component33.jsx';
import Component34 from '../components/Component34.jsx';
import Component35 from '../components/Component35.jsx';
import Component36 from '../components/Component36.jsx';
import Component37 from '../components/Component37.jsx';
import Component38 from '../components/Component38.jsx';
import Component39 from '../components/Component39.jsx';
import Component40 from '../components/Component40.jsx';
import '../styles/page114.css';

const initialState114 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer114(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource114(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page114() {
  const [seed, setSeed] = useState(1026);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer114, initialState114);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 114,
    segment: 'S' + ((114 % 5) + 1),
    window: 4,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource114(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset114(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState114(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute114(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 114);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-114">
      <div className="header-114">
        <div>
          <h2>Page114</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-114">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-114">
        <div className="sidebar-114">
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

        <div className="content-114">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-114">
          <Component31 seed={seed + 1} title={'Page114-Component31'} />
          <Component32 seed={seed + 2} title={'Page114-Component32'} />
          <Component33 seed={seed + 3} title={'Page114-Component33'} />
          <Component34 seed={seed + 4} title={'Page114-Component34'} />
          </div>
          <div className="component-grid-114">
          <Component35 seed={seed + 7} title={'Page114-Widget35'} />
          <Component36 seed={seed + 8} title={'Page114-Widget36'} />
          <Component37 seed={seed + 9} title={'Page114-Widget37'} />
          <Component38 seed={seed + 10} title={'Page114-Widget38'} />
          <Component39 seed={seed + 11} title={'Page114-Widget39'} />
          <Component40 seed={seed + 12} title={'Page114-Widget40'} />
          </div>
        </div>
      </div>
    </div>
  );
}
