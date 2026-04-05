import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState65, heavyCompute65, transformDataset65 } from '../utils/compute65.js';
import Component641 from '../components/Component641.jsx';
import Component642 from '../components/Component642.jsx';
import Component643 from '../components/Component643.jsx';
import Component644 from '../components/Component644.jsx';
import Component645 from '../components/Component645.jsx';
import Component646 from '../components/Component646.jsx';
import Component647 from '../components/Component647.jsx';
import Component648 from '../components/Component648.jsx';
import Component649 from '../components/Component649.jsx';
import Component650 from '../components/Component650.jsx';
import '../styles/page65.css';

const initialState65 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer65(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource65(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page65() {
  const [seed, setSeed] = useState(585);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer65, initialState65);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 65,
    segment: 'S' + ((65 % 5) + 1),
    window: 9,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource65(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset65(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState65(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute65(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 65);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-65">
      <div className="header-65">
        <div>
          <h2>Page65</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-65">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-65">
        <div className="sidebar-65">
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

        <div className="content-65">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-65">
          <Component641 seed={seed + 1} title={'Page65-Component641'} />
          <Component642 seed={seed + 2} title={'Page65-Component642'} />
          <Component643 seed={seed + 3} title={'Page65-Component643'} />
          <Component644 seed={seed + 4} title={'Page65-Component644'} />
          </div>
          <div className="component-grid-65">
          <Component645 seed={seed + 7} title={'Page65-Widget645'} />
          <Component646 seed={seed + 8} title={'Page65-Widget646'} />
          <Component647 seed={seed + 9} title={'Page65-Widget647'} />
          <Component648 seed={seed + 10} title={'Page65-Widget648'} />
          <Component649 seed={seed + 11} title={'Page65-Widget649'} />
          <Component650 seed={seed + 12} title={'Page65-Widget650'} />
          </div>
        </div>
      </div>
    </div>
  );
}
