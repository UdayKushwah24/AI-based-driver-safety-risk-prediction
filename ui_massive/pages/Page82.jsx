import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState82, heavyCompute82, transformDataset82 } from '../utils/compute82.js';
import Component811 from '../components/Component811.jsx';
import Component812 from '../components/Component812.jsx';
import Component813 from '../components/Component813.jsx';
import Component814 from '../components/Component814.jsx';
import Component815 from '../components/Component815.jsx';
import Component816 from '../components/Component816.jsx';
import Component817 from '../components/Component817.jsx';
import Component818 from '../components/Component818.jsx';
import Component819 from '../components/Component819.jsx';
import Component820 from '../components/Component820.jsx';
import '../styles/page82.css';

const initialState82 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer82(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource82(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 5) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page82() {
  const [seed, setSeed] = useState(738);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer82, initialState82);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 82,
    segment: 'S' + ((82 % 5) + 1),
    window: 8,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource82(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset82(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState82(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute82(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 82);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-82">
      <div className="header-82">
        <div>
          <h2>Page82</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-82">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-82">
        <div className="sidebar-82">
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

        <div className="content-82">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-82">
          <Component811 seed={seed + 1} title={'Page82-Component811'} />
          <Component812 seed={seed + 2} title={'Page82-Component812'} />
          <Component813 seed={seed + 3} title={'Page82-Component813'} />
          <Component814 seed={seed + 4} title={'Page82-Component814'} />
          </div>
          <div className="component-grid-82">
          <Component815 seed={seed + 7} title={'Page82-Widget815'} />
          <Component816 seed={seed + 8} title={'Page82-Widget816'} />
          <Component817 seed={seed + 9} title={'Page82-Widget817'} />
          <Component818 seed={seed + 10} title={'Page82-Widget818'} />
          <Component819 seed={seed + 11} title={'Page82-Widget819'} />
          <Component820 seed={seed + 12} title={'Page82-Widget820'} />
          </div>
        </div>
      </div>
    </div>
  );
}
