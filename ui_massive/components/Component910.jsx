import { useEffect, useMemo, useReducer, useState } from 'react';
import { useLogic360 } from '../hooks/useLogic360.js';
import { buildNestedTree360, buildTableState360, heavyCompute360, transformDataset360 } from '../utils/compute360.js';
import { buildForecast360, detectAnomalies360, segmentDistribution360 } from '../utils/compute360.js';
import { buildActivityMap360, rankBuckets360, summarizePipeline360, synthesizeFlow360 } from '../pipelines/pipeline360.js';
import '../styles/component910.css';

function MetricCard910({ label, value, max }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const ratio = Math.max(0, Math.min(100, (Number(value) / safeMax) * 100));
  const color = ratio > 75 ? '#ff6b6b' : ratio > 45 ? '#ffd166' : '#06d6a0';
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span>{label}</span>
        <span>{Number(value).toFixed(2)}</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.12)', borderRadius: 12 }}>
        <div style={{ height: 7, width: ratio + '%', background: color, borderRadius: 12 }} />
      </div>
    </div>
  );
}

function Badge910({ status }) {
  const color = status === 'critical' ? '#ff6b6b' : status === 'high' ? '#ffb703' : status === 'medium' ? '#4cc9f0' : '#80ed99';
  return (
    <span style={{ padding: '2px 7px', borderRadius: 10, border: '1px solid ' + color, color }}>
      {status}
    </span>
  );
}

function TreeNode910({ node, depth, activeId, onPick }) {
  const active = node.id === activeId;
  return (
    <div style={{ marginLeft: depth * 10 }}>
      <button
        type="button"
        onClick={() => onPick(node.id)}
        className="node-910"
        style={{ width: '100%', color: 'white', background: active ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.02)' }}
      >
        <span>{node.label}</span>
        <span>{Number(node.score).toFixed(2)}</span>
      </button>
      {depth < 4 && Array.isArray(node.children) && node.children.map((child) => (
        <TreeNode910 key={child.id} node={child} depth={depth + 1} activeId={activeId} onPick={onPick} />
      ))}
    </div>
  );
}

const initialState910 = {
  mode: 'balanced',
  tab: 'dashboard',
  activeId: 0,
  submissions: 0,
  status: 'idle',
  bias: 0,
};

function reducer910(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'tab') return { ...state, tab: action.payload };
  if (action.type === 'activeId') return { ...state, activeId: action.payload };
  if (action.type === 'submissions') return { ...state, submissions: state.submissions + 1 };
  if (action.type === 'status') return { ...state, status: action.payload };
  if (action.type === 'bias') return { ...state, bias: state.bias + action.payload };
  return state;
}

function createForm910(seed) {
  return {
    operator: 'Operator-' + (seed % 9),
    vehicle: 'VH-' + (seed % 17),
    route: 'R-' + ((seed % 5) + 1),
    speedCap: 70 + (seed % 30),
    focusCap: 35 + (seed % 40),
    profile: 'balanced',
  };
}

function validateForm910(form) {
  const errors = {};
  if (!String(form.operator || '').trim() || String(form.operator || '').trim().length < 3) errors.operator = 'invalid';
  if (!String(form.vehicle || '').trim() || String(form.vehicle || '').trim().length < 3) errors.vehicle = 'invalid';
  if (!String(form.route || '').trim() || String(form.route || '').trim().length < 2) errors.route = 'invalid';
  const speed = Number(form.speedCap);
  const focus = Number(form.focusCap);
  if (!Number.isFinite(speed) || speed < 30 || speed > 180) errors.speedCap = 'invalid';
  if (!Number.isFinite(focus) || focus < 0 || focus > 100) errors.focusCap = 'invalid';
  return errors;
}

export default function Component910({ seed = 910, title = 'Component910' }) {
  const hook = useLogic360(seed + 910);
  const [state, dispatch] = useReducer(reducer910, initialState910);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(createForm910(seed));
  const [errors, setErrors] = useState({});

  const rows = useMemo(() => transformDataset360(hook.series, query, state.mode, state.bias), [hook.series, query, state.mode, state.bias]);
  const table = useMemo(() => buildTableState360(rows, sortBy, sortDir, page, 11), [rows, sortBy, sortDir, page]);
  const tree = useMemo(() => buildNestedTree360(rows.slice(0, 28), 4), [rows]);
  const compute = useMemo(() => heavyCompute360(14 + (seed % 5), 2 + (state.bias % 5)), [seed, state.bias]);
  const forecast = useMemo(() => buildForecast360(rows, 24 + (state.bias % 6)), [rows, state.bias]);
  const anomalies = useMemo(() => detectAnomalies360(rows, 68 + (state.bias % 9)), [rows, state.bias]);
  const distribution = useMemo(() => segmentDistribution360(rows), [rows]);
  const flow = useMemo(() => synthesizeFlow360(rows, state.bias), [rows, state.bias]);
  const buckets = useMemo(() => rankBuckets360(flow, 9 + (state.bias % 4)), [flow, state.bias]);
  const activity = useMemo(() => buildActivityMap360(flow, 8, 8), [flow]);
  const pipelineSummary = useMemo(() => summarizePipeline360(flow, buckets), [flow, buckets]);

  useEffect(() => {
    if (page > table.totalPages) {
      setPage(table.totalPages || 1);
    }
  }, [page, table.totalPages]);

  useEffect(() => {
    if (hook.flags.risk > 80) {
      dispatch({ type: 'status', payload: 'warning' });
    } else if (hook.flags.risk > 55) {
      dispatch({ type: 'status', payload: 'watch' });
    } else {
      dispatch({ type: 'status', payload: 'stable' });
    }
  }, [hook.flags.risk]);

  function handleField(event) {
    const name = event.target.name;
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateForm910(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      dispatch({ type: 'submissions' });
      dispatch({ type: 'bias', payload: 1 });
      hook.mutate('tick');
      hook.setSeed((prev) => prev + Number(form.speedCap) + Number(form.focusCap));
    }
  }

  const cards = useMemo(() => {
    return [
      { label: 'Risk', value: hook.flags.risk, max: 120 },
      { label: 'Confidence', value: hook.flags.confidence, max: 120 },
      { label: 'Quality', value: hook.state.quality, max: 120 },
      { label: 'Density', value: compute.density, max: 120 },
      { label: 'Rows', value: rows.length, max: 140 },
      { label: 'Page Rows', value: table.pageRows.length, max: 50 },
      { label: 'Anomalies', value: anomalies.length, max: 120 },
      { label: 'Forecast Avg', value: forecast.reduce((sum, item) => sum + item.value, 0) / Math.max(1, forecast.length), max: 140 },
      { label: 'Pipe Pressure', value: pipelineSummary.maxPressure, max: 120 },
    ];
  }, [hook.flags.risk, hook.flags.confidence, hook.state.quality, compute.density, rows.length, table.pageRows.length, anomalies.length, forecast, pipelineSummary.maxPressure]);

  return (
    <section className="component-910">
      <div className="header-910">
        <div>
          <h3>{title}</h3>
          <div style={{ fontSize: 12 }}>status {state.status} submissions {state.submissions}</div>
        </div>
        <div className="controls-910">
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'safe' }); hook.mutate('mode', 'safe'); }}>Safe</button>
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'balanced' }); hook.mutate('mode', 'balanced'); }}>Balanced</button>
          <button type="button" onClick={() => { dispatch({ type: 'mode', payload: 'aggressive' }); hook.mutate('mode', 'aggressive'); }}>Aggressive</button>
          <button type="button" onClick={() => hook.mutate('granularity', Math.max(2, hook.state.granularity - 1))}>Gran-</button>
          <button type="button" onClick={() => hook.mutate('granularity', hook.state.granularity + 1)}>Gran+</button>
        </div>
      </div>

      <div className="grid-910">
        <div className="panel-910">
          {cards.map((item, idx) => (
            <MetricCard910 key={item.label + '-' + idx} label={item.label} value={item.value} max={item.max} />
          ))}
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="filter lane or status" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 6 }}>
            {table.pageRows.slice(0, 6).map((row) => (
              <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 6px' }}>
                <span>{row.lane}</span>
                <Badge910 status={row.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel-910">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 7 }}>
            <input name="operator" value={form.operator} onChange={handleField} />
            <input name="vehicle" value={form.vehicle} onChange={handleField} />
            <input name="route" value={form.route} onChange={handleField} />
            <input name="speedCap" type="number" min="30" max="180" value={form.speedCap} onChange={handleField} />
            <input name="focusCap" type="number" min="0" max="100" value={form.focusCap} onChange={handleField} />
            <select name="profile" value={form.profile} onChange={handleField}>
              <option value="safe">safe</option>
              <option value="balanced">balanced</option>
              <option value="aggressive">aggressive</option>
            </select>
            <button type="submit">Apply</button>
          </form>
          <div style={{ fontSize: 12, color: '#ffd6d6' }}>{Object.keys(errors).join(' | ')}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setSortBy('score')}>Sort score</button>
            <button type="button" onClick={() => setSortBy('visibility')}>Sort visibility</button>
            <button type="button" onClick={() => setSortDir((prev) => prev === 'asc' ? 'desc' : 'asc')}>Toggle dir</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Prev</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(table.totalPages, prev + 1))}>Next</button>
          </div>
          <div style={{ fontSize: 12 }}>page {table.page} / {table.totalPages} total {table.total}</div>
        </div>

        <div className="panel-910">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Lane</th>
                <th>Status</th>
                <th>Score</th>
                <th>Vis</th>
                <th>Anom</th>
              </tr>
            </thead>
            <tbody>
              {table.pageRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.lane}</td>
                  <td>{row.status}</td>
                  <td>{row.score.toFixed(2)}</td>
                  <td>{row.visibility.toFixed(2)}</td>
                  <td>{row.anomaly.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
            {compute.rowTotals.slice(0, 9).map((value, idx) => (
              <div key={'row-' + idx} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 5, fontSize: 11 }}>
                <div>R{idx + 1}</div>
                <div>{value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-910">
          <div className="tree-910">
            {tree.slice(0, 8).map((node) => (
              <TreeNode910
                key={node.id}
                node={node}
                depth={0}
                activeId={state.activeId}
                onPick={(id) => dispatch({ type: 'activeId', payload: id })}
              />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
            {hook.trend.slice(0, 8).map((value, idx) => (
              <div key={'trend-' + idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 6 }}>
                <div style={{ fontSize: 10 }}>T{idx + 1}</div>
                <div>{value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-910">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
            {forecast.slice(0, 12).map((item) => (
              <div key={'fc-' + item.step} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>F{item.step}</div>
                <div>{item.value.toFixed(2)}</div>
                <div>{item.guard.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Lane</th>
                <th>Score</th>
                <th>Delta</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.slice(0, 10).map((item) => (
                <tr key={'an-' + item.id}>
                  <td>{item.id}</td>
                  <td>{item.lane}</td>
                  <td>{item.score.toFixed(2)}</td>
                  <td>{item.delta.toFixed(2)}</td>
                  <td>{item.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gap: 6 }}>
            {distribution.map((item) => (
              <div key={'dist-' + item.key} style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 8, alignItems: 'center' }}>
                <span>{item.key}</span>
                <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.12)' }}>
                  <div style={{ width: item.ratio + '%', height: 8, borderRadius: 8, background: item.key === 'critical' ? '#ff6b6b' : item.key === 'high' ? '#ffb703' : item.key === 'medium' ? '#4cc9f0' : '#80ed99' }} />
                </div>
                <span>{item.ratio.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>B</th>
                <th>Route</th>
                <th>Demand</th>
                <th>Pressure</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {buckets.slice(0, 8).map((item) => (
                <tr key={'bk-' + item.bucket}>
                  <td>{item.bucket}</td>
                  <td>{item.avgRoute.toFixed(2)}</td>
                  <td>{item.avgDemand.toFixed(2)}</td>
                  <td>{item.pressure.toFixed(2)}</td>
                  <td>{item.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0,1fr))', gap: 4 }}>
            {activity.slice(0, 8).flatMap((row, rIdx) => row.slice(0, 8).map((cell, cIdx) => (
              <div
                key={'act-' + rIdx + '-' + cIdx}
                style={{
                  height: 16,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,229,255,' + Math.max(0.1, Math.min(0.9, cell / 100)).toFixed(2) + ')',
                }}
              />
            )))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6, fontSize: 12 }}>
            <div>Demand {pipelineSummary.totalDemand.toFixed(2)}</div>
            <div>Avg {pipelineSummary.avgDemand.toFixed(2)}</div>
            <div>MaxP {pipelineSummary.maxPressure.toFixed(2)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
            {pipelineSummary.levels.map((item) => (
              <div key={'lvl-' + item.key} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 6, fontSize: 11 }}>
                <div>{item.key}</div>
                <div>{item.count}</div>
                <div>{item.ratio.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
