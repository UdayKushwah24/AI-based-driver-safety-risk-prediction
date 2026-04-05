import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState61, heavyCompute61, transformDataset61 } from '../utils/compute61.js';
import Component601 from '../components/Component601.jsx';
import Component602 from '../components/Component602.jsx';
import Component603 from '../components/Component603.jsx';
import Component604 from '../components/Component604.jsx';
import Component605 from '../components/Component605.jsx';
import Component606 from '../components/Component606.jsx';
import Component607 from '../components/Component607.jsx';
import Component608 from '../components/Component608.jsx';
import Component609 from '../components/Component609.jsx';
import Component610 from '../components/Component610.jsx';
import '../styles/page61.css';

const initialState61 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer61(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource61(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page61() {
  const [seed, setSeed] = useState(549);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer61, initialState61);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 61,
    segment: 'S' + ((61 % 5) + 1),
    window: 5,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource61(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset61(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState61(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute61(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 61);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-61">
      <div className="header-61">
        <div>
          <h2>Page61</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-61">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-61">
        <div className="sidebar-61">
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

        <div className="content-61">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-61">
          <Component601 seed={seed + 1} title={'Page61-Component601'} />
          <Component602 seed={seed + 2} title={'Page61-Component602'} />
          <Component603 seed={seed + 3} title={'Page61-Component603'} />
          <Component604 seed={seed + 4} title={'Page61-Component604'} />
          </div>
          <div className="component-grid-61">
          <Component605 seed={seed + 7} title={'Page61-Widget605'} />
          <Component606 seed={seed + 8} title={'Page61-Widget606'} />
          <Component607 seed={seed + 9} title={'Page61-Widget607'} />
          <Component608 seed={seed + 10} title={'Page61-Widget608'} />
          <Component609 seed={seed + 11} title={'Page61-Widget609'} />
          <Component610 seed={seed + 12} title={'Page61-Widget610'} />
          </div>
        </div>
      </div>
    </div>
  );
}
