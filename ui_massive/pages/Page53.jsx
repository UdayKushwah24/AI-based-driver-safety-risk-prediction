import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState53, heavyCompute53, transformDataset53 } from '../utils/compute53.js';
import Component521 from '../components/Component521.jsx';
import Component522 from '../components/Component522.jsx';
import Component523 from '../components/Component523.jsx';
import Component524 from '../components/Component524.jsx';
import Component525 from '../components/Component525.jsx';
import Component526 from '../components/Component526.jsx';
import Component527 from '../components/Component527.jsx';
import Component528 from '../components/Component528.jsx';
import Component529 from '../components/Component529.jsx';
import Component530 from '../components/Component530.jsx';
import '../styles/page53.css';

const initialState53 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer53(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource53(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 7) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page53() {
  const [seed, setSeed] = useState(477);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer53, initialState53);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 53,
    segment: 'S' + ((53 % 5) + 1),
    window: 9,
    offset: 6,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource53(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset53(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState53(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute53(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 53);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-53">
      <div className="header-53">
        <div>
          <h2>Page53</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-53">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-53">
        <div className="sidebar-53">
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

        <div className="content-53">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-53">
          <Component521 seed={seed + 1} title={'Page53-Component521'} />
          <Component522 seed={seed + 2} title={'Page53-Component522'} />
          <Component523 seed={seed + 3} title={'Page53-Component523'} />
          <Component524 seed={seed + 4} title={'Page53-Component524'} />
          </div>
          <div className="component-grid-53">
          <Component525 seed={seed + 7} title={'Page53-Widget525'} />
          <Component526 seed={seed + 8} title={'Page53-Widget526'} />
          <Component527 seed={seed + 9} title={'Page53-Widget527'} />
          <Component528 seed={seed + 10} title={'Page53-Widget528'} />
          <Component529 seed={seed + 11} title={'Page53-Widget529'} />
          <Component530 seed={seed + 12} title={'Page53-Widget530'} />
          </div>
        </div>
      </div>
    </div>
  );
}
