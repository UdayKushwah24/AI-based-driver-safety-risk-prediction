import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState8, heavyCompute8, transformDataset8 } from '../utils/compute8.js';
import Component71 from '../components/Component71.jsx';
import Component72 from '../components/Component72.jsx';
import Component73 from '../components/Component73.jsx';
import Component74 from '../components/Component74.jsx';
import Component75 from '../components/Component75.jsx';
import Component76 from '../components/Component76.jsx';
import Component77 from '../components/Component77.jsx';
import Component78 from '../components/Component78.jsx';
import Component79 from '../components/Component79.jsx';
import Component80 from '../components/Component80.jsx';
import '../styles/page8.css';

const initialState8 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer8(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource8(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page8() {
  const [seed, setSeed] = useState(72);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer8, initialState8);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 8,
    segment: 'S' + ((8 % 5) + 1),
    window: 6,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource8(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset8(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState8(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute8(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 8);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-8">
      <div className="header-8">
        <div>
          <h2>Page8</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-8">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-8">
        <div className="sidebar-8">
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

        <div className="content-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-8">
          <Component71 seed={seed + 1} title={'Page8-Component71'} />
          <Component72 seed={seed + 2} title={'Page8-Component72'} />
          <Component73 seed={seed + 3} title={'Page8-Component73'} />
          <Component74 seed={seed + 4} title={'Page8-Component74'} />
          </div>
          <div className="component-grid-8">
          <Component75 seed={seed + 7} title={'Page8-Widget75'} />
          <Component76 seed={seed + 8} title={'Page8-Widget76'} />
          <Component77 seed={seed + 9} title={'Page8-Widget77'} />
          <Component78 seed={seed + 10} title={'Page8-Widget78'} />
          <Component79 seed={seed + 11} title={'Page8-Widget79'} />
          <Component80 seed={seed + 12} title={'Page8-Widget80'} />
          </div>
        </div>
      </div>
    </div>
  );
}
