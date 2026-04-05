import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState51, heavyCompute51, transformDataset51 } from '../utils/compute51.js';
import Component501 from '../components/Component501.jsx';
import Component502 from '../components/Component502.jsx';
import Component503 from '../components/Component503.jsx';
import Component504 from '../components/Component504.jsx';
import Component505 from '../components/Component505.jsx';
import Component506 from '../components/Component506.jsx';
import Component507 from '../components/Component507.jsx';
import Component508 from '../components/Component508.jsx';
import Component509 from '../components/Component509.jsx';
import Component510 from '../components/Component510.jsx';
import '../styles/page51.css';

const initialState51 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer51(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource51(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page51() {
  const [seed, setSeed] = useState(459);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer51, initialState51);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 51,
    segment: 'S' + ((51 % 5) + 1),
    window: 7,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource51(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset51(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState51(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute51(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 51);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-51">
      <div className="header-51">
        <div>
          <h2>Page51</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-51">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-51">
        <div className="sidebar-51">
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

        <div className="content-51">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-51">
          <Component501 seed={seed + 1} title={'Page51-Component501'} />
          <Component502 seed={seed + 2} title={'Page51-Component502'} />
          <Component503 seed={seed + 3} title={'Page51-Component503'} />
          <Component504 seed={seed + 4} title={'Page51-Component504'} />
          </div>
          <div className="component-grid-51">
          <Component505 seed={seed + 7} title={'Page51-Widget505'} />
          <Component506 seed={seed + 8} title={'Page51-Widget506'} />
          <Component507 seed={seed + 9} title={'Page51-Widget507'} />
          <Component508 seed={seed + 10} title={'Page51-Widget508'} />
          <Component509 seed={seed + 11} title={'Page51-Widget509'} />
          <Component510 seed={seed + 12} title={'Page51-Widget510'} />
          </div>
        </div>
      </div>
    </div>
  );
}
