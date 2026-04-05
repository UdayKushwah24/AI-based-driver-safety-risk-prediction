import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState69, heavyCompute69, transformDataset69 } from '../utils/compute69.js';
import Component681 from '../components/Component681.jsx';
import Component682 from '../components/Component682.jsx';
import Component683 from '../components/Component683.jsx';
import Component684 from '../components/Component684.jsx';
import Component685 from '../components/Component685.jsx';
import Component686 from '../components/Component686.jsx';
import Component687 from '../components/Component687.jsx';
import Component688 from '../components/Component688.jsx';
import Component689 from '../components/Component689.jsx';
import Component690 from '../components/Component690.jsx';
import '../styles/page69.css';

const initialState69 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer69(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource69(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page69() {
  const [seed, setSeed] = useState(621);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer69, initialState69);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 69,
    segment: 'S' + ((69 % 5) + 1),
    window: 7,
    offset: 8,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource69(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset69(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState69(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute69(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 69);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-69">
      <div className="header-69">
        <div>
          <h2>Page69</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-69">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-69">
        <div className="sidebar-69">
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

        <div className="content-69">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-69">
          <Component681 seed={seed + 1} title={'Page69-Component681'} />
          <Component682 seed={seed + 2} title={'Page69-Component682'} />
          <Component683 seed={seed + 3} title={'Page69-Component683'} />
          <Component684 seed={seed + 4} title={'Page69-Component684'} />
          </div>
          <div className="component-grid-69">
          <Component685 seed={seed + 7} title={'Page69-Widget685'} />
          <Component686 seed={seed + 8} title={'Page69-Widget686'} />
          <Component687 seed={seed + 9} title={'Page69-Widget687'} />
          <Component688 seed={seed + 10} title={'Page69-Widget688'} />
          <Component689 seed={seed + 11} title={'Page69-Widget689'} />
          <Component690 seed={seed + 12} title={'Page69-Widget690'} />
          </div>
        </div>
      </div>
    </div>
  );
}
