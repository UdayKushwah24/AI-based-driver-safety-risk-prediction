import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState97, heavyCompute97, transformDataset97 } from '../utils/compute97.js';
import Component961 from '../components/Component961.jsx';
import Component962 from '../components/Component962.jsx';
import Component963 from '../components/Component963.jsx';
import Component964 from '../components/Component964.jsx';
import Component965 from '../components/Component965.jsx';
import Component966 from '../components/Component966.jsx';
import Component967 from '../components/Component967.jsx';
import Component968 from '../components/Component968.jsx';
import Component969 from '../components/Component969.jsx';
import Component970 from '../components/Component970.jsx';
import '../styles/page97.css';

const initialState97 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer97(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource97(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page97() {
  const [seed, setSeed] = useState(873);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer97, initialState97);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 97,
    segment: 'S' + ((97 % 5) + 1),
    window: 5,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource97(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset97(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState97(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute97(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 97);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-97">
      <div className="header-97">
        <div>
          <h2>Page97</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-97">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-97">
        <div className="sidebar-97">
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

        <div className="content-97">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-97">
          <Component961 seed={seed + 1} title={'Page97-Component961'} />
          <Component962 seed={seed + 2} title={'Page97-Component962'} />
          <Component963 seed={seed + 3} title={'Page97-Component963'} />
          <Component964 seed={seed + 4} title={'Page97-Component964'} />
          </div>
          <div className="component-grid-97">
          <Component965 seed={seed + 7} title={'Page97-Widget965'} />
          <Component966 seed={seed + 8} title={'Page97-Widget966'} />
          <Component967 seed={seed + 9} title={'Page97-Widget967'} />
          <Component968 seed={seed + 10} title={'Page97-Widget968'} />
          <Component969 seed={seed + 11} title={'Page97-Widget969'} />
          <Component970 seed={seed + 12} title={'Page97-Widget970'} />
          </div>
        </div>
      </div>
    </div>
  );
}
