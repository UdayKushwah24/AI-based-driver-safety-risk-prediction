import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState133, heavyCompute133, transformDataset133 } from '../utils/compute133.js';
import Component221 from '../components/Component221.jsx';
import Component222 from '../components/Component222.jsx';
import Component223 from '../components/Component223.jsx';
import Component224 from '../components/Component224.jsx';
import Component225 from '../components/Component225.jsx';
import Component226 from '../components/Component226.jsx';
import Component227 from '../components/Component227.jsx';
import Component228 from '../components/Component228.jsx';
import Component229 from '../components/Component229.jsx';
import Component230 from '../components/Component230.jsx';
import '../styles/page133.css';

const initialState133 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer133(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource133(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page133() {
  const [seed, setSeed] = useState(1197);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer133, initialState133);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 133,
    segment: 'S' + ((133 % 5) + 1),
    window: 5,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource133(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset133(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState133(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute133(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 133);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-133">
      <div className="header-133">
        <div>
          <h2>Page133</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-133">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-133">
        <div className="sidebar-133">
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

        <div className="content-133">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-133">
          <Component221 seed={seed + 1} title={'Page133-Component221'} />
          <Component222 seed={seed + 2} title={'Page133-Component222'} />
          <Component223 seed={seed + 3} title={'Page133-Component223'} />
          <Component224 seed={seed + 4} title={'Page133-Component224'} />
          </div>
          <div className="component-grid-133">
          <Component225 seed={seed + 7} title={'Page133-Widget225'} />
          <Component226 seed={seed + 8} title={'Page133-Widget226'} />
          <Component227 seed={seed + 9} title={'Page133-Widget227'} />
          <Component228 seed={seed + 10} title={'Page133-Widget228'} />
          <Component229 seed={seed + 11} title={'Page133-Widget229'} />
          <Component230 seed={seed + 12} title={'Page133-Widget230'} />
          </div>
        </div>
      </div>
    </div>
  );
}
