import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState7, heavyCompute7, transformDataset7 } from '../utils/compute7.js';
import Component61 from '../components/Component61.jsx';
import Component62 from '../components/Component62.jsx';
import Component63 from '../components/Component63.jsx';
import Component64 from '../components/Component64.jsx';
import Component65 from '../components/Component65.jsx';
import Component66 from '../components/Component66.jsx';
import Component67 from '../components/Component67.jsx';
import Component68 from '../components/Component68.jsx';
import Component69 from '../components/Component69.jsx';
import Component70 from '../components/Component70.jsx';
import '../styles/page7.css';

const initialState7 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer7(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource7(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page7() {
  const [seed, setSeed] = useState(63);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer7, initialState7);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 7,
    segment: 'S' + ((7 % 5) + 1),
    window: 5,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource7(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset7(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState7(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute7(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 7);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-7">
      <div className="header-7">
        <div>
          <h2>Page7</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-7">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-7">
        <div className="sidebar-7">
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

        <div className="content-7">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-7">
          <Component61 seed={seed + 1} title={'Page7-Component61'} />
          <Component62 seed={seed + 2} title={'Page7-Component62'} />
          <Component63 seed={seed + 3} title={'Page7-Component63'} />
          <Component64 seed={seed + 4} title={'Page7-Component64'} />
          </div>
          <div className="component-grid-7">
          <Component65 seed={seed + 7} title={'Page7-Widget65'} />
          <Component66 seed={seed + 8} title={'Page7-Widget66'} />
          <Component67 seed={seed + 9} title={'Page7-Widget67'} />
          <Component68 seed={seed + 10} title={'Page7-Widget68'} />
          <Component69 seed={seed + 11} title={'Page7-Widget69'} />
          <Component70 seed={seed + 12} title={'Page7-Widget70'} />
          </div>
        </div>
      </div>
    </div>
  );
}
