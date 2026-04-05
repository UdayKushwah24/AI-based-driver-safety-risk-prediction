import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState70, heavyCompute70, transformDataset70 } from '../utils/compute70.js';
import Component691 from '../components/Component691.jsx';
import Component692 from '../components/Component692.jsx';
import Component693 from '../components/Component693.jsx';
import Component694 from '../components/Component694.jsx';
import Component695 from '../components/Component695.jsx';
import Component696 from '../components/Component696.jsx';
import Component697 from '../components/Component697.jsx';
import Component698 from '../components/Component698.jsx';
import Component699 from '../components/Component699.jsx';
import Component700 from '../components/Component700.jsx';
import '../styles/page70.css';

const initialState70 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer70(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource70(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 4) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page70() {
  const [seed, setSeed] = useState(630);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer70, initialState70);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 70,
    segment: 'S' + ((70 % 5) + 1),
    window: 8,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource70(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset70(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState70(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute70(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 70);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-70">
      <div className="header-70">
        <div>
          <h2>Page70</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-70">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-70">
        <div className="sidebar-70">
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

        <div className="content-70">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-70">
          <Component691 seed={seed + 1} title={'Page70-Component691'} />
          <Component692 seed={seed + 2} title={'Page70-Component692'} />
          <Component693 seed={seed + 3} title={'Page70-Component693'} />
          <Component694 seed={seed + 4} title={'Page70-Component694'} />
          </div>
          <div className="component-grid-70">
          <Component695 seed={seed + 7} title={'Page70-Widget695'} />
          <Component696 seed={seed + 8} title={'Page70-Widget696'} />
          <Component697 seed={seed + 9} title={'Page70-Widget697'} />
          <Component698 seed={seed + 10} title={'Page70-Widget698'} />
          <Component699 seed={seed + 11} title={'Page70-Widget699'} />
          <Component700 seed={seed + 12} title={'Page70-Widget700'} />
          </div>
        </div>
      </div>
    </div>
  );
}
