import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState93, heavyCompute93, transformDataset93 } from '../utils/compute93.js';
import Component921 from '../components/Component921.jsx';
import Component922 from '../components/Component922.jsx';
import Component923 from '../components/Component923.jsx';
import Component924 from '../components/Component924.jsx';
import Component925 from '../components/Component925.jsx';
import Component926 from '../components/Component926.jsx';
import Component927 from '../components/Component927.jsx';
import Component928 from '../components/Component928.jsx';
import Component929 from '../components/Component929.jsx';
import Component930 from '../components/Component930.jsx';
import '../styles/page93.css';

const initialState93 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer93(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource93(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page93() {
  const [seed, setSeed] = useState(837);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer93, initialState93);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 93,
    segment: 'S' + ((93 % 5) + 1),
    window: 7,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource93(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset93(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState93(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute93(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 93);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-93">
      <div className="header-93">
        <div>
          <h2>Page93</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-93">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-93">
        <div className="sidebar-93">
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

        <div className="content-93">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-93">
          <Component921 seed={seed + 1} title={'Page93-Component921'} />
          <Component922 seed={seed + 2} title={'Page93-Component922'} />
          <Component923 seed={seed + 3} title={'Page93-Component923'} />
          <Component924 seed={seed + 4} title={'Page93-Component924'} />
          </div>
          <div className="component-grid-93">
          <Component925 seed={seed + 7} title={'Page93-Widget925'} />
          <Component926 seed={seed + 8} title={'Page93-Widget926'} />
          <Component927 seed={seed + 9} title={'Page93-Widget927'} />
          <Component928 seed={seed + 10} title={'Page93-Widget928'} />
          <Component929 seed={seed + 11} title={'Page93-Widget929'} />
          <Component930 seed={seed + 12} title={'Page93-Widget930'} />
          </div>
        </div>
      </div>
    </div>
  );
}
