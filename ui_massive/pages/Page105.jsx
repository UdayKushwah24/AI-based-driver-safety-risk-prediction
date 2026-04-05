import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState105, heavyCompute105, transformDataset105 } from '../utils/compute105.js';
import Component1041 from '../components/Component1041.jsx';
import Component1042 from '../components/Component1042.jsx';
import Component1043 from '../components/Component1043.jsx';
import Component1044 from '../components/Component1044.jsx';
import Component1045 from '../components/Component1045.jsx';
import Component1046 from '../components/Component1046.jsx';
import Component1047 from '../components/Component1047.jsx';
import Component1048 from '../components/Component1048.jsx';
import Component1049 from '../components/Component1049.jsx';
import Component1050 from '../components/Component1050.jsx';
import '../styles/page105.css';

const initialState105 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer105(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource105(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 4) * 16;
    const drift = Math.cos((idx + seed) / 9) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page105() {
  const [seed, setSeed] = useState(945);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer105, initialState105);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 105,
    segment: 'S' + ((105 % 5) + 1),
    window: 7,
    offset: 2,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource105(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset105(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState105(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute105(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 105);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-105">
      <div className="header-105">
        <div>
          <h2>Page105</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-105">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-105">
        <div className="sidebar-105">
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

        <div className="content-105">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-105">
          <Component1041 seed={seed + 1} title={'Page105-Component1041'} />
          <Component1042 seed={seed + 2} title={'Page105-Component1042'} />
          <Component1043 seed={seed + 3} title={'Page105-Component1043'} />
          <Component1044 seed={seed + 4} title={'Page105-Component1044'} />
          </div>
          <div className="component-grid-105">
          <Component1045 seed={seed + 7} title={'Page105-Widget1045'} />
          <Component1046 seed={seed + 8} title={'Page105-Widget1046'} />
          <Component1047 seed={seed + 9} title={'Page105-Widget1047'} />
          <Component1048 seed={seed + 10} title={'Page105-Widget1048'} />
          <Component1049 seed={seed + 11} title={'Page105-Widget1049'} />
          <Component1050 seed={seed + 12} title={'Page105-Widget1050'} />
          </div>
        </div>
      </div>
    </div>
  );
}
