import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState40, heavyCompute40, transformDataset40 } from '../utils/compute40.js';
import Component391 from '../components/Component391.jsx';
import Component392 from '../components/Component392.jsx';
import Component393 from '../components/Component393.jsx';
import Component394 from '../components/Component394.jsx';
import Component395 from '../components/Component395.jsx';
import Component396 from '../components/Component396.jsx';
import Component397 from '../components/Component397.jsx';
import Component398 from '../components/Component398.jsx';
import Component399 from '../components/Component399.jsx';
import Component400 from '../components/Component400.jsx';
import '../styles/page40.css';

const initialState40 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer40(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource40(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page40() {
  const [seed, setSeed] = useState(360);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer40, initialState40);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 40,
    segment: 'S' + ((40 % 5) + 1),
    window: 8,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource40(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset40(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState40(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute40(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 40);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-40">
      <div className="header-40">
        <div>
          <h2>Page40</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-40">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-40">
        <div className="sidebar-40">
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

        <div className="content-40">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-40">
          <Component391 seed={seed + 1} title={'Page40-Component391'} />
          <Component392 seed={seed + 2} title={'Page40-Component392'} />
          <Component393 seed={seed + 3} title={'Page40-Component393'} />
          <Component394 seed={seed + 4} title={'Page40-Component394'} />
          </div>
          <div className="component-grid-40">
          <Component395 seed={seed + 7} title={'Page40-Widget395'} />
          <Component396 seed={seed + 8} title={'Page40-Widget396'} />
          <Component397 seed={seed + 9} title={'Page40-Widget397'} />
          <Component398 seed={seed + 10} title={'Page40-Widget398'} />
          <Component399 seed={seed + 11} title={'Page40-Widget399'} />
          <Component400 seed={seed + 12} title={'Page40-Widget400'} />
          </div>
        </div>
      </div>
    </div>
  );
}
