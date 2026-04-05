import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState39, heavyCompute39, transformDataset39 } from '../utils/compute39.js';
import Component381 from '../components/Component381.jsx';
import Component382 from '../components/Component382.jsx';
import Component383 from '../components/Component383.jsx';
import Component384 from '../components/Component384.jsx';
import Component385 from '../components/Component385.jsx';
import Component386 from '../components/Component386.jsx';
import Component387 from '../components/Component387.jsx';
import Component388 from '../components/Component388.jsx';
import Component389 from '../components/Component389.jsx';
import Component390 from '../components/Component390.jsx';
import '../styles/page39.css';

const initialState39 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer39(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource39(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page39() {
  const [seed, setSeed] = useState(351);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer39, initialState39);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 39,
    segment: 'S' + ((39 % 5) + 1),
    window: 7,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource39(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset39(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState39(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute39(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 39);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-39">
      <div className="header-39">
        <div>
          <h2>Page39</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-39">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-39">
        <div className="sidebar-39">
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

        <div className="content-39">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-39">
          <Component381 seed={seed + 1} title={'Page39-Component381'} />
          <Component382 seed={seed + 2} title={'Page39-Component382'} />
          <Component383 seed={seed + 3} title={'Page39-Component383'} />
          <Component384 seed={seed + 4} title={'Page39-Component384'} />
          </div>
          <div className="component-grid-39">
          <Component385 seed={seed + 7} title={'Page39-Widget385'} />
          <Component386 seed={seed + 8} title={'Page39-Widget386'} />
          <Component387 seed={seed + 9} title={'Page39-Widget387'} />
          <Component388 seed={seed + 10} title={'Page39-Widget388'} />
          <Component389 seed={seed + 11} title={'Page39-Widget389'} />
          <Component390 seed={seed + 12} title={'Page39-Widget390'} />
          </div>
        </div>
      </div>
    </div>
  );
}
