import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState15, heavyCompute15, transformDataset15 } from '../utils/compute15.js';
import Component141 from '../components/Component141.jsx';
import Component142 from '../components/Component142.jsx';
import Component143 from '../components/Component143.jsx';
import Component144 from '../components/Component144.jsx';
import Component145 from '../components/Component145.jsx';
import Component146 from '../components/Component146.jsx';
import Component147 from '../components/Component147.jsx';
import Component148 from '../components/Component148.jsx';
import Component149 from '../components/Component149.jsx';
import Component150 from '../components/Component150.jsx';
import '../styles/page15.css';

const initialState15 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer15(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource15(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page15() {
  const [seed, setSeed] = useState(135);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer15, initialState15);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 15,
    segment: 'S' + ((15 % 5) + 1),
    window: 7,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource15(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset15(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState15(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute15(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 15);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-15">
      <div className="header-15">
        <div>
          <h2>Page15</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-15">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-15">
        <div className="sidebar-15">
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

        <div className="content-15">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-15">
          <Component141 seed={seed + 1} title={'Page15-Component141'} />
          <Component142 seed={seed + 2} title={'Page15-Component142'} />
          <Component143 seed={seed + 3} title={'Page15-Component143'} />
          <Component144 seed={seed + 4} title={'Page15-Component144'} />
          </div>
          <div className="component-grid-15">
          <Component145 seed={seed + 7} title={'Page15-Widget145'} />
          <Component146 seed={seed + 8} title={'Page15-Widget146'} />
          <Component147 seed={seed + 9} title={'Page15-Widget147'} />
          <Component148 seed={seed + 10} title={'Page15-Widget148'} />
          <Component149 seed={seed + 11} title={'Page15-Widget149'} />
          <Component150 seed={seed + 12} title={'Page15-Widget150'} />
          </div>
        </div>
      </div>
    </div>
  );
}
