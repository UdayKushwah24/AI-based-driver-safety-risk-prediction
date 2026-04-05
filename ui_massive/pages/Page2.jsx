import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState2, heavyCompute2, transformDataset2 } from '../utils/compute2.js';
import Component11 from '../components/Component11.jsx';
import Component12 from '../components/Component12.jsx';
import Component13 from '../components/Component13.jsx';
import Component14 from '../components/Component14.jsx';
import Component15 from '../components/Component15.jsx';
import Component16 from '../components/Component16.jsx';
import Component17 from '../components/Component17.jsx';
import Component18 from '../components/Component18.jsx';
import Component19 from '../components/Component19.jsx';
import Component20 from '../components/Component20.jsx';
import '../styles/page2.css';

const initialState2 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer2(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource2(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page2() {
  const [seed, setSeed] = useState(18);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer2, initialState2);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 2,
    segment: 'S' + ((2 % 5) + 1),
    window: 6,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource2(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset2(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState2(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute2(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 2);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-2">
      <div className="header-2">
        <div>
          <h2>Page2</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-2">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-2">
        <div className="sidebar-2">
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

        <div className="content-2">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-2">
          <Component11 seed={seed + 1} title={'Page2-Component11'} />
          <Component12 seed={seed + 2} title={'Page2-Component12'} />
          <Component13 seed={seed + 3} title={'Page2-Component13'} />
          <Component14 seed={seed + 4} title={'Page2-Component14'} />
          </div>
          <div className="component-grid-2">
          <Component15 seed={seed + 7} title={'Page2-Widget15'} />
          <Component16 seed={seed + 8} title={'Page2-Widget16'} />
          <Component17 seed={seed + 9} title={'Page2-Widget17'} />
          <Component18 seed={seed + 10} title={'Page2-Widget18'} />
          <Component19 seed={seed + 11} title={'Page2-Widget19'} />
          <Component20 seed={seed + 12} title={'Page2-Widget20'} />
          </div>
        </div>
      </div>
    </div>
  );
}
