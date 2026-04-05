import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState101, heavyCompute101, transformDataset101 } from '../utils/compute101.js';
import Component1001 from '../components/Component1001.jsx';
import Component1002 from '../components/Component1002.jsx';
import Component1003 from '../components/Component1003.jsx';
import Component1004 from '../components/Component1004.jsx';
import Component1005 from '../components/Component1005.jsx';
import Component1006 from '../components/Component1006.jsx';
import Component1007 from '../components/Component1007.jsx';
import Component1008 from '../components/Component1008.jsx';
import Component1009 from '../components/Component1009.jsx';
import Component1010 from '../components/Component1010.jsx';
import '../styles/page101.css';

const initialState101 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer101(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource101(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 8) * 16;
    const drift = Math.cos((idx + seed) / 5) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page101() {
  const [seed, setSeed] = useState(909);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer101, initialState101);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 101,
    segment: 'S' + ((101 % 5) + 1),
    window: 9,
    offset: 5,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource101(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset101(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState101(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute101(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 101);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-101">
      <div className="header-101">
        <div>
          <h2>Page101</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-101">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-101">
        <div className="sidebar-101">
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

        <div className="content-101">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-101">
          <Component1001 seed={seed + 1} title={'Page101-Component1001'} />
          <Component1002 seed={seed + 2} title={'Page101-Component1002'} />
          <Component1003 seed={seed + 3} title={'Page101-Component1003'} />
          <Component1004 seed={seed + 4} title={'Page101-Component1004'} />
          </div>
          <div className="component-grid-101">
          <Component1005 seed={seed + 7} title={'Page101-Widget1005'} />
          <Component1006 seed={seed + 8} title={'Page101-Widget1006'} />
          <Component1007 seed={seed + 9} title={'Page101-Widget1007'} />
          <Component1008 seed={seed + 10} title={'Page101-Widget1008'} />
          <Component1009 seed={seed + 11} title={'Page101-Widget1009'} />
          <Component1010 seed={seed + 12} title={'Page101-Widget1010'} />
          </div>
        </div>
      </div>
    </div>
  );
}
