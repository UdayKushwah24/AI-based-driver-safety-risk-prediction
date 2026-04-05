import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const baseSeries044 = Array.from({ length: 64 }, (_, idx) => {
  const wave = Math.sin((idx + 44) / 5) * 12;
  const drift = Math.cos((idx + 44) / 5) * 8;
  const offset = ((idx * 44) % 17) - 8;
  return Number((45 + wave + drift + offset).toFixed(3));
});

const initialState044 = {
  mode: 'balanced',
  window: 5,
  tick: 0,
  loading: false,
  history: [],
  quality: 0,
  budget: 8
};

function reducer044(state, action) {
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

function normalize044(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value * 1000) / 1000;
}

function smooth044(values, width) {
  const list = [];
  for (let i = 0; i < values.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - width); j <= Math.min(values.length - 1, i + width); j += 1) {
      total += values[j];
      count += 1;
    }
    list.push(normalize044(total / Math.max(1, count)));
  }
  return list;
}

function deriveFlags044(values, mode) {
  const avg = values.reduce((sum, n) => sum + n, 0) / Math.max(1, values.length);
  const peak = values.reduce((max, n) => Math.max(max, n), -Infinity);
  const valley = values.reduce((min, n) => Math.min(min, n), Infinity);
  const variance = values.reduce((acc, n) => acc + (n - avg) ** 2, 0) / Math.max(1, values.length);
  const spread = normalize044(peak - valley);
  const jitter = normalize044(Math.sqrt(variance));
  const risk = normalize044(avg * 0.37 + spread * 0.29 + jitter * 0.34 + (44 % 9));
  return {
    avg: normalize044(avg),
    peak: normalize044(peak),
    valley: normalize044(valley),
    spread,
    jitter,
    risk,
    mode,
    stable: jitter < (mode === 'safe' ? 6 : mode === 'aggressive' ? 11 : 8)
  };
}

function fakeApi044(seed, mode, budget) {
  return new Promise((resolve) => {
    const delay = 8 + (seed % 6) * 4 + (budget % 4) * 3;
    setTimeout(() => {
      const shape = Array.from({ length: 16 }, (_, idx) => {
        const base = Math.sin((idx + seed) / 12) * 9 + Math.cos((idx + seed) / 5) * 6;
        const adjust = mode === 'safe' ? -5 : mode === 'aggressive' ? 7 : 1;
        return normalize044(base + adjust + (budget % 9));
      });
      resolve(shape);
    }, delay);
  });
}

export function useMegaHook044(initialSeed = 44) {
  const [seed, setSeed] = useState(initialSeed);
  const [state, dispatch] = useReducer(reducer044, initialState044);

  useEffect(() => {
    let active = true;
    dispatch({ type: 'loading', payload: true });
    fakeApi044(seed, state.mode, state.budget).then((response) => {
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
    const merged = baseSeries044.map((n, idx) => {
      const drift = state.history[idx % Math.max(1, state.history.length)] || 0;
      const mod = state.mode === 'safe' ? -6 : state.mode === 'aggressive' ? 10 : 0;
      return normalize044(n + drift * 0.45 + mod + (seed % 13) * 0.2 + idx * 0.03);
    });
    return smooth044(merged, state.window);
  }, [seed, state.mode, state.window, state.history]);

  const trend = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < series.length; i += 8) {
      const part = series.slice(i, i + 8);
      const avg = part.reduce((sum, n) => sum + n, 0) / Math.max(1, part.length);
      chunks.push(normalize044(avg));
    }
    return chunks;
  }, [series]);

  const flags = useMemo(() => deriveFlags044(series, state.mode), [series, state.mode]);

  useEffect(() => {
    const quality = trend.reduce((sum, n, idx) => sum + n * (idx + 1), 0) / Math.max(1, trend.length * 6);
    dispatch({ type: 'quality', payload: normalize044(quality) });
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
