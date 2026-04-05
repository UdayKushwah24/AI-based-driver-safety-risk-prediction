import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState128, heavyCompute128, transformDataset128 } from '../utils/compute128.js';
import Component171 from '../components/Component171.jsx';
import Component172 from '../components/Component172.jsx';
import Component173 from '../components/Component173.jsx';
import Component174 from '../components/Component174.jsx';
import Component175 from '../components/Component175.jsx';
import Component176 from '../components/Component176.jsx';
import Component177 from '../components/Component177.jsx';
import Component178 from '../components/Component178.jsx';
import Component179 from '../components/Component179.jsx';
import Component180 from '../components/Component180.jsx';
import '../styles/page128.css';

const initialState128 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer128(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource128(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page128() {
  const [seed, setSeed] = useState(1152);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer128, initialState128);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 128,
    segment: 'S' + ((128 % 5) + 1),
    window: 6,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource128(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset128(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState128(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute128(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 128);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-128">
      <div className="header-128">
        <div>
          <h2>Page128</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-128">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-128">
        <div className="sidebar-128">
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

        <div className="content-128">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-128">
          <Component171 seed={seed + 1} title={'Page128-Component171'} />
          <Component172 seed={seed + 2} title={'Page128-Component172'} />
          <Component173 seed={seed + 3} title={'Page128-Component173'} />
          <Component174 seed={seed + 4} title={'Page128-Component174'} />
          </div>
          <div className="component-grid-128">
          <Component175 seed={seed + 7} title={'Page128-Widget175'} />
          <Component176 seed={seed + 8} title={'Page128-Widget176'} />
          <Component177 seed={seed + 9} title={'Page128-Widget177'} />
          <Component178 seed={seed + 10} title={'Page128-Widget178'} />
          <Component179 seed={seed + 11} title={'Page128-Widget179'} />
          <Component180 seed={seed + 12} title={'Page128-Widget180'} />
          </div>
        </div>
      </div>
    </div>
  );
}
