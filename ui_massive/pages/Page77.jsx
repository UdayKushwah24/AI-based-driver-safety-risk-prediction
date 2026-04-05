import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState77, heavyCompute77, transformDataset77 } from '../utils/compute77.js';
import Component761 from '../components/Component761.jsx';
import Component762 from '../components/Component762.jsx';
import Component763 from '../components/Component763.jsx';
import Component764 from '../components/Component764.jsx';
import Component765 from '../components/Component765.jsx';
import Component766 from '../components/Component766.jsx';
import Component767 from '../components/Component767.jsx';
import Component768 from '../components/Component768.jsx';
import Component769 from '../components/Component769.jsx';
import Component770 from '../components/Component770.jsx';
import '../styles/page77.css';

const initialState77 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer77(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource77(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page77() {
  const [seed, setSeed] = useState(693);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer77, initialState77);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 77,
    segment: 'S' + ((77 % 5) + 1),
    window: 9,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource77(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset77(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState77(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute77(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 77);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-77">
      <div className="header-77">
        <div>
          <h2>Page77</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-77">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-77">
        <div className="sidebar-77">
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

        <div className="content-77">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-77">
          <Component761 seed={seed + 1} title={'Page77-Component761'} />
          <Component762 seed={seed + 2} title={'Page77-Component762'} />
          <Component763 seed={seed + 3} title={'Page77-Component763'} />
          <Component764 seed={seed + 4} title={'Page77-Component764'} />
          </div>
          <div className="component-grid-77">
          <Component765 seed={seed + 7} title={'Page77-Widget765'} />
          <Component766 seed={seed + 8} title={'Page77-Widget766'} />
          <Component767 seed={seed + 9} title={'Page77-Widget767'} />
          <Component768 seed={seed + 10} title={'Page77-Widget768'} />
          <Component769 seed={seed + 11} title={'Page77-Widget769'} />
          <Component770 seed={seed + 12} title={'Page77-Widget770'} />
          </div>
        </div>
      </div>
    </div>
  );
}
