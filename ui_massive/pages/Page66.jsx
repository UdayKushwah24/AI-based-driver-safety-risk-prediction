import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState66, heavyCompute66, transformDataset66 } from '../utils/compute66.js';
import Component651 from '../components/Component651.jsx';
import Component652 from '../components/Component652.jsx';
import Component653 from '../components/Component653.jsx';
import Component654 from '../components/Component654.jsx';
import Component655 from '../components/Component655.jsx';
import Component656 from '../components/Component656.jsx';
import Component657 from '../components/Component657.jsx';
import Component658 from '../components/Component658.jsx';
import Component659 from '../components/Component659.jsx';
import Component660 from '../components/Component660.jsx';
import '../styles/page66.css';

const initialState66 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer66(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource66(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 10) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page66() {
  const [seed, setSeed] = useState(594);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer66, initialState66);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 66,
    segment: 'S' + ((66 % 5) + 1),
    window: 4,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource66(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset66(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState66(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute66(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 66);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-66">
      <div className="header-66">
        <div>
          <h2>Page66</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-66">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-66">
        <div className="sidebar-66">
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

        <div className="content-66">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-66">
          <Component651 seed={seed + 1} title={'Page66-Component651'} />
          <Component652 seed={seed + 2} title={'Page66-Component652'} />
          <Component653 seed={seed + 3} title={'Page66-Component653'} />
          <Component654 seed={seed + 4} title={'Page66-Component654'} />
          </div>
          <div className="component-grid-66">
          <Component655 seed={seed + 7} title={'Page66-Widget655'} />
          <Component656 seed={seed + 8} title={'Page66-Widget656'} />
          <Component657 seed={seed + 9} title={'Page66-Widget657'} />
          <Component658 seed={seed + 10} title={'Page66-Widget658'} />
          <Component659 seed={seed + 11} title={'Page66-Widget659'} />
          <Component660 seed={seed + 12} title={'Page66-Widget660'} />
          </div>
        </div>
      </div>
    </div>
  );
}
