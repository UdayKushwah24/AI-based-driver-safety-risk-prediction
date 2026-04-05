import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState96, heavyCompute96, transformDataset96 } from '../utils/compute96.js';
import Component951 from '../components/Component951.jsx';
import Component952 from '../components/Component952.jsx';
import Component953 from '../components/Component953.jsx';
import Component954 from '../components/Component954.jsx';
import Component955 from '../components/Component955.jsx';
import Component956 from '../components/Component956.jsx';
import Component957 from '../components/Component957.jsx';
import Component958 from '../components/Component958.jsx';
import Component959 from '../components/Component959.jsx';
import Component960 from '../components/Component960.jsx';
import '../styles/page96.css';

const initialState96 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer96(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource96(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page96() {
  const [seed, setSeed] = useState(864);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer96, initialState96);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 96,
    segment: 'S' + ((96 % 5) + 1),
    window: 4,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource96(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset96(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState96(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute96(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 96);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-96">
      <div className="header-96">
        <div>
          <h2>Page96</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-96">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-96">
        <div className="sidebar-96">
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

        <div className="content-96">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-96">
          <Component951 seed={seed + 1} title={'Page96-Component951'} />
          <Component952 seed={seed + 2} title={'Page96-Component952'} />
          <Component953 seed={seed + 3} title={'Page96-Component953'} />
          <Component954 seed={seed + 4} title={'Page96-Component954'} />
          </div>
          <div className="component-grid-96">
          <Component955 seed={seed + 7} title={'Page96-Widget955'} />
          <Component956 seed={seed + 8} title={'Page96-Widget956'} />
          <Component957 seed={seed + 9} title={'Page96-Widget957'} />
          <Component958 seed={seed + 10} title={'Page96-Widget958'} />
          <Component959 seed={seed + 11} title={'Page96-Widget959'} />
          <Component960 seed={seed + 12} title={'Page96-Widget960'} />
          </div>
        </div>
      </div>
    </div>
  );
}
