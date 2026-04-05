import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState75, heavyCompute75, transformDataset75 } from '../utils/compute75.js';
import Component741 from '../components/Component741.jsx';
import Component742 from '../components/Component742.jsx';
import Component743 from '../components/Component743.jsx';
import Component744 from '../components/Component744.jsx';
import Component745 from '../components/Component745.jsx';
import Component746 from '../components/Component746.jsx';
import Component747 from '../components/Component747.jsx';
import Component748 from '../components/Component748.jsx';
import Component749 from '../components/Component749.jsx';
import Component750 from '../components/Component750.jsx';
import '../styles/page75.css';

const initialState75 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer75(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource75(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page75() {
  const [seed, setSeed] = useState(675);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer75, initialState75);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 75,
    segment: 'S' + ((75 % 5) + 1),
    window: 7,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource75(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset75(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState75(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute75(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 75);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-75">
      <div className="header-75">
        <div>
          <h2>Page75</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-75">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-75">
        <div className="sidebar-75">
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

        <div className="content-75">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-75">
          <Component741 seed={seed + 1} title={'Page75-Component741'} />
          <Component742 seed={seed + 2} title={'Page75-Component742'} />
          <Component743 seed={seed + 3} title={'Page75-Component743'} />
          <Component744 seed={seed + 4} title={'Page75-Component744'} />
          </div>
          <div className="component-grid-75">
          <Component745 seed={seed + 7} title={'Page75-Widget745'} />
          <Component746 seed={seed + 8} title={'Page75-Widget746'} />
          <Component747 seed={seed + 9} title={'Page75-Widget747'} />
          <Component748 seed={seed + 10} title={'Page75-Widget748'} />
          <Component749 seed={seed + 11} title={'Page75-Widget749'} />
          <Component750 seed={seed + 12} title={'Page75-Widget750'} />
          </div>
        </div>
      </div>
    </div>
  );
}
