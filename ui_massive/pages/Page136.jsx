import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState136, heavyCompute136, transformDataset136 } from '../utils/compute136.js';
import Component251 from '../components/Component251.jsx';
import Component252 from '../components/Component252.jsx';
import Component253 from '../components/Component253.jsx';
import Component254 from '../components/Component254.jsx';
import Component255 from '../components/Component255.jsx';
import Component256 from '../components/Component256.jsx';
import Component257 from '../components/Component257.jsx';
import Component258 from '../components/Component258.jsx';
import Component259 from '../components/Component259.jsx';
import Component260 from '../components/Component260.jsx';
import '../styles/page136.css';

const initialState136 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer136(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource136(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page136() {
  const [seed, setSeed] = useState(1224);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer136, initialState136);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 136,
    segment: 'S' + ((136 % 5) + 1),
    window: 8,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource136(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset136(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState136(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute136(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 136);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-136">
      <div className="header-136">
        <div>
          <h2>Page136</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-136">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-136">
        <div className="sidebar-136">
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

        <div className="content-136">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-136">
          <Component251 seed={seed + 1} title={'Page136-Component251'} />
          <Component252 seed={seed + 2} title={'Page136-Component252'} />
          <Component253 seed={seed + 3} title={'Page136-Component253'} />
          <Component254 seed={seed + 4} title={'Page136-Component254'} />
          </div>
          <div className="component-grid-136">
          <Component255 seed={seed + 7} title={'Page136-Widget255'} />
          <Component256 seed={seed + 8} title={'Page136-Widget256'} />
          <Component257 seed={seed + 9} title={'Page136-Widget257'} />
          <Component258 seed={seed + 10} title={'Page136-Widget258'} />
          <Component259 seed={seed + 11} title={'Page136-Widget259'} />
          <Component260 seed={seed + 12} title={'Page136-Widget260'} />
          </div>
        </div>
      </div>
    </div>
  );
}
