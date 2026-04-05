import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState73, heavyCompute73, transformDataset73 } from '../utils/compute73.js';
import Component721 from '../components/Component721.jsx';
import Component722 from '../components/Component722.jsx';
import Component723 from '../components/Component723.jsx';
import Component724 from '../components/Component724.jsx';
import Component725 from '../components/Component725.jsx';
import Component726 from '../components/Component726.jsx';
import Component727 from '../components/Component727.jsx';
import Component728 from '../components/Component728.jsx';
import Component729 from '../components/Component729.jsx';
import Component730 from '../components/Component730.jsx';
import '../styles/page73.css';

const initialState73 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer73(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource73(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page73() {
  const [seed, setSeed] = useState(657);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer73, initialState73);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 73,
    segment: 'S' + ((73 % 5) + 1),
    window: 5,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource73(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset73(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState73(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute73(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 73);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-73">
      <div className="header-73">
        <div>
          <h2>Page73</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-73">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-73">
        <div className="sidebar-73">
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

        <div className="content-73">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-73">
          <Component721 seed={seed + 1} title={'Page73-Component721'} />
          <Component722 seed={seed + 2} title={'Page73-Component722'} />
          <Component723 seed={seed + 3} title={'Page73-Component723'} />
          <Component724 seed={seed + 4} title={'Page73-Component724'} />
          </div>
          <div className="component-grid-73">
          <Component725 seed={seed + 7} title={'Page73-Widget725'} />
          <Component726 seed={seed + 8} title={'Page73-Widget726'} />
          <Component727 seed={seed + 9} title={'Page73-Widget727'} />
          <Component728 seed={seed + 10} title={'Page73-Widget728'} />
          <Component729 seed={seed + 11} title={'Page73-Widget729'} />
          <Component730 seed={seed + 12} title={'Page73-Widget730'} />
          </div>
        </div>
      </div>
    </div>
  );
}
