import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState63, heavyCompute63, transformDataset63 } from '../utils/compute63.js';
import Component621 from '../components/Component621.jsx';
import Component622 from '../components/Component622.jsx';
import Component623 from '../components/Component623.jsx';
import Component624 from '../components/Component624.jsx';
import Component625 from '../components/Component625.jsx';
import Component626 from '../components/Component626.jsx';
import Component627 from '../components/Component627.jsx';
import Component628 from '../components/Component628.jsx';
import Component629 from '../components/Component629.jsx';
import Component630 from '../components/Component630.jsx';
import '../styles/page63.css';

const initialState63 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer63(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource63(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 10) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page63() {
  const [seed, setSeed] = useState(567);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer63, initialState63);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 63,
    segment: 'S' + ((63 % 5) + 1),
    window: 7,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource63(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset63(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState63(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute63(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 63);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-63">
      <div className="header-63">
        <div>
          <h2>Page63</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-63">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-63">
        <div className="sidebar-63">
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

        <div className="content-63">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-63">
          <Component621 seed={seed + 1} title={'Page63-Component621'} />
          <Component622 seed={seed + 2} title={'Page63-Component622'} />
          <Component623 seed={seed + 3} title={'Page63-Component623'} />
          <Component624 seed={seed + 4} title={'Page63-Component624'} />
          </div>
          <div className="component-grid-63">
          <Component625 seed={seed + 7} title={'Page63-Widget625'} />
          <Component626 seed={seed + 8} title={'Page63-Widget626'} />
          <Component627 seed={seed + 9} title={'Page63-Widget627'} />
          <Component628 seed={seed + 10} title={'Page63-Widget628'} />
          <Component629 seed={seed + 11} title={'Page63-Widget629'} />
          <Component630 seed={seed + 12} title={'Page63-Widget630'} />
          </div>
        </div>
      </div>
    </div>
  );
}
