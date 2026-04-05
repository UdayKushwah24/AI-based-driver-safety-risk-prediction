import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState42, heavyCompute42, transformDataset42 } from '../utils/compute42.js';
import Component411 from '../components/Component411.jsx';
import Component412 from '../components/Component412.jsx';
import Component413 from '../components/Component413.jsx';
import Component414 from '../components/Component414.jsx';
import Component415 from '../components/Component415.jsx';
import Component416 from '../components/Component416.jsx';
import Component417 from '../components/Component417.jsx';
import Component418 from '../components/Component418.jsx';
import Component419 from '../components/Component419.jsx';
import Component420 from '../components/Component420.jsx';
import '../styles/page42.css';

const initialState42 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer42(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource42(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page42() {
  const [seed, setSeed] = useState(378);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer42, initialState42);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 42,
    segment: 'S' + ((42 % 5) + 1),
    window: 4,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource42(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset42(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState42(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute42(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 42);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-42">
      <div className="header-42">
        <div>
          <h2>Page42</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-42">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-42">
        <div className="sidebar-42">
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

        <div className="content-42">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-42">
          <Component411 seed={seed + 1} title={'Page42-Component411'} />
          <Component412 seed={seed + 2} title={'Page42-Component412'} />
          <Component413 seed={seed + 3} title={'Page42-Component413'} />
          <Component414 seed={seed + 4} title={'Page42-Component414'} />
          </div>
          <div className="component-grid-42">
          <Component415 seed={seed + 7} title={'Page42-Widget415'} />
          <Component416 seed={seed + 8} title={'Page42-Widget416'} />
          <Component417 seed={seed + 9} title={'Page42-Widget417'} />
          <Component418 seed={seed + 10} title={'Page42-Widget418'} />
          <Component419 seed={seed + 11} title={'Page42-Widget419'} />
          <Component420 seed={seed + 12} title={'Page42-Widget420'} />
          </div>
        </div>
      </div>
    </div>
  );
}
