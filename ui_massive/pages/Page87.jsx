import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState87, heavyCompute87, transformDataset87 } from '../utils/compute87.js';
import Component861 from '../components/Component861.jsx';
import Component862 from '../components/Component862.jsx';
import Component863 from '../components/Component863.jsx';
import Component864 from '../components/Component864.jsx';
import Component865 from '../components/Component865.jsx';
import Component866 from '../components/Component866.jsx';
import Component867 from '../components/Component867.jsx';
import Component868 from '../components/Component868.jsx';
import Component869 from '../components/Component869.jsx';
import Component870 from '../components/Component870.jsx';
import '../styles/page87.css';

const initialState87 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer87(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource87(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page87() {
  const [seed, setSeed] = useState(783);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer87, initialState87);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 87,
    segment: 'S' + ((87 % 5) + 1),
    window: 7,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource87(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset87(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState87(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute87(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 87);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-87">
      <div className="header-87">
        <div>
          <h2>Page87</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-87">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-87">
        <div className="sidebar-87">
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

        <div className="content-87">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-87">
          <Component861 seed={seed + 1} title={'Page87-Component861'} />
          <Component862 seed={seed + 2} title={'Page87-Component862'} />
          <Component863 seed={seed + 3} title={'Page87-Component863'} />
          <Component864 seed={seed + 4} title={'Page87-Component864'} />
          </div>
          <div className="component-grid-87">
          <Component865 seed={seed + 7} title={'Page87-Widget865'} />
          <Component866 seed={seed + 8} title={'Page87-Widget866'} />
          <Component867 seed={seed + 9} title={'Page87-Widget867'} />
          <Component868 seed={seed + 10} title={'Page87-Widget868'} />
          <Component869 seed={seed + 11} title={'Page87-Widget869'} />
          <Component870 seed={seed + 12} title={'Page87-Widget870'} />
          </div>
        </div>
      </div>
    </div>
  );
}
