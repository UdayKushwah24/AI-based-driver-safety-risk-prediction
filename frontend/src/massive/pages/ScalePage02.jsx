import { useEffect, useMemo, useReducer, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buildTableState002, pipelineData002, simulateRiskApi002 } from '../utils/transformSet002.js';
import MegaComponent009 from '../components/MegaComponent009.jsx';
import MegaComponent010 from '../components/MegaComponent010.jsx';
import MegaComponent011 from '../components/MegaComponent011.jsx';
import MegaComponent012 from '../components/MegaComponent012.jsx';
import MegaComponent013 from '../components/MegaComponent013.jsx';
import MegaComponent014 from '../components/MegaComponent014.jsx';
import MegaComponent015 from '../components/MegaComponent015.jsx';
import MegaComponent016 from '../components/MegaComponent016.jsx';
import '../styles/page02.css';

const initialState02 = {
  tab: 'overview',
  modalOpen: false,
  loading: false,
  records: [],
  message: '',
  sortBy: 'score',
  sortDir: 'desc',
  page: 1
};

function reducer02(state, action) {
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'modal') return { ...state, modalOpen: action.payload };
  if (action.type === 'loading') return { ...state, loading: action.payload };
  if (action.type === 'records') return { ...state, records: action.payload };
  if (action.type === 'message') return { ...state, message: action.payload };
  if (action.type === 'sortBy') return { ...state, sortBy: action.payload };
  if (action.type === 'sortDir') return { ...state, sortDir: action.payload };
  if (action.type === 'page') return { ...state, page: action.payload };
  return state;
}

function validate02(form) {
  const errors = {};
  if (!form.driver.trim() || form.driver.trim().length < 3) errors.driver = 'invalid';
  if (!form.vehicle.trim() || form.vehicle.trim().length < 3) errors.vehicle = 'invalid';
  if (!form.route.trim() || form.route.trim().length < 2) errors.route = 'invalid';
  const speed = Number(form.speed);
  if (!Number.isFinite(speed) || speed < 20 || speed > 200) errors.speed = 'invalid';
  const fatigue = Number(form.fatigue);
  if (!Number.isFinite(fatigue) || fatigue < 0 || fatigue > 100) errors.fatigue = 'invalid';
  if (!form.notes.trim() || form.notes.trim().length < 10) errors.notes = 'invalid';
  return errors;
}

function transformChart02(records) {
  return records.map((item, idx) => ({
    name: 'T' + (idx + 1),
    risk: Number(item.risk.toFixed(2)),
    load: Number(item.load.toFixed(2)),
    guard: Number(item.guard.toFixed(2)),
    blend: Number((item.risk * 0.58 + item.load * 0.21 + (100 - item.guard) * 0.21).toFixed(2))
  }));
}

export default function ScalePage02() {
  const [seed, setSeed] = useState(14);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    driver: '',
    vehicle: '',
    route: '',
    speed: 78,
    fatigue: 32,
    mode: 'balanced',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [state, dispatch] = useReducer(reducer02, initialState02);

  useEffect(() => {
    let active = true;
    dispatch({ type: 'loading', payload: true });
    simulateRiskApi002({ seed, points: 36, mode: form.mode }).then((payload) => {
      if (!active) return;
      dispatch({ type: 'records', payload });
      dispatch({ type: 'loading', payload: false });
      dispatch({ type: 'message', payload: 'loaded-' + payload.length + '-rows' });
    });
    return () => {
      active = false;
    };
  }, [seed, form.mode]);

  const rows = useMemo(() => pipelineData002(state.records.map((r) => r.risk), query, form.mode), [state.records, query, form.mode]);
  const table = useMemo(() => buildTableState002(rows, state.sortBy, state.sortDir, state.page, 9), [rows, state.sortBy, state.sortDir, state.page]);
  const chartData = useMemo(() => transformChart02(state.records), [state.records]);

  useEffect(() => {
    if (state.page > table.totalPages) {
      dispatch({ type: 'page', payload: table.totalPages || 1 });
    }
  }, [state.page, table.totalPages]);

  const stats = useMemo(() => {
    const total = chartData.reduce((sum, row) => sum + row.risk, 0);
    const avg = total / Math.max(1, chartData.length);
    const max = chartData.reduce((m, row) => Math.max(m, row.risk), 0);
    const min = chartData.reduce((m, row) => Math.min(m, row.risk), Infinity);
    const drift = chartData.reduce((sum, row, idx) => sum + row.blend * (idx + 1), 0) / Math.max(1, chartData.length * 7);
    return {
      total,
      avg,
      max,
      min: Number.isFinite(min) ? min : 0,
      drift
    };
  }, [chartData]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    const nextErrors = validate02(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSeed((s) => s + Number(form.speed) + Number(form.fatigue) + 2);
      dispatch({ type: 'tab', payload: 'table' });
      dispatch({ type: 'modal', payload: true });
    }
  }

  return (
    <div className="scale-page-02">
      <header className="scale-header-02">
        <div>
          <h2>Scale Page 2</h2>
          <div>{state.message}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'overview' })}>Overview</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'table' })}>Table</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'forms' })}>Forms</button>
          <button type="button" onClick={() => dispatch({ type: 'tab', payload: 'charts' })}>Charts</button>
        </div>
      </header>

      <div className="scale-grid-02">
        <MegaComponent009 seed={seed + 1} title="Page 2 Cluster 1" />
        <MegaComponent010 seed={seed + 2} title="Page 2 Cluster 2" />
        <MegaComponent011 seed={seed + 3} title="Page 2 Cluster 3" />
        <MegaComponent012 seed={seed + 4} title="Page 2 Cluster 4" />
      </div>

      <div className="scale-panel-02">
        <form className="scale-form-02" onSubmit={submitForm}>
          <input name="driver" value={form.driver} onChange={updateField} placeholder="Driver" />
          <input name="vehicle" value={form.vehicle} onChange={updateField} placeholder="Vehicle" />
          <input name="route" value={form.route} onChange={updateField} placeholder="Route" />
          <input name="speed" type="number" min="20" max="200" value={form.speed} onChange={updateField} />
          <input name="fatigue" type="number" min="0" max="100" value={form.fatigue} onChange={updateField} />
          <select name="mode" value={form.mode} onChange={updateField}>
            <option value="safe">Safe</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <textarea name="notes" rows="4" value={form.notes} onChange={updateField} placeholder="Notes" />
          <button type="submit">Run Validation</button>
        </form>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }}>
          <div>Avg {stats.avg.toFixed(2)}</div>
          <div>Max {stats.max.toFixed(2)}</div>
          <div>Min {stats.min.toFixed(2)}</div>
          <div>Drift {stats.drift.toFixed(2)}</div>
        </div>
        <div style={{ color: '#ffbdbd' }}>{Object.keys(errors).join(' | ')}</div>
      </div>

      <div className="scale-panel-02">
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter zones" />
          <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'score' })}>Score</button>
          <button type="button" onClick={() => dispatch({ type: 'sortBy', payload: 'visibility' })}>Visibility</button>
          <button type="button" onClick={() => dispatch({ type: 'sortDir', payload: state.sortDir === 'asc' ? 'desc' : 'asc' })}>Dir</button>
          <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.max(1, state.page - 1) })}>Prev</button>
          <button type="button" onClick={() => dispatch({ type: 'page', payload: Math.min(table.totalPages, state.page + 1) })}>Next</button>
        </div>
        <table className="scale-table-02">
          <thead>
            <tr>
              <th>ID</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Score</th>
              <th>Visibility</th>
              <th>Anomaly</th>
            </tr>
          </thead>
          <tbody>
            {table.pageRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.zone}</td>
                <td>{row.status}</td>
                <td>{row.score.toFixed(2)}</td>
                <td>{row.visibility.toFixed(2)}</td>
                <td>{row.anomaly.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>{table.page} / {table.totalPages} | {table.total}</div>
      </div>

      <div className="scale-panel-02">
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#00e5ff" dot={false} />
              <Line type="monotone" dataKey="blend" stroke="#ff8c42" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="load" stroke="#7bf1a8" fill="#7bf1a8" fillOpacity={0.18} />
              <Area type="monotone" dataKey="guard" stroke="#f6d365" fill="#f6d365" fillOpacity={0.16} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {state.modalOpen && (
        <div className="scale-modal-02" onClick={() => dispatch({ type: 'modal', payload: false })}>
          <div className="scale-modal-body-02" onClick={(event) => event.stopPropagation()}>
              <MegaComponent013 seed={seed + 9} title="Overlay 1" />
              <MegaComponent014 seed={seed + 10} title="Overlay 2" />
              <MegaComponent015 seed={seed + 11} title="Overlay 3" />
              <MegaComponent016 seed={seed + 12} title="Overlay 4" />
            <button type="button" onClick={() => dispatch({ type: 'modal', payload: false })}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
