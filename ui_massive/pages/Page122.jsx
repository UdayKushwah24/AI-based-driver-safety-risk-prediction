import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState122, heavyCompute122, transformDataset122 } from '../utils/compute122.js';
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
import '../styles/page122.css';

const initialState122 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer122(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource122(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page122() {
  const [seed, setSeed] = useState(1098);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer122, initialState122);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 122,
    segment: 'S' + ((122 % 5) + 1),
    window: 6,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource122(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset122(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState122(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute122(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 122);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-122">
      <div className="header-122">
        <div>
          <h2>Page122</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-122">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-122">
        <div className="sidebar-122">
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

        <div className="content-122">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-122">
          <Component111 seed={seed + 1} title={'Page122-Component111'} />
          <Component112 seed={seed + 2} title={'Page122-Component112'} />
          <Component113 seed={seed + 3} title={'Page122-Component113'} />
          <Component114 seed={seed + 4} title={'Page122-Component114'} />
          </div>
          <div className="component-grid-122">
          <Component115 seed={seed + 7} title={'Page122-Widget115'} />
          <Component116 seed={seed + 8} title={'Page122-Widget116'} />
          <Component117 seed={seed + 9} title={'Page122-Widget117'} />
          <Component118 seed={seed + 10} title={'Page122-Widget118'} />
          <Component119 seed={seed + 11} title={'Page122-Widget119'} />
          <Component120 seed={seed + 12} title={'Page122-Widget120'} />
          </div>
        </div>
      </div>
    </div>
  );
}
