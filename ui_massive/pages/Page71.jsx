import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState71, heavyCompute71, transformDataset71 } from '../utils/compute71.js';
import Component701 from '../components/Component701.jsx';
import Component702 from '../components/Component702.jsx';
import Component703 from '../components/Component703.jsx';
import Component704 from '../components/Component704.jsx';
import Component705 from '../components/Component705.jsx';
import Component706 from '../components/Component706.jsx';
import Component707 from '../components/Component707.jsx';
import Component708 from '../components/Component708.jsx';
import Component709 from '../components/Component709.jsx';
import Component710 from '../components/Component710.jsx';
import '../styles/page71.css';

const initialState71 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer71(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource71(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page71() {
  const [seed, setSeed] = useState(639);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer71, initialState71);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 71,
    segment: 'S' + ((71 % 5) + 1),
    window: 9,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource71(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset71(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState71(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute71(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 71);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-71">
      <div className="header-71">
        <div>
          <h2>Page71</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-71">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-71">
        <div className="sidebar-71">
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

        <div className="content-71">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-71">
          <Component701 seed={seed + 1} title={'Page71-Component701'} />
          <Component702 seed={seed + 2} title={'Page71-Component702'} />
          <Component703 seed={seed + 3} title={'Page71-Component703'} />
          <Component704 seed={seed + 4} title={'Page71-Component704'} />
          </div>
          <div className="component-grid-71">
          <Component705 seed={seed + 7} title={'Page71-Widget705'} />
          <Component706 seed={seed + 8} title={'Page71-Widget706'} />
          <Component707 seed={seed + 9} title={'Page71-Widget707'} />
          <Component708 seed={seed + 10} title={'Page71-Widget708'} />
          <Component709 seed={seed + 11} title={'Page71-Widget709'} />
          <Component710 seed={seed + 12} title={'Page71-Widget710'} />
          </div>
        </div>
      </div>
    </div>
  );
}
