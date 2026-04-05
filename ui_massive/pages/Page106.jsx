import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState106, heavyCompute106, transformDataset106 } from '../utils/compute106.js';
import Component1051 from '../components/Component1051.jsx';
import Component1052 from '../components/Component1052.jsx';
import Component1053 from '../components/Component1053.jsx';
import Component1054 from '../components/Component1054.jsx';
import Component1055 from '../components/Component1055.jsx';
import Component1056 from '../components/Component1056.jsx';
import Component1057 from '../components/Component1057.jsx';
import Component1058 from '../components/Component1058.jsx';
import Component1059 from '../components/Component1059.jsx';
import Component1060 from '../components/Component1060.jsx';
import '../styles/page106.css';

const initialState106 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer106(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource106(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page106() {
  const [seed, setSeed] = useState(954);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer106, initialState106);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 106,
    segment: 'S' + ((106 % 5) + 1),
    window: 8,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource106(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset106(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState106(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute106(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 106);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-106">
      <div className="header-106">
        <div>
          <h2>Page106</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-106">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-106">
        <div className="sidebar-106">
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

        <div className="content-106">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-106">
          <Component1051 seed={seed + 1} title={'Page106-Component1051'} />
          <Component1052 seed={seed + 2} title={'Page106-Component1052'} />
          <Component1053 seed={seed + 3} title={'Page106-Component1053'} />
          <Component1054 seed={seed + 4} title={'Page106-Component1054'} />
          </div>
          <div className="component-grid-106">
          <Component1055 seed={seed + 7} title={'Page106-Widget1055'} />
          <Component1056 seed={seed + 8} title={'Page106-Widget1056'} />
          <Component1057 seed={seed + 9} title={'Page106-Widget1057'} />
          <Component1058 seed={seed + 10} title={'Page106-Widget1058'} />
          <Component1059 seed={seed + 11} title={'Page106-Widget1059'} />
          <Component1060 seed={seed + 12} title={'Page106-Widget1060'} />
          </div>
        </div>
      </div>
    </div>
  );
}
