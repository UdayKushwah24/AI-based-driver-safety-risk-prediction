import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState88, heavyCompute88, transformDataset88 } from '../utils/compute88.js';
import Component871 from '../components/Component871.jsx';
import Component872 from '../components/Component872.jsx';
import Component873 from '../components/Component873.jsx';
import Component874 from '../components/Component874.jsx';
import Component875 from '../components/Component875.jsx';
import Component876 from '../components/Component876.jsx';
import Component877 from '../components/Component877.jsx';
import Component878 from '../components/Component878.jsx';
import Component879 from '../components/Component879.jsx';
import Component880 from '../components/Component880.jsx';
import '../styles/page88.css';

const initialState88 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer88(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource88(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page88() {
  const [seed, setSeed] = useState(792);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer88, initialState88);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 88,
    segment: 'S' + ((88 % 5) + 1),
    window: 8,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource88(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset88(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState88(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute88(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 88);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-88">
      <div className="header-88">
        <div>
          <h2>Page88</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-88">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-88">
        <div className="sidebar-88">
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

        <div className="content-88">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-88">
          <Component871 seed={seed + 1} title={'Page88-Component871'} />
          <Component872 seed={seed + 2} title={'Page88-Component872'} />
          <Component873 seed={seed + 3} title={'Page88-Component873'} />
          <Component874 seed={seed + 4} title={'Page88-Component874'} />
          </div>
          <div className="component-grid-88">
          <Component875 seed={seed + 7} title={'Page88-Widget875'} />
          <Component876 seed={seed + 8} title={'Page88-Widget876'} />
          <Component877 seed={seed + 9} title={'Page88-Widget877'} />
          <Component878 seed={seed + 10} title={'Page88-Widget878'} />
          <Component879 seed={seed + 11} title={'Page88-Widget879'} />
          <Component880 seed={seed + 12} title={'Page88-Widget880'} />
          </div>
        </div>
      </div>
    </div>
  );
}
