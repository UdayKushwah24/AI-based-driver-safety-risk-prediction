import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState68, heavyCompute68, transformDataset68 } from '../utils/compute68.js';
import Component671 from '../components/Component671.jsx';
import Component672 from '../components/Component672.jsx';
import Component673 from '../components/Component673.jsx';
import Component674 from '../components/Component674.jsx';
import Component675 from '../components/Component675.jsx';
import Component676 from '../components/Component676.jsx';
import Component677 from '../components/Component677.jsx';
import Component678 from '../components/Component678.jsx';
import Component679 from '../components/Component679.jsx';
import Component680 from '../components/Component680.jsx';
import '../styles/page68.css';

const initialState68 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer68(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource68(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 7) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page68() {
  const [seed, setSeed] = useState(612);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer68, initialState68);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 68,
    segment: 'S' + ((68 % 5) + 1),
    window: 6,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource68(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset68(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState68(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute68(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 68);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-68">
      <div className="header-68">
        <div>
          <h2>Page68</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-68">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-68">
        <div className="sidebar-68">
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

        <div className="content-68">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-68">
          <Component671 seed={seed + 1} title={'Page68-Component671'} />
          <Component672 seed={seed + 2} title={'Page68-Component672'} />
          <Component673 seed={seed + 3} title={'Page68-Component673'} />
          <Component674 seed={seed + 4} title={'Page68-Component674'} />
          </div>
          <div className="component-grid-68">
          <Component675 seed={seed + 7} title={'Page68-Widget675'} />
          <Component676 seed={seed + 8} title={'Page68-Widget676'} />
          <Component677 seed={seed + 9} title={'Page68-Widget677'} />
          <Component678 seed={seed + 10} title={'Page68-Widget678'} />
          <Component679 seed={seed + 11} title={'Page68-Widget679'} />
          <Component680 seed={seed + 12} title={'Page68-Widget680'} />
          </div>
        </div>
      </div>
    </div>
  );
}
