import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const source385 = Array.from({ length: 96 }, (_, idx) => {
  const wave = Math.sin((idx + 385) / 3) * 11;
  const drift = Math.cos((idx + 385) / 5) * 9;
  const edge = ((idx * 385) % 19) - 9;
  return Number((48 + wave + drift + edge).toFixed(4));
});

const initialState385 = {
  mode: 'balanced',
  granularity: 3,
  tick: 0,
  status: 'idle',
  queue: [],
  quality: 0,
  pressure: 4,
  marker: 0,
};

function reducer385(state, action) {
  if (action.type === 'mode') return { ...state, mode: action.payload };
  if (action.type === 'granularity') return { ...state, granularity: Math.max(2, Math.min(16, action.payload)) };
  if (action.type === 'tick') return { ...state, tick: state.tick + 1 };
  if (action.type === 'status') return { ...state, status: action.payload };
  if (action.type === 'queue') return { ...state, queue: action.payload.slice(-40) };
  if (action.type === 'quality') return { ...state, quality: action.payload };
  if (action.type === 'pressure') return { ...state, pressure: Math.max(1, action.payload) };
  if (action.type === 'marker') return { ...state, marker: action.payload };
  return state;
}

function toNumber385(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize385(value) {
  return Math.round(toNumber385(value) * 1000) / 1000;
}

function smooth385(input, radius) {
  const result = [];
  for (let i = 0; i < input.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(input.length - 1, i + radius); j += 1) {
      total += input[j];
      count += 1;
    }
    result.push(normalize385(total / Math.max(1, count)));
  }
  return result;
}

function derive385(series, mode) {
  const total = series.reduce((sum, value) => sum + value, 0);
  const avg = total / Math.max(1, series.length);
  const peak = series.reduce((max, value) => Math.max(max, value), -Infinity);
  const valley = series.reduce((min, value) => Math.min(min, value), Infinity);
  const variance = series.reduce((acc, value) => acc + (value - avg) ** 2, 0) / Math.max(1, series.length);
  const spread = normalize385(peak - valley);
  const jitter = normalize385(Math.sqrt(variance));
  const modeShift = mode === 'safe' ? -5 : mode === 'aggressive' ? 8 : 1;
  const risk = normalize385(avg * 0.36 + spread * 0.29 + jitter * 0.35 + modeShift);
  const confidence = normalize385(100 - Math.abs(risk - 50) * 0.9);
  return {
    avg: normalize385(avg),
    peak: normalize385(peak),
    valley: normalize385(valley),
    spread,
    jitter,
    risk,
    confidence,
  };
}

function fakeFetch385(seed, mode, pressure) {
  return new Promise((resolve) => {
    const wait = 10 + (seed % 5) * 5 + (pressure % 4) * 3;
    setTimeout(() => {
      const payload = Array.from({ length: 22 }, (_, idx) => {
        const a = Math.sin((idx + seed) / 15) * 8;
        const b = Math.cos((idx + seed) / 3) * 6;
        const c = mode === 'safe' ? -4 : mode === 'aggressive' ? 6 : 0;
        return normalize385(a + b + c + (pressure % 7));
      });
      resolve(payload);
    }, wait);
  });
}

export function useLogic385(initialSeed = 385) {
  const [seed, setSeed] = useState(initialSeed);
  const [state, dispatch] = useReducer(reducer385, initialState385);

  useEffect(() => {
    let live = true;
    dispatch({ type: 'status', payload: 'loading' });
    fakeFetch385(seed, state.mode, state.pressure).then((payload) => {
      if (!live) {
        return;
      }
      dispatch({ type: 'queue', payload });
      dispatch({ type: 'status', payload: 'ready' });
    });
    return () => {
      live = false;
    };
  }, [seed, state.mode, state.tick, state.pressure]);

  const series = useMemo(() => {
    const merged = source385.map((value, idx) => {
      const queueValue = state.queue[idx % Math.max(1, state.queue.length)] || 0;
      const modeShift = state.mode === 'safe' ? -7 : state.mode === 'aggressive' ? 9 : 0;
      const pressureShift = state.pressure * 0.4;
      return normalize385(value + queueValue * 0.5 + modeShift + pressureShift + idx * 0.04 + (seed % 11));
    });
    return smooth385(merged, state.granularity);
  }, [seed, state.queue, state.mode, state.pressure, state.granularity]);

  const trend = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < series.length; i += 6) {
      const part = series.slice(i, i + 6);
      const avg = part.reduce((sum, value) => sum + value, 0) / Math.max(1, part.length);
      chunks.push(normalize385(avg));
    }
    return chunks;
  }, [series]);

  const flags = useMemo(() => derive385(series, state.mode), [series, state.mode]);

  useEffect(() => {
    const quality = trend.reduce((sum, value, idx) => sum + value * (idx + 1), 0) / Math.max(1, trend.length * 6);
    dispatch({ type: 'quality', payload: normalize385(quality) });
    dispatch({ type: 'marker', payload: normalize385(flags.confidence * 0.7 + quality * 0.3) });
  }, [trend, flags.confidence]);

  const mutate = useCallback((type, payload) => {
    if (type === 'tick') {
      dispatch({ type: 'tick' });
      return;
    }
    if (type === 'mode') {
      dispatch({ type: 'mode', payload });
      return;
    }
    if (type === 'granularity') {
      dispatch({ type: 'granularity', payload });
      return;
    }
    if (type === 'pressure') {
      dispatch({ type: 'pressure', payload });
    }
  }, []);

  return {
    seed,
    setSeed,
    state,
    series,
    trend,
    flags,
    mutate,
  };
}
