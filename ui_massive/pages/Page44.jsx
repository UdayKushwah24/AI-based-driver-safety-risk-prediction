import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState44, heavyCompute44, transformDataset44 } from '../utils/compute44.js';
import Component431 from '../components/Component431.jsx';
import Component432 from '../components/Component432.jsx';
import Component433 from '../components/Component433.jsx';
import Component434 from '../components/Component434.jsx';
import Component435 from '../components/Component435.jsx';
import Component436 from '../components/Component436.jsx';
import Component437 from '../components/Component437.jsx';
import Component438 from '../components/Component438.jsx';
import Component439 from '../components/Component439.jsx';
import Component440 from '../components/Component440.jsx';
import '../styles/page44.css';

const initialState44 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer44(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource44(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page44() {
  const [seed, setSeed] = useState(396);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer44, initialState44);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 44,
    segment: 'S' + ((44 % 5) + 1),
    window: 6,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource44(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset44(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState44(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute44(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 44);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-44">
      <div className="header-44">
        <div>
          <h2>Page44</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-44">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-44">
        <div className="sidebar-44">
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

        <div className="content-44">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-44">
          <Component431 seed={seed + 1} title={'Page44-Component431'} />
          <Component432 seed={seed + 2} title={'Page44-Component432'} />
          <Component433 seed={seed + 3} title={'Page44-Component433'} />
          <Component434 seed={seed + 4} title={'Page44-Component434'} />
          </div>
          <div className="component-grid-44">
          <Component435 seed={seed + 7} title={'Page44-Widget435'} />
          <Component436 seed={seed + 8} title={'Page44-Widget436'} />
          <Component437 seed={seed + 9} title={'Page44-Widget437'} />
          <Component438 seed={seed + 10} title={'Page44-Widget438'} />
          <Component439 seed={seed + 11} title={'Page44-Widget439'} />
          <Component440 seed={seed + 12} title={'Page44-Widget440'} />
          </div>
        </div>
      </div>
    </div>
  );
}
