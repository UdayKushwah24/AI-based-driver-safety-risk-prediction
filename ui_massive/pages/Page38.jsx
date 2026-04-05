import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState38, heavyCompute38, transformDataset38 } from '../utils/compute38.js';
import Component371 from '../components/Component371.jsx';
import Component372 from '../components/Component372.jsx';
import Component373 from '../components/Component373.jsx';
import Component374 from '../components/Component374.jsx';
import Component375 from '../components/Component375.jsx';
import Component376 from '../components/Component376.jsx';
import Component377 from '../components/Component377.jsx';
import Component378 from '../components/Component378.jsx';
import Component379 from '../components/Component379.jsx';
import Component380 from '../components/Component380.jsx';
import '../styles/page38.css';

const initialState38 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer38(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource38(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 9) * 16;
    const drift = Math.cos((idx + seed) / 12) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page38() {
  const [seed, setSeed] = useState(342);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer38, initialState38);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 38,
    segment: 'S' + ((38 % 5) + 1),
    window: 6,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource38(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset38(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState38(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute38(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 38);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-38">
      <div className="header-38">
        <div>
          <h2>Page38</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-38">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-38">
        <div className="sidebar-38">
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

        <div className="content-38">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-38">
          <Component371 seed={seed + 1} title={'Page38-Component371'} />
          <Component372 seed={seed + 2} title={'Page38-Component372'} />
          <Component373 seed={seed + 3} title={'Page38-Component373'} />
          <Component374 seed={seed + 4} title={'Page38-Component374'} />
          </div>
          <div className="component-grid-38">
          <Component375 seed={seed + 7} title={'Page38-Widget375'} />
          <Component376 seed={seed + 8} title={'Page38-Widget376'} />
          <Component377 seed={seed + 9} title={'Page38-Widget377'} />
          <Component378 seed={seed + 10} title={'Page38-Widget378'} />
          <Component379 seed={seed + 11} title={'Page38-Widget379'} />
          <Component380 seed={seed + 12} title={'Page38-Widget380'} />
          </div>
        </div>
      </div>
    </div>
  );
}
