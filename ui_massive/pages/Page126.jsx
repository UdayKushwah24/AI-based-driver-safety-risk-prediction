import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState126, heavyCompute126, transformDataset126 } from '../utils/compute126.js';
import Component151 from '../components/Component151.jsx';
import Component152 from '../components/Component152.jsx';
import Component153 from '../components/Component153.jsx';
import Component154 from '../components/Component154.jsx';
import Component155 from '../components/Component155.jsx';
import Component156 from '../components/Component156.jsx';
import Component157 from '../components/Component157.jsx';
import Component158 from '../components/Component158.jsx';
import Component159 from '../components/Component159.jsx';
import Component160 from '../components/Component160.jsx';
import '../styles/page126.css';

const initialState126 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer126(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource126(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page126() {
  const [seed, setSeed] = useState(1134);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer126, initialState126);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 126,
    segment: 'S' + ((126 % 5) + 1),
    window: 4,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource126(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset126(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState126(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute126(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 126);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-126">
      <div className="header-126">
        <div>
          <h2>Page126</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-126">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-126">
        <div className="sidebar-126">
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

        <div className="content-126">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-126">
          <Component151 seed={seed + 1} title={'Page126-Component151'} />
          <Component152 seed={seed + 2} title={'Page126-Component152'} />
          <Component153 seed={seed + 3} title={'Page126-Component153'} />
          <Component154 seed={seed + 4} title={'Page126-Component154'} />
          </div>
          <div className="component-grid-126">
          <Component155 seed={seed + 7} title={'Page126-Widget155'} />
          <Component156 seed={seed + 8} title={'Page126-Widget156'} />
          <Component157 seed={seed + 9} title={'Page126-Widget157'} />
          <Component158 seed={seed + 10} title={'Page126-Widget158'} />
          <Component159 seed={seed + 11} title={'Page126-Widget159'} />
          <Component160 seed={seed + 12} title={'Page126-Widget160'} />
          </div>
        </div>
      </div>
    </div>
  );
}
