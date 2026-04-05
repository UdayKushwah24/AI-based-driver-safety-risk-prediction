import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState37, heavyCompute37, transformDataset37 } from '../utils/compute37.js';
import Component361 from '../components/Component361.jsx';
import Component362 from '../components/Component362.jsx';
import Component363 from '../components/Component363.jsx';
import Component364 from '../components/Component364.jsx';
import Component365 from '../components/Component365.jsx';
import Component366 from '../components/Component366.jsx';
import Component367 from '../components/Component367.jsx';
import Component368 from '../components/Component368.jsx';
import Component369 from '../components/Component369.jsx';
import Component370 from '../components/Component370.jsx';
import '../styles/page37.css';

const initialState37 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer37(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource37(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 11) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page37() {
  const [seed, setSeed] = useState(333);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer37, initialState37);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 37,
    segment: 'S' + ((37 % 5) + 1),
    window: 5,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource37(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset37(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState37(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute37(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 37);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-37">
      <div className="header-37">
        <div>
          <h2>Page37</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-37">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-37">
        <div className="sidebar-37">
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

        <div className="content-37">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-37">
          <Component361 seed={seed + 1} title={'Page37-Component361'} />
          <Component362 seed={seed + 2} title={'Page37-Component362'} />
          <Component363 seed={seed + 3} title={'Page37-Component363'} />
          <Component364 seed={seed + 4} title={'Page37-Component364'} />
          </div>
          <div className="component-grid-37">
          <Component365 seed={seed + 7} title={'Page37-Widget365'} />
          <Component366 seed={seed + 8} title={'Page37-Widget366'} />
          <Component367 seed={seed + 9} title={'Page37-Widget367'} />
          <Component368 seed={seed + 10} title={'Page37-Widget368'} />
          <Component369 seed={seed + 11} title={'Page37-Widget369'} />
          <Component370 seed={seed + 12} title={'Page37-Widget370'} />
          </div>
        </div>
      </div>
    </div>
  );
}
