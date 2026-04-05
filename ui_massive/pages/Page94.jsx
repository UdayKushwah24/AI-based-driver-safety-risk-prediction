import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState94, heavyCompute94, transformDataset94 } from '../utils/compute94.js';
import Component931 from '../components/Component931.jsx';
import Component932 from '../components/Component932.jsx';
import Component933 from '../components/Component933.jsx';
import Component934 from '../components/Component934.jsx';
import Component935 from '../components/Component935.jsx';
import Component936 from '../components/Component936.jsx';
import Component937 from '../components/Component937.jsx';
import Component938 from '../components/Component938.jsx';
import Component939 from '../components/Component939.jsx';
import Component940 from '../components/Component940.jsx';
import '../styles/page94.css';

const initialState94 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer94(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource94(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 8) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page94() {
  const [seed, setSeed] = useState(846);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer94, initialState94);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 94,
    segment: 'S' + ((94 % 5) + 1),
    window: 8,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource94(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset94(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState94(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute94(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 94);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-94">
      <div className="header-94">
        <div>
          <h2>Page94</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-94">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-94">
        <div className="sidebar-94">
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

        <div className="content-94">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-94">
          <Component931 seed={seed + 1} title={'Page94-Component931'} />
          <Component932 seed={seed + 2} title={'Page94-Component932'} />
          <Component933 seed={seed + 3} title={'Page94-Component933'} />
          <Component934 seed={seed + 4} title={'Page94-Component934'} />
          </div>
          <div className="component-grid-94">
          <Component935 seed={seed + 7} title={'Page94-Widget935'} />
          <Component936 seed={seed + 8} title={'Page94-Widget936'} />
          <Component937 seed={seed + 9} title={'Page94-Widget937'} />
          <Component938 seed={seed + 10} title={'Page94-Widget938'} />
          <Component939 seed={seed + 11} title={'Page94-Widget939'} />
          <Component940 seed={seed + 12} title={'Page94-Widget940'} />
          </div>
        </div>
      </div>
    </div>
  );
}
