import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState130, heavyCompute130, transformDataset130 } from '../utils/compute130.js';
import Component191 from '../components/Component191.jsx';
import Component192 from '../components/Component192.jsx';
import Component193 from '../components/Component193.jsx';
import Component194 from '../components/Component194.jsx';
import Component195 from '../components/Component195.jsx';
import Component196 from '../components/Component196.jsx';
import Component197 from '../components/Component197.jsx';
import Component198 from '../components/Component198.jsx';
import Component199 from '../components/Component199.jsx';
import Component200 from '../components/Component200.jsx';
import '../styles/page130.css';

const initialState130 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer130(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource130(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page130() {
  const [seed, setSeed] = useState(1170);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer130, initialState130);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 130,
    segment: 'S' + ((130 % 5) + 1),
    window: 8,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource130(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset130(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState130(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute130(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 130);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-130">
      <div className="header-130">
        <div>
          <h2>Page130</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-130">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-130">
        <div className="sidebar-130">
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

        <div className="content-130">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-130">
          <Component191 seed={seed + 1} title={'Page130-Component191'} />
          <Component192 seed={seed + 2} title={'Page130-Component192'} />
          <Component193 seed={seed + 3} title={'Page130-Component193'} />
          <Component194 seed={seed + 4} title={'Page130-Component194'} />
          </div>
          <div className="component-grid-130">
          <Component195 seed={seed + 7} title={'Page130-Widget195'} />
          <Component196 seed={seed + 8} title={'Page130-Widget196'} />
          <Component197 seed={seed + 9} title={'Page130-Widget197'} />
          <Component198 seed={seed + 10} title={'Page130-Widget198'} />
          <Component199 seed={seed + 11} title={'Page130-Widget199'} />
          <Component200 seed={seed + 12} title={'Page130-Widget200'} />
          </div>
        </div>
      </div>
    </div>
  );
}
