import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState55, heavyCompute55, transformDataset55 } from '../utils/compute55.js';
import Component541 from '../components/Component541.jsx';
import Component542 from '../components/Component542.jsx';
import Component543 from '../components/Component543.jsx';
import Component544 from '../components/Component544.jsx';
import Component545 from '../components/Component545.jsx';
import Component546 from '../components/Component546.jsx';
import Component547 from '../components/Component547.jsx';
import Component548 from '../components/Component548.jsx';
import Component549 from '../components/Component549.jsx';
import Component550 from '../components/Component550.jsx';
import '../styles/page55.css';

const initialState55 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer55(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource55(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page55() {
  const [seed, setSeed] = useState(495);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer55, initialState55);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 55,
    segment: 'S' + ((55 % 5) + 1),
    window: 5,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource55(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset55(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState55(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute55(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 55);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-55">
      <div className="header-55">
        <div>
          <h2>Page55</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-55">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-55">
        <div className="sidebar-55">
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

        <div className="content-55">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-55">
          <Component541 seed={seed + 1} title={'Page55-Component541'} />
          <Component542 seed={seed + 2} title={'Page55-Component542'} />
          <Component543 seed={seed + 3} title={'Page55-Component543'} />
          <Component544 seed={seed + 4} title={'Page55-Component544'} />
          </div>
          <div className="component-grid-55">
          <Component545 seed={seed + 7} title={'Page55-Widget545'} />
          <Component546 seed={seed + 8} title={'Page55-Widget546'} />
          <Component547 seed={seed + 9} title={'Page55-Widget547'} />
          <Component548 seed={seed + 10} title={'Page55-Widget548'} />
          <Component549 seed={seed + 11} title={'Page55-Widget549'} />
          <Component550 seed={seed + 12} title={'Page55-Widget550'} />
          </div>
        </div>
      </div>
    </div>
  );
}
