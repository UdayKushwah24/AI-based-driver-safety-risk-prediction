import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState43, heavyCompute43, transformDataset43 } from '../utils/compute43.js';
import Component421 from '../components/Component421.jsx';
import Component422 from '../components/Component422.jsx';
import Component423 from '../components/Component423.jsx';
import Component424 from '../components/Component424.jsx';
import Component425 from '../components/Component425.jsx';
import Component426 from '../components/Component426.jsx';
import Component427 from '../components/Component427.jsx';
import Component428 from '../components/Component428.jsx';
import Component429 from '../components/Component429.jsx';
import Component430 from '../components/Component430.jsx';
import '../styles/page43.css';

const initialState43 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer43(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource43(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page43() {
  const [seed, setSeed] = useState(387);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer43, initialState43);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 43,
    segment: 'S' + ((43 % 5) + 1),
    window: 5,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource43(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset43(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState43(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute43(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 43);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-43">
      <div className="header-43">
        <div>
          <h2>Page43</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-43">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-43">
        <div className="sidebar-43">
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

        <div className="content-43">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-43">
          <Component421 seed={seed + 1} title={'Page43-Component421'} />
          <Component422 seed={seed + 2} title={'Page43-Component422'} />
          <Component423 seed={seed + 3} title={'Page43-Component423'} />
          <Component424 seed={seed + 4} title={'Page43-Component424'} />
          </div>
          <div className="component-grid-43">
          <Component425 seed={seed + 7} title={'Page43-Widget425'} />
          <Component426 seed={seed + 8} title={'Page43-Widget426'} />
          <Component427 seed={seed + 9} title={'Page43-Widget427'} />
          <Component428 seed={seed + 10} title={'Page43-Widget428'} />
          <Component429 seed={seed + 11} title={'Page43-Widget429'} />
          <Component430 seed={seed + 12} title={'Page43-Widget430'} />
          </div>
        </div>
      </div>
    </div>
  );
}
