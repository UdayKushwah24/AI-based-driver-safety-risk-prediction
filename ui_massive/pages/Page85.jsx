import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState85, heavyCompute85, transformDataset85 } from '../utils/compute85.js';
import Component841 from '../components/Component841.jsx';
import Component842 from '../components/Component842.jsx';
import Component843 from '../components/Component843.jsx';
import Component844 from '../components/Component844.jsx';
import Component845 from '../components/Component845.jsx';
import Component846 from '../components/Component846.jsx';
import Component847 from '../components/Component847.jsx';
import Component848 from '../components/Component848.jsx';
import Component849 from '../components/Component849.jsx';
import Component850 from '../components/Component850.jsx';
import '../styles/page85.css';

const initialState85 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer85(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource85(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page85() {
  const [seed, setSeed] = useState(765);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer85, initialState85);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 85,
    segment: 'S' + ((85 % 5) + 1),
    window: 5,
    offset: 3,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource85(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset85(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState85(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute85(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 85);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-85">
      <div className="header-85">
        <div>
          <h2>Page85</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-85">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-85">
        <div className="sidebar-85">
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

        <div className="content-85">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-85">
          <Component841 seed={seed + 1} title={'Page85-Component841'} />
          <Component842 seed={seed + 2} title={'Page85-Component842'} />
          <Component843 seed={seed + 3} title={'Page85-Component843'} />
          <Component844 seed={seed + 4} title={'Page85-Component844'} />
          </div>
          <div className="component-grid-85">
          <Component845 seed={seed + 7} title={'Page85-Widget845'} />
          <Component846 seed={seed + 8} title={'Page85-Widget846'} />
          <Component847 seed={seed + 9} title={'Page85-Widget847'} />
          <Component848 seed={seed + 10} title={'Page85-Widget848'} />
          <Component849 seed={seed + 11} title={'Page85-Widget849'} />
          <Component850 seed={seed + 12} title={'Page85-Widget850'} />
          </div>
        </div>
      </div>
    </div>
  );
}
