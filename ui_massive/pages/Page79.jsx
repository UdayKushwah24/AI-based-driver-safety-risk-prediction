import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState79, heavyCompute79, transformDataset79 } from '../utils/compute79.js';
import Component781 from '../components/Component781.jsx';
import Component782 from '../components/Component782.jsx';
import Component783 from '../components/Component783.jsx';
import Component784 from '../components/Component784.jsx';
import Component785 from '../components/Component785.jsx';
import Component786 from '../components/Component786.jsx';
import Component787 from '../components/Component787.jsx';
import Component788 from '../components/Component788.jsx';
import Component789 from '../components/Component789.jsx';
import Component790 from '../components/Component790.jsx';
import '../styles/page79.css';

const initialState79 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer79(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource79(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page79() {
  const [seed, setSeed] = useState(711);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer79, initialState79);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 79,
    segment: 'S' + ((79 % 5) + 1),
    window: 5,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource79(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset79(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState79(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute79(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 79);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-79">
      <div className="header-79">
        <div>
          <h2>Page79</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-79">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-79">
        <div className="sidebar-79">
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

        <div className="content-79">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-79">
          <Component781 seed={seed + 1} title={'Page79-Component781'} />
          <Component782 seed={seed + 2} title={'Page79-Component782'} />
          <Component783 seed={seed + 3} title={'Page79-Component783'} />
          <Component784 seed={seed + 4} title={'Page79-Component784'} />
          </div>
          <div className="component-grid-79">
          <Component785 seed={seed + 7} title={'Page79-Widget785'} />
          <Component786 seed={seed + 8} title={'Page79-Widget786'} />
          <Component787 seed={seed + 9} title={'Page79-Widget787'} />
          <Component788 seed={seed + 10} title={'Page79-Widget788'} />
          <Component789 seed={seed + 11} title={'Page79-Widget789'} />
          <Component790 seed={seed + 12} title={'Page79-Widget790'} />
          </div>
        </div>
      </div>
    </div>
  );
}
