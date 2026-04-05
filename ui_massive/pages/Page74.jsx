import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState74, heavyCompute74, transformDataset74 } from '../utils/compute74.js';
import Component731 from '../components/Component731.jsx';
import Component732 from '../components/Component732.jsx';
import Component733 from '../components/Component733.jsx';
import Component734 from '../components/Component734.jsx';
import Component735 from '../components/Component735.jsx';
import Component736 from '../components/Component736.jsx';
import Component737 from '../components/Component737.jsx';
import Component738 from '../components/Component738.jsx';
import Component739 from '../components/Component739.jsx';
import Component740 from '../components/Component740.jsx';
import '../styles/page74.css';

const initialState74 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer74(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource74(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page74() {
  const [seed, setSeed] = useState(666);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer74, initialState74);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 74,
    segment: 'S' + ((74 % 5) + 1),
    window: 6,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource74(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset74(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState74(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute74(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 74);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-74">
      <div className="header-74">
        <div>
          <h2>Page74</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-74">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-74">
        <div className="sidebar-74">
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

        <div className="content-74">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-74">
          <Component731 seed={seed + 1} title={'Page74-Component731'} />
          <Component732 seed={seed + 2} title={'Page74-Component732'} />
          <Component733 seed={seed + 3} title={'Page74-Component733'} />
          <Component734 seed={seed + 4} title={'Page74-Component734'} />
          </div>
          <div className="component-grid-74">
          <Component735 seed={seed + 7} title={'Page74-Widget735'} />
          <Component736 seed={seed + 8} title={'Page74-Widget736'} />
          <Component737 seed={seed + 9} title={'Page74-Widget737'} />
          <Component738 seed={seed + 10} title={'Page74-Widget738'} />
          <Component739 seed={seed + 11} title={'Page74-Widget739'} />
          <Component740 seed={seed + 12} title={'Page74-Widget740'} />
          </div>
        </div>
      </div>
    </div>
  );
}
