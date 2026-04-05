import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState107, heavyCompute107, transformDataset107 } from '../utils/compute107.js';
import Component1061 from '../components/Component1061.jsx';
import Component1062 from '../components/Component1062.jsx';
import Component1063 from '../components/Component1063.jsx';
import Component1064 from '../components/Component1064.jsx';
import Component1065 from '../components/Component1065.jsx';
import Component1066 from '../components/Component1066.jsx';
import Component1067 from '../components/Component1067.jsx';
import Component1068 from '../components/Component1068.jsx';
import Component1069 from '../components/Component1069.jsx';
import Component1070 from '../components/Component1070.jsx';
import '../styles/page107.css';

const initialState107 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer107(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource107(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page107() {
  const [seed, setSeed] = useState(963);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer107, initialState107);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 107,
    segment: 'S' + ((107 % 5) + 1),
    window: 9,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource107(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset107(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState107(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute107(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 107);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-107">
      <div className="header-107">
        <div>
          <h2>Page107</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-107">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-107">
        <div className="sidebar-107">
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

        <div className="content-107">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-107">
          <Component1061 seed={seed + 1} title={'Page107-Component1061'} />
          <Component1062 seed={seed + 2} title={'Page107-Component1062'} />
          <Component1063 seed={seed + 3} title={'Page107-Component1063'} />
          <Component1064 seed={seed + 4} title={'Page107-Component1064'} />
          </div>
          <div className="component-grid-107">
          <Component1065 seed={seed + 7} title={'Page107-Widget1065'} />
          <Component1066 seed={seed + 8} title={'Page107-Widget1066'} />
          <Component1067 seed={seed + 9} title={'Page107-Widget1067'} />
          <Component1068 seed={seed + 10} title={'Page107-Widget1068'} />
          <Component1069 seed={seed + 11} title={'Page107-Widget1069'} />
          <Component1070 seed={seed + 12} title={'Page107-Widget1070'} />
          </div>
        </div>
      </div>
    </div>
  );
}
