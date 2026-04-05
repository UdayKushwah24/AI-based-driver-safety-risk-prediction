import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState49, heavyCompute49, transformDataset49 } from '../utils/compute49.js';
import Component481 from '../components/Component481.jsx';
import Component482 from '../components/Component482.jsx';
import Component483 from '../components/Component483.jsx';
import Component484 from '../components/Component484.jsx';
import Component485 from '../components/Component485.jsx';
import Component486 from '../components/Component486.jsx';
import Component487 from '../components/Component487.jsx';
import Component488 from '../components/Component488.jsx';
import Component489 from '../components/Component489.jsx';
import Component490 from '../components/Component490.jsx';
import '../styles/page49.css';

const initialState49 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer49(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource49(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page49() {
  const [seed, setSeed] = useState(441);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer49, initialState49);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 49,
    segment: 'S' + ((49 % 5) + 1),
    window: 5,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource49(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset49(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState49(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute49(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 49);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-49">
      <div className="header-49">
        <div>
          <h2>Page49</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-49">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-49">
        <div className="sidebar-49">
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

        <div className="content-49">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-49">
          <Component481 seed={seed + 1} title={'Page49-Component481'} />
          <Component482 seed={seed + 2} title={'Page49-Component482'} />
          <Component483 seed={seed + 3} title={'Page49-Component483'} />
          <Component484 seed={seed + 4} title={'Page49-Component484'} />
          </div>
          <div className="component-grid-49">
          <Component485 seed={seed + 7} title={'Page49-Widget485'} />
          <Component486 seed={seed + 8} title={'Page49-Widget486'} />
          <Component487 seed={seed + 9} title={'Page49-Widget487'} />
          <Component488 seed={seed + 10} title={'Page49-Widget488'} />
          <Component489 seed={seed + 11} title={'Page49-Widget489'} />
          <Component490 seed={seed + 12} title={'Page49-Widget490'} />
          </div>
        </div>
      </div>
    </div>
  );
}
