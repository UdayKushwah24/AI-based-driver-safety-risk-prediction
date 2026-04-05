import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState121, heavyCompute121, transformDataset121 } from '../utils/compute121.js';
import Component101 from '../components/Component101.jsx';
import Component102 from '../components/Component102.jsx';
import Component103 from '../components/Component103.jsx';
import Component104 from '../components/Component104.jsx';
import Component105 from '../components/Component105.jsx';
import Component106 from '../components/Component106.jsx';
import Component107 from '../components/Component107.jsx';
import Component108 from '../components/Component108.jsx';
import Component109 from '../components/Component109.jsx';
import Component110 from '../components/Component110.jsx';
import '../styles/page121.css';

const initialState121 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer121(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource121(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page121() {
  const [seed, setSeed] = useState(1089);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer121, initialState121);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 121,
    segment: 'S' + ((121 % 5) + 1),
    window: 5,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource121(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset121(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState121(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute121(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 121);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-121">
      <div className="header-121">
        <div>
          <h2>Page121</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-121">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-121">
        <div className="sidebar-121">
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

        <div className="content-121">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-121">
          <Component101 seed={seed + 1} title={'Page121-Component101'} />
          <Component102 seed={seed + 2} title={'Page121-Component102'} />
          <Component103 seed={seed + 3} title={'Page121-Component103'} />
          <Component104 seed={seed + 4} title={'Page121-Component104'} />
          </div>
          <div className="component-grid-121">
          <Component105 seed={seed + 7} title={'Page121-Widget105'} />
          <Component106 seed={seed + 8} title={'Page121-Widget106'} />
          <Component107 seed={seed + 9} title={'Page121-Widget107'} />
          <Component108 seed={seed + 10} title={'Page121-Widget108'} />
          <Component109 seed={seed + 11} title={'Page121-Widget109'} />
          <Component110 seed={seed + 12} title={'Page121-Widget110'} />
          </div>
        </div>
      </div>
    </div>
  );
}
