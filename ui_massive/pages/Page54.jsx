import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState54, heavyCompute54, transformDataset54 } from '../utils/compute54.js';
import Component531 from '../components/Component531.jsx';
import Component532 from '../components/Component532.jsx';
import Component533 from '../components/Component533.jsx';
import Component534 from '../components/Component534.jsx';
import Component535 from '../components/Component535.jsx';
import Component536 from '../components/Component536.jsx';
import Component537 from '../components/Component537.jsx';
import Component538 from '../components/Component538.jsx';
import Component539 from '../components/Component539.jsx';
import Component540 from '../components/Component540.jsx';
import '../styles/page54.css';

const initialState54 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer54(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource54(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page54() {
  const [seed, setSeed] = useState(486);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer54, initialState54);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 54,
    segment: 'S' + ((54 % 5) + 1),
    window: 4,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource54(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset54(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState54(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute54(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 54);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-54">
      <div className="header-54">
        <div>
          <h2>Page54</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-54">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-54">
        <div className="sidebar-54">
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

        <div className="content-54">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-54">
          <Component531 seed={seed + 1} title={'Page54-Component531'} />
          <Component532 seed={seed + 2} title={'Page54-Component532'} />
          <Component533 seed={seed + 3} title={'Page54-Component533'} />
          <Component534 seed={seed + 4} title={'Page54-Component534'} />
          </div>
          <div className="component-grid-54">
          <Component535 seed={seed + 7} title={'Page54-Widget535'} />
          <Component536 seed={seed + 8} title={'Page54-Widget536'} />
          <Component537 seed={seed + 9} title={'Page54-Widget537'} />
          <Component538 seed={seed + 10} title={'Page54-Widget538'} />
          <Component539 seed={seed + 11} title={'Page54-Widget539'} />
          <Component540 seed={seed + 12} title={'Page54-Widget540'} />
          </div>
        </div>
      </div>
    </div>
  );
}
