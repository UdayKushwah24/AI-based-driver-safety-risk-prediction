import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState12, heavyCompute12, transformDataset12 } from '../utils/compute12.js';
import Component111 from '../components/Component111.jsx';
import Component112 from '../components/Component112.jsx';
import Component113 from '../components/Component113.jsx';
import Component114 from '../components/Component114.jsx';
import Component115 from '../components/Component115.jsx';
import Component116 from '../components/Component116.jsx';
import Component117 from '../components/Component117.jsx';
import Component118 from '../components/Component118.jsx';
import Component119 from '../components/Component119.jsx';
import Component120 from '../components/Component120.jsx';
import '../styles/page12.css';

const initialState12 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer12(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource12(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page12() {
  const [seed, setSeed] = useState(108);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer12, initialState12);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 12,
    segment: 'S' + ((12 % 5) + 1),
    window: 4,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource12(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset12(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState12(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute12(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 12);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-12">
      <div className="header-12">
        <div>
          <h2>Page12</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-12">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-12">
        <div className="sidebar-12">
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

        <div className="content-12">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-12">
          <Component111 seed={seed + 1} title={'Page12-Component111'} />
          <Component112 seed={seed + 2} title={'Page12-Component112'} />
          <Component113 seed={seed + 3} title={'Page12-Component113'} />
          <Component114 seed={seed + 4} title={'Page12-Component114'} />
          </div>
          <div className="component-grid-12">
          <Component115 seed={seed + 7} title={'Page12-Widget115'} />
          <Component116 seed={seed + 8} title={'Page12-Widget116'} />
          <Component117 seed={seed + 9} title={'Page12-Widget117'} />
          <Component118 seed={seed + 10} title={'Page12-Widget118'} />
          <Component119 seed={seed + 11} title={'Page12-Widget119'} />
          <Component120 seed={seed + 12} title={'Page12-Widget120'} />
          </div>
        </div>
      </div>
    </div>
  );
}
