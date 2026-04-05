import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState72, heavyCompute72, transformDataset72 } from '../utils/compute72.js';
import Component711 from '../components/Component711.jsx';
import Component712 from '../components/Component712.jsx';
import Component713 from '../components/Component713.jsx';
import Component714 from '../components/Component714.jsx';
import Component715 from '../components/Component715.jsx';
import Component716 from '../components/Component716.jsx';
import Component717 from '../components/Component717.jsx';
import Component718 from '../components/Component718.jsx';
import Component719 from '../components/Component719.jsx';
import Component720 from '../components/Component720.jsx';
import '../styles/page72.css';

const initialState72 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer72(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource72(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 3) * 16;
    const drift = Math.cos((idx + seed) / 6) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page72() {
  const [seed, setSeed] = useState(648);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer72, initialState72);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 72,
    segment: 'S' + ((72 % 5) + 1),
    window: 4,
    offset: 4,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource72(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset72(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState72(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute72(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 72);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-72">
      <div className="header-72">
        <div>
          <h2>Page72</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-72">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-72">
        <div className="sidebar-72">
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

        <div className="content-72">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-72">
          <Component711 seed={seed + 1} title={'Page72-Component711'} />
          <Component712 seed={seed + 2} title={'Page72-Component712'} />
          <Component713 seed={seed + 3} title={'Page72-Component713'} />
          <Component714 seed={seed + 4} title={'Page72-Component714'} />
          </div>
          <div className="component-grid-72">
          <Component715 seed={seed + 7} title={'Page72-Widget715'} />
          <Component716 seed={seed + 8} title={'Page72-Widget716'} />
          <Component717 seed={seed + 9} title={'Page72-Widget717'} />
          <Component718 seed={seed + 10} title={'Page72-Widget718'} />
          <Component719 seed={seed + 11} title={'Page72-Widget719'} />
          <Component720 seed={seed + 12} title={'Page72-Widget720'} />
          </div>
        </div>
      </div>
    </div>
  );
}
