import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState9, heavyCompute9, transformDataset9 } from '../utils/compute9.js';
import Component81 from '../components/Component81.jsx';
import Component82 from '../components/Component82.jsx';
import Component83 from '../components/Component83.jsx';
import Component84 from '../components/Component84.jsx';
import Component85 from '../components/Component85.jsx';
import Component86 from '../components/Component86.jsx';
import Component87 from '../components/Component87.jsx';
import Component88 from '../components/Component88.jsx';
import Component89 from '../components/Component89.jsx';
import Component90 from '../components/Component90.jsx';
import '../styles/page9.css';

const initialState9 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer9(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource9(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page9() {
  const [seed, setSeed] = useState(81);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer9, initialState9);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 9,
    segment: 'S' + ((9 % 5) + 1),
    window: 7,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource9(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset9(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState9(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute9(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 9);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-9">
      <div className="header-9">
        <div>
          <h2>Page9</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-9">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-9">
        <div className="sidebar-9">
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

        <div className="content-9">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-9">
          <Component81 seed={seed + 1} title={'Page9-Component81'} />
          <Component82 seed={seed + 2} title={'Page9-Component82'} />
          <Component83 seed={seed + 3} title={'Page9-Component83'} />
          <Component84 seed={seed + 4} title={'Page9-Component84'} />
          </div>
          <div className="component-grid-9">
          <Component85 seed={seed + 7} title={'Page9-Widget85'} />
          <Component86 seed={seed + 8} title={'Page9-Widget86'} />
          <Component87 seed={seed + 9} title={'Page9-Widget87'} />
          <Component88 seed={seed + 10} title={'Page9-Widget88'} />
          <Component89 seed={seed + 11} title={'Page9-Widget89'} />
          <Component90 seed={seed + 12} title={'Page9-Widget90'} />
          </div>
        </div>
      </div>
    </div>
  );
}
