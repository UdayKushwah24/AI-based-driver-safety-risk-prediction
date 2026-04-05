import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState64, heavyCompute64, transformDataset64 } from '../utils/compute64.js';
import Component631 from '../components/Component631.jsx';
import Component632 from '../components/Component632.jsx';
import Component633 from '../components/Component633.jsx';
import Component634 from '../components/Component634.jsx';
import Component635 from '../components/Component635.jsx';
import Component636 from '../components/Component636.jsx';
import Component637 from '../components/Component637.jsx';
import Component638 from '../components/Component638.jsx';
import Component639 from '../components/Component639.jsx';
import Component640 from '../components/Component640.jsx';
import '../styles/page64.css';

const initialState64 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer64(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource64(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page64() {
  const [seed, setSeed] = useState(576);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer64, initialState64);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 64,
    segment: 'S' + ((64 % 5) + 1),
    window: 8,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource64(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset64(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState64(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute64(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 64);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-64">
      <div className="header-64">
        <div>
          <h2>Page64</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-64">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-64">
        <div className="sidebar-64">
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

        <div className="content-64">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-64">
          <Component631 seed={seed + 1} title={'Page64-Component631'} />
          <Component632 seed={seed + 2} title={'Page64-Component632'} />
          <Component633 seed={seed + 3} title={'Page64-Component633'} />
          <Component634 seed={seed + 4} title={'Page64-Component634'} />
          </div>
          <div className="component-grid-64">
          <Component635 seed={seed + 7} title={'Page64-Widget635'} />
          <Component636 seed={seed + 8} title={'Page64-Widget636'} />
          <Component637 seed={seed + 9} title={'Page64-Widget637'} />
          <Component638 seed={seed + 10} title={'Page64-Widget638'} />
          <Component639 seed={seed + 11} title={'Page64-Widget639'} />
          <Component640 seed={seed + 12} title={'Page64-Widget640'} />
          </div>
        </div>
      </div>
    </div>
  );
}
