import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState109, heavyCompute109, transformDataset109 } from '../utils/compute109.js';
import Component1081 from '../components/Component1081.jsx';
import Component1082 from '../components/Component1082.jsx';
import Component1083 from '../components/Component1083.jsx';
import Component1084 from '../components/Component1084.jsx';
import Component1085 from '../components/Component1085.jsx';
import Component1086 from '../components/Component1086.jsx';
import Component1087 from '../components/Component1087.jsx';
import Component1088 from '../components/Component1088.jsx';
import Component1089 from '../components/Component1089.jsx';
import Component1090 from '../components/Component1090.jsx';
import '../styles/page109.css';

const initialState109 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer109(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource109(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page109() {
  const [seed, setSeed] = useState(981);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer109, initialState109);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 109,
    segment: 'S' + ((109 % 5) + 1),
    window: 5,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource109(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset109(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState109(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute109(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 109);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-109">
      <div className="header-109">
        <div>
          <h2>Page109</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-109">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-109">
        <div className="sidebar-109">
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

        <div className="content-109">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-109">
          <Component1081 seed={seed + 1} title={'Page109-Component1081'} />
          <Component1082 seed={seed + 2} title={'Page109-Component1082'} />
          <Component1083 seed={seed + 3} title={'Page109-Component1083'} />
          <Component1084 seed={seed + 4} title={'Page109-Component1084'} />
          </div>
          <div className="component-grid-109">
          <Component1085 seed={seed + 7} title={'Page109-Widget1085'} />
          <Component1086 seed={seed + 8} title={'Page109-Widget1086'} />
          <Component1087 seed={seed + 9} title={'Page109-Widget1087'} />
          <Component1088 seed={seed + 10} title={'Page109-Widget1088'} />
          <Component1089 seed={seed + 11} title={'Page109-Widget1089'} />
          <Component1090 seed={seed + 12} title={'Page109-Widget1090'} />
          </div>
        </div>
      </div>
    </div>
  );
}
