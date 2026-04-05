import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState25, heavyCompute25, transformDataset25 } from '../utils/compute25.js';
import Component241 from '../components/Component241.jsx';
import Component242 from '../components/Component242.jsx';
import Component243 from '../components/Component243.jsx';
import Component244 from '../components/Component244.jsx';
import Component245 from '../components/Component245.jsx';
import Component246 from '../components/Component246.jsx';
import Component247 from '../components/Component247.jsx';
import Component248 from '../components/Component248.jsx';
import Component249 from '../components/Component249.jsx';
import Component250 from '../components/Component250.jsx';
import '../styles/page25.css';

const initialState25 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer25(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource25(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page25() {
  const [seed, setSeed] = useState(225);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer25, initialState25);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 25,
    segment: 'S' + ((25 % 5) + 1),
    window: 5,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource25(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset25(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState25(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute25(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 25);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-25">
      <div className="header-25">
        <div>
          <h2>Page25</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-25">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-25">
        <div className="sidebar-25">
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

        <div className="content-25">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-25">
          <Component241 seed={seed + 1} title={'Page25-Component241'} />
          <Component242 seed={seed + 2} title={'Page25-Component242'} />
          <Component243 seed={seed + 3} title={'Page25-Component243'} />
          <Component244 seed={seed + 4} title={'Page25-Component244'} />
          </div>
          <div className="component-grid-25">
          <Component245 seed={seed + 7} title={'Page25-Widget245'} />
          <Component246 seed={seed + 8} title={'Page25-Widget246'} />
          <Component247 seed={seed + 9} title={'Page25-Widget247'} />
          <Component248 seed={seed + 10} title={'Page25-Widget248'} />
          <Component249 seed={seed + 11} title={'Page25-Widget249'} />
          <Component250 seed={seed + 12} title={'Page25-Widget250'} />
          </div>
        </div>
      </div>
    </div>
  );
}
