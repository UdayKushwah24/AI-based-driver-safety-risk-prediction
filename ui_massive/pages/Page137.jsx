import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState137, heavyCompute137, transformDataset137 } from '../utils/compute137.js';
import Component261 from '../components/Component261.jsx';
import Component262 from '../components/Component262.jsx';
import Component263 from '../components/Component263.jsx';
import Component264 from '../components/Component264.jsx';
import Component265 from '../components/Component265.jsx';
import Component266 from '../components/Component266.jsx';
import Component267 from '../components/Component267.jsx';
import Component268 from '../components/Component268.jsx';
import Component269 from '../components/Component269.jsx';
import Component270 from '../components/Component270.jsx';
import '../styles/page137.css';

const initialState137 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer137(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource137(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page137() {
  const [seed, setSeed] = useState(1233);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer137, initialState137);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 137,
    segment: 'S' + ((137 % 5) + 1),
    window: 9,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource137(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset137(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState137(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute137(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 137);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-137">
      <div className="header-137">
        <div>
          <h2>Page137</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-137">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-137">
        <div className="sidebar-137">
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

        <div className="content-137">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-137">
          <Component261 seed={seed + 1} title={'Page137-Component261'} />
          <Component262 seed={seed + 2} title={'Page137-Component262'} />
          <Component263 seed={seed + 3} title={'Page137-Component263'} />
          <Component264 seed={seed + 4} title={'Page137-Component264'} />
          </div>
          <div className="component-grid-137">
          <Component265 seed={seed + 7} title={'Page137-Widget265'} />
          <Component266 seed={seed + 8} title={'Page137-Widget266'} />
          <Component267 seed={seed + 9} title={'Page137-Widget267'} />
          <Component268 seed={seed + 10} title={'Page137-Widget268'} />
          <Component269 seed={seed + 11} title={'Page137-Widget269'} />
          <Component270 seed={seed + 12} title={'Page137-Widget270'} />
          </div>
        </div>
      </div>
    </div>
  );
}
