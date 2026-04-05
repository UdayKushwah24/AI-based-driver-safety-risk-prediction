import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState91, heavyCompute91, transformDataset91 } from '../utils/compute91.js';
import Component901 from '../components/Component901.jsx';
import Component902 from '../components/Component902.jsx';
import Component903 from '../components/Component903.jsx';
import Component904 from '../components/Component904.jsx';
import Component905 from '../components/Component905.jsx';
import Component906 from '../components/Component906.jsx';
import Component907 from '../components/Component907.jsx';
import Component908 from '../components/Component908.jsx';
import Component909 from '../components/Component909.jsx';
import Component910 from '../components/Component910.jsx';
import '../styles/page91.css';

const initialState91 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer91(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource91(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page91() {
  const [seed, setSeed] = useState(819);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer91, initialState91);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 91,
    segment: 'S' + ((91 % 5) + 1),
    window: 5,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource91(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset91(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState91(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute91(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 91);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-91">
      <div className="header-91">
        <div>
          <h2>Page91</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-91">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-91">
        <div className="sidebar-91">
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

        <div className="content-91">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-91">
          <Component901 seed={seed + 1} title={'Page91-Component901'} />
          <Component902 seed={seed + 2} title={'Page91-Component902'} />
          <Component903 seed={seed + 3} title={'Page91-Component903'} />
          <Component904 seed={seed + 4} title={'Page91-Component904'} />
          </div>
          <div className="component-grid-91">
          <Component905 seed={seed + 7} title={'Page91-Widget905'} />
          <Component906 seed={seed + 8} title={'Page91-Widget906'} />
          <Component907 seed={seed + 9} title={'Page91-Widget907'} />
          <Component908 seed={seed + 10} title={'Page91-Widget908'} />
          <Component909 seed={seed + 11} title={'Page91-Widget909'} />
          <Component910 seed={seed + 12} title={'Page91-Widget910'} />
          </div>
        </div>
      </div>
    </div>
  );
}
