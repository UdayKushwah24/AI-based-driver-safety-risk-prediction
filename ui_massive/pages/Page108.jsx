import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState108, heavyCompute108, transformDataset108 } from '../utils/compute108.js';
import Component1071 from '../components/Component1071.jsx';
import Component1072 from '../components/Component1072.jsx';
import Component1073 from '../components/Component1073.jsx';
import Component1074 from '../components/Component1074.jsx';
import Component1075 from '../components/Component1075.jsx';
import Component1076 from '../components/Component1076.jsx';
import Component1077 from '../components/Component1077.jsx';
import Component1078 from '../components/Component1078.jsx';
import Component1079 from '../components/Component1079.jsx';
import Component1080 from '../components/Component1080.jsx';
import '../styles/page108.css';

const initialState108 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer108(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource108(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page108() {
  const [seed, setSeed] = useState(972);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer108, initialState108);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 108,
    segment: 'S' + ((108 % 5) + 1),
    window: 4,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource108(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset108(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState108(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute108(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 108);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-108">
      <div className="header-108">
        <div>
          <h2>Page108</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-108">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-108">
        <div className="sidebar-108">
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

        <div className="content-108">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-108">
          <Component1071 seed={seed + 1} title={'Page108-Component1071'} />
          <Component1072 seed={seed + 2} title={'Page108-Component1072'} />
          <Component1073 seed={seed + 3} title={'Page108-Component1073'} />
          <Component1074 seed={seed + 4} title={'Page108-Component1074'} />
          </div>
          <div className="component-grid-108">
          <Component1075 seed={seed + 7} title={'Page108-Widget1075'} />
          <Component1076 seed={seed + 8} title={'Page108-Widget1076'} />
          <Component1077 seed={seed + 9} title={'Page108-Widget1077'} />
          <Component1078 seed={seed + 10} title={'Page108-Widget1078'} />
          <Component1079 seed={seed + 11} title={'Page108-Widget1079'} />
          <Component1080 seed={seed + 12} title={'Page108-Widget1080'} />
          </div>
        </div>
      </div>
    </div>
  );
}
