import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState22, heavyCompute22, transformDataset22 } from '../utils/compute22.js';
import Component211 from '../components/Component211.jsx';
import Component212 from '../components/Component212.jsx';
import Component213 from '../components/Component213.jsx';
import Component214 from '../components/Component214.jsx';
import Component215 from '../components/Component215.jsx';
import Component216 from '../components/Component216.jsx';
import Component217 from '../components/Component217.jsx';
import Component218 from '../components/Component218.jsx';
import Component219 from '../components/Component219.jsx';
import Component220 from '../components/Component220.jsx';
import '../styles/page22.css';

const initialState22 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer22(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource22(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page22() {
  const [seed, setSeed] = useState(198);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer22, initialState22);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 22,
    segment: 'S' + ((22 % 5) + 1),
    window: 8,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource22(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset22(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState22(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute22(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 22);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-22">
      <div className="header-22">
        <div>
          <h2>Page22</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-22">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-22">
        <div className="sidebar-22">
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

        <div className="content-22">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-22">
          <Component211 seed={seed + 1} title={'Page22-Component211'} />
          <Component212 seed={seed + 2} title={'Page22-Component212'} />
          <Component213 seed={seed + 3} title={'Page22-Component213'} />
          <Component214 seed={seed + 4} title={'Page22-Component214'} />
          </div>
          <div className="component-grid-22">
          <Component215 seed={seed + 7} title={'Page22-Widget215'} />
          <Component216 seed={seed + 8} title={'Page22-Widget216'} />
          <Component217 seed={seed + 9} title={'Page22-Widget217'} />
          <Component218 seed={seed + 10} title={'Page22-Widget218'} />
          <Component219 seed={seed + 11} title={'Page22-Widget219'} />
          <Component220 seed={seed + 12} title={'Page22-Widget220'} />
          </div>
        </div>
      </div>
    </div>
  );
}
