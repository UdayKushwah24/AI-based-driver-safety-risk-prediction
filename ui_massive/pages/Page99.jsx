import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState99, heavyCompute99, transformDataset99 } from '../utils/compute99.js';
import Component981 from '../components/Component981.jsx';
import Component982 from '../components/Component982.jsx';
import Component983 from '../components/Component983.jsx';
import Component984 from '../components/Component984.jsx';
import Component985 from '../components/Component985.jsx';
import Component986 from '../components/Component986.jsx';
import Component987 from '../components/Component987.jsx';
import Component988 from '../components/Component988.jsx';
import Component989 from '../components/Component989.jsx';
import Component990 from '../components/Component990.jsx';
import '../styles/page99.css';

const initialState99 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer99(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource99(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page99() {
  const [seed, setSeed] = useState(891);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer99, initialState99);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 99,
    segment: 'S' + ((99 % 5) + 1),
    window: 7,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource99(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset99(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState99(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute99(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 99);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-99">
      <div className="header-99">
        <div>
          <h2>Page99</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-99">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-99">
        <div className="sidebar-99">
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

        <div className="content-99">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-99">
          <Component981 seed={seed + 1} title={'Page99-Component981'} />
          <Component982 seed={seed + 2} title={'Page99-Component982'} />
          <Component983 seed={seed + 3} title={'Page99-Component983'} />
          <Component984 seed={seed + 4} title={'Page99-Component984'} />
          </div>
          <div className="component-grid-99">
          <Component985 seed={seed + 7} title={'Page99-Widget985'} />
          <Component986 seed={seed + 8} title={'Page99-Widget986'} />
          <Component987 seed={seed + 9} title={'Page99-Widget987'} />
          <Component988 seed={seed + 10} title={'Page99-Widget988'} />
          <Component989 seed={seed + 11} title={'Page99-Widget989'} />
          <Component990 seed={seed + 12} title={'Page99-Widget990'} />
          </div>
        </div>
      </div>
    </div>
  );
}
