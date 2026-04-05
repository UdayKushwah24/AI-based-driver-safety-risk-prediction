import { useEffect, useMemo, useReducer, useState } from 'react';
import { buildTableState19, heavyCompute19, transformDataset19 } from '../utils/compute19.js';
import Component181 from '../components/Component181.jsx';
import Component182 from '../components/Component182.jsx';
import Component183 from '../components/Component183.jsx';
import Component184 from '../components/Component184.jsx';
import Component185 from '../components/Component185.jsx';
import Component186 from '../components/Component186.jsx';
import Component187 from '../components/Component187.jsx';
import Component188 from '../components/Component188.jsx';
import Component189 from '../components/Component189.jsx';
import Component190 from '../components/Component190.jsx';
import '../styles/page19.css';

const initialState19 = {
  tab: 'overview',
  mode: 'balanced',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1,
  cycle: 0,
};

function reducer19(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  if (action.type === 'cycle') return { ...state, cycle: state.cycle + 1 };
  return state;
}

function buildSource19(seed, count) {
  return Array.from({ length: count }, (_, idx) => {
    const wave = Math.sin((idx + seed) / 6) * 16;
    const drift = Math.cos((idx + seed) / 13) * 12;
    return Number((52 + wave + drift + (idx % 9) * 1.6).toFixed(3));
  });
}

export default function Page19() {
  const [seed, setSeed] = useState(171);
  const [query, setQuery] = useState('');
  const [state, dispatch] = useReducer(reducer19, initialState19);
  const [form, setForm] = useState({
    fleet: 'Fleet-' + 19,
    segment: 'S' + ((19 % 5) + 1),
    window: 5,
    offset: 7,
    note: 'cycle-active-state',
  });

  const source = useMemo(() => buildSource19(seed, 180), [seed]);
  const rows = useMemo(() => transformDataset19(source, query, state.mode, state.cycle), [source, query, state.mode, state.cycle]);
  const table = useMemo(() => buildTableState19(rows, state.sortBy, state.sortDir, state.page, 14), [rows, state.sortBy, state.sortDir, state.page]);
  const compute = useMemo(() => heavyCompute19(18 + (seed % 4), Number(form.offset)), [seed, form.offset]);

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
    setSeed((prev) => prev + gain + 19);
    dispatch({ type: 'cycle' });
  }

  return (
    <div className="page-19">
      <div className="header-19">
        <div>
          <h2>Page19</h2>
          <div style={{ fontSize: 12 }}>rows {rows.length} total {table.total} cycle {state.cycle}</div>
        </div>
        <div className="controls-19">
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'safe' })}>Safe</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'balanced' })}>Balanced</button>
          <button type="button" onClick={() => dispatch({ type: 'mode', payload: 'aggressive' })}>Aggressive</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'details' })}>Details</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'widgets' })}>Widgets</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </div>

      <div className="layout-19">
        <div className="sidebar-19">
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

        <div className="content-19">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {compute.colTotals.slice(0, 24).map((value, idx) => (
              <div key={'c-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>C{idx + 1}</div>
                <div>{value.toFixed(1)}</div>
              </div>
            ))}
          </div>
          <div className="component-grid-19">
          <Component181 seed={seed + 1} title={'Page19-Component181'} />
          <Component182 seed={seed + 2} title={'Page19-Component182'} />
          <Component183 seed={seed + 3} title={'Page19-Component183'} />
          <Component184 seed={seed + 4} title={'Page19-Component184'} />
          </div>
          <div className="component-grid-19">
          <Component185 seed={seed + 7} title={'Page19-Widget185'} />
          <Component186 seed={seed + 8} title={'Page19-Widget186'} />
          <Component187 seed={seed + 9} title={'Page19-Widget187'} />
          <Component188 seed={seed + 10} title={'Page19-Widget188'} />
          <Component189 seed={seed + 11} title={'Page19-Widget189'} />
          <Component190 seed={seed + 12} title={'Page19-Widget190'} />
          </div>
        </div>
      </div>
    </div>
  );
}
