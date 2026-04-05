import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const baseSeries023 = Array.from({ length: 64 }, (_, idx) => {
  const wave = Math.sin((idx + 23) / 5) * 12;
  const drift = Math.cos((idx + 23) / 6) * 8;
  const offset = ((idx * 23) % 17) - 8;
  return Number((45 + wave + drift + offset).toFixed(3));
});

const initialState023 = {
  mode: 'balanced',
  window: 5,
  tick: 0,
  loading: false,
  history: [],
  quality: 0,
  budget: 7
};

function reducer023(state, action) {
  switch (action.type) {
    case 'mode':
      return { ...state, mode: action.payload };
    case 'window':
      return { ...state, window: Math.max(2, Math.min(18, action.payload)) };
    case 'tick':
      return { ...state, tick: state.tick + 1 };
    case 'loading':
      return { ...state, loading: action.payload };
    case 'history':
      return { ...state, history: action.payload.slice(-36) };
    case 'quality':
      return { ...state, quality: action.payload };
    case 'budget':
      return { ...state, budget: Math.max(1, action.payload) };
    default:
      return state;
  }
}

function normalize023(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value * 1000) / 1000;
}

function smooth023(values, width) {
  const list = [];
  for (let i = 0; i < values.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - width); j <= Math.min(values.length - 1, i + width); j += 1) {
      total += values[j];
      count += 1;
    }
    list.push(normalize023(total / Math.max(1, count)));
  }
  return list;
}

function deriveFlags023(values, mode) {
  const avg = values.reduce((sum, n) => sum + n, 0) / Math.max(1, values.length);
  const peak = values.reduce((max, n) => Math.max(max, n), -Infinity);
  const valley = values.reduce((min, n) => Math.min(min, n), Infinity);
  const variance = values.reduce((acc, n) => acc + (n - avg) ** 2, 0) / Math.max(1, values.length);
  const spread = normalize023(peak - valley);
  const jitter = normalize023(Math.sqrt(variance));
  const risk = normalize023(avg * 0.37 + spread * 0.29 + jitter * 0.34 + (23 % 9));
  return {
    avg: normalize023(avg),
    peak: normalize023(peak),
    valley: normalize023(valley),
    spread,
    jitter,
    risk,
    mode,
    stable: jitter < (mode === 'safe' ? 6 : mode === 'aggressive' ? 11 : 8)
  };
}

function fakeApi023(seed, mode, budget) {
  return new Promise((resolve) => {
    const delay = 8 + (seed % 6) * 4 + (budget % 4) * 3;
    setTimeout(() => {
      const shape = Array.from({ length: 16 }, (_, idx) => {
        const base = Math.sin((idx + seed) / 17) * 9 + Math.cos((idx + seed) / 5) * 6;
        const adjust = mode === 'safe' ? -5 : mode === 'aggressive' ? 7 : 1;
        return normalize023(base + adjust + (budget % 9));
      });
      resolve(shape);
    }, delay);
  });
}

export function useMegaHook023(initialSeed = 23) {
  const [seed, setSeed] = useState(initialSeed);
  const [state, dispatch] = useReducer(reducer023, initialState023);

  useEffect(() => {
    let active = true;
    dispatch({ type: 'loading', payload: true });
    fakeApi023(seed, state.mode, state.budget).then((response) => {
      if (!active) {
        return;
      }
      dispatch({ type: 'history', payload: response });
      dispatch({ type: 'loading', payload: false });
    });
    return () => {
      active = false;
    };
  }, [seed, state.mode, state.tick, state.budget]);

  const series = useMemo(() => {
    const merged = baseSeries023.map((n, idx) => {
      const drift = state.history[idx % Math.max(1, state.history.length)] || 0;
      const mod = state.mode === 'safe' ? -6 : state.mode === 'aggressive' ? 10 : 0;
      return normalize023(n + drift * 0.45 + mod + (seed % 13) * 0.2 + idx * 0.03);
    });
    return smooth023(merged, state.window);
  }, [seed, state.mode, state.window, state.history]);

  const trend = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < series.length; i += 8) {
      const part = series.slice(i, i + 8);
      const avg = part.reduce((sum, n) => sum + n, 0) / Math.max(1, part.length);
      chunks.push(normalize023(avg));
    }
    return chunks;
  }, [series]);

  const flags = useMemo(() => deriveFlags023(series, state.mode), [series, state.mode]);

  useEffect(() => {
    const quality = trend.reduce((sum, n, idx) => sum + n * (idx + 1), 0) / Math.max(1, trend.length * 6);
    dispatch({ type: 'quality', payload: normalize023(quality) });
  }, [trend]);

  const mutate = useCallback((mode, payload = 0) => {
    if (mode === 'tick') {
      dispatch({ type: 'tick' });
      return;
    }
    if (mode === 'window') {
      dispatch({ type: 'window', payload: payload || state.window + 1 });
      return;
    }
    if (mode === 'budget') {
      dispatch({ type: 'budget', payload: payload || state.budget + 1 });
      return;
    }
    dispatch({ type: 'mode', payload: mode });
  }, [state.window, state.budget]);

  return {
    seed,
    setSeed,
    state,
    series,
    trend,
    flags,
    mutate
  };
}
