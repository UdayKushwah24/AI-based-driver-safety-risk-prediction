import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState127, heavyCompute127, transformDataset127 } from '../utils/compute127.js';
import Component161 from '../components/Component161.jsx';
import Component162 from '../components/Component162.jsx';
import Component163 from '../components/Component163.jsx';
import Component164 from '../components/Component164.jsx';
import Component165 from '../components/Component165.jsx';
import Component166 from '../components/Component166.jsx';
import Component167 from '../components/Component167.jsx';
import Component168 from '../components/Component168.jsx';
import Component169 from '../components/Component169.jsx';
import Component170 from '../components/Component170.jsx';
import '../styles/page127.css';

const initialState127 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer127(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource127(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page127() {
  const [seed, setSeed] = useState(1143);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer127, initialState127);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 127,
    segment: 'S' + ((127 % 5) + 1),
    window: 5,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource127(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset127(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState127(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute127(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 127);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-127">
      <div className="header-127">
        <div>
          <h2>Page127</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-127">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-127">
        <div className="sidebar-127">
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

        <div className="content-127">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-127">
          <Component161 seed={seed + 1} title={'Page127-Component161'} />
          <Component162 seed={seed + 2} title={'Page127-Component162'} />
          <Component163 seed={seed + 3} title={'Page127-Component163'} />
          <Component164 seed={seed + 4} title={'Page127-Component164'} />
          </div>
          <div className="component-grid-127">
          <Component165 seed={seed + 7} title={'Page127-Widget165'} />
          <Component166 seed={seed + 8} title={'Page127-Widget166'} />
          <Component167 seed={seed + 9} title={'Page127-Widget167'} />
          <Component168 seed={seed + 10} title={'Page127-Widget168'} />
          <Component169 seed={seed + 11} title={'Page127-Widget169'} />
          <Component170 seed={seed + 12} title={'Page127-Widget170'} />
          </div>
        </div>
      </div>
    </div>
  );
}
