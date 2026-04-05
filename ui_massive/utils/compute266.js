function toNumber266(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize266(value) {
  return Math.round(toNumber266(value) * 1000) / 1000;
}

function tokenize266(query) {
  return String(query || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function classify266(score) {
  if (score >= 88) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 48) return 'medium';
  return 'low';
}

function rolling266(list, size) {
  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    let total = 0;
    let count = 0;
    for (let j = Math.max(0, i - size); j <= Math.min(list.length - 1, i + size); j += 1) {
      total += toNumber266(list[j]);
      count += 1;
    }
    result.push(normalize266(total / Math.max(1, count)));
  }
  return result;
}

export function transformDataset266(input, query = '', mode = 'balanced', bias = 0) {
  const source = Array.isArray(input) ? input : [];
  const tokens = tokenize266(query);
  const rows = source.map((value, idx) => {
    const speed = normalize266(Math.abs(value) + (idx % 15) * 1.8 + 8);
    const focus = normalize266(Math.abs(Math.sin((idx + 266) / 8)) * 100);
    const visibility = normalize266(100 - Math.abs(Math.cos((idx + 266) / 4)) * 72);
    const anomaly = normalize266(Math.abs(Math.sin((idx + 266) / 15)) * 100);
    const raw = speed * 0.27 + focus * 0.23 + (100 - visibility) * 0.24 + anomaly * 0.26;
    const modeShift = mode === 'safe' ? -7 : mode === 'aggressive' ? 9 : 0;
    const score = normalize266(raw + modeShift + (idx % 6) * 0.61 + bias * 0.4);
    const marker = normalize266(score * 0.64 + visibility * 0.2 + focus * 0.16);
    return {
      id: idx + 1,
      lane: 'L' + ((idx % 16) + 1),
      speed,
      focus,
      visibility,
      anomaly,
      score,
      marker,
      status: classify266(score),
    };
  });

  const filtered = rows.filter((row) => {
    if (!tokens.length) {
      return true;
    }
    const text = String(row.lane + ' ' + row.status + ' ' + row.id).toLowerCase();
    return tokens.every((token) => text.includes(token));
  });

  const smoothed = rolling266(filtered.map((row) => row.score), 2).map((value, idx) => ({
    ...filtered[idx],
    smooth: value,
    blend: normalize266(value * 0.73 + filtered[idx].marker * 0.27),
  }));

  return smoothed;
}

export function buildTableState266(rows, sortBy = 'score', sortDir = 'desc', page = 1, pageSize = 12) {
  const list = Array.isArray(rows) ? [...rows] : [];
  const direction = sortDir === 'asc' ? 1 : -1;
  list.sort((a, b) => {
    const av = toNumber266(a[sortBy]);
    const bv = toNumber266(b[sortBy]);
    if (av === bv) {
      return String(a.lane).localeCompare(String(b.lane)) * direction;
    }
    return (av - bv) * direction;
  });

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const normalizedPage = Math.max(1, Math.min(totalPages, page));
  const start = (normalizedPage - 1) * pageSize;
  const pageRows = list.slice(start, start + pageSize);

  return {
    rows: list,
    total,
    totalPages,
    page: normalizedPage,
    pageRows,
  };
}

export function buildNestedTree266(rows, depthLimit = 3) {
  const source = Array.isArray(rows) ? rows : [];
  const root = [];
  for (let i = 0; i < source.length; i += 1) {
    const row = source[i];
    const node = {
      id: row.id,
      label: row.lane,
      score: row.score,
      depth: 0,
      children: [],
    };
    const count = (i % 3) + 1;
    for (let j = 0; j < count; j += 1) {
      const childScore = normalize266(row.score * (0.82 + j * 0.07));
      const child = {
        id: row.id * 100 + j,
        label: row.lane + '-' + (j + 1),
        score: childScore,
        depth: 1,
        children: [],
      };
      if (depthLimit > 2) {
        const leafCount = (j % 2) + 1;
        for (let k = 0; k < leafCount; k += 1) {
          child.children.push({
            id: row.id * 1000 + j * 10 + k,
            label: row.lane + '-' + (j + 1) + '-' + (k + 1),
            score: normalize266(childScore * (0.88 + k * 0.05)),
            depth: 2,
            children: [],
          });
        }
      }
      node.children.push(child);
    }
    root.push(node);
  }
  return root;
}

export function heavyCompute266(size = 18, seed = 3) {
  const matrix = [];
  for (let r = 0; r < size; r += 1) {
    const row = [];
    for (let c = 0; c < size; c += 1) {
      const wave = Math.sin((r + seed) / 8) * 8;
      const drift = Math.cos((c + seed) / 4) * 6;
      const edge = ((r * c + 266) % 15) - 8;
      row.push(normalize266(42 + wave + drift + edge));
    }
    matrix.push(row);
  }

  const rowTotals = matrix.map((row) => normalize266(row.reduce((sum, value) => sum + value, 0)));
  const colTotals = [];
  for (let c = 0; c < size; c += 1) {
    let total = 0;
    for (let r = 0; r < size; r += 1) {
      total += matrix[r][c];
    }
    colTotals.push(normalize266(total));
  }

  const diagonal = normalize266(matrix.reduce((sum, row, idx) => sum + (row[idx] || 0), 0));
  const antiDiagonal = normalize266(matrix.reduce((sum, row, idx) => sum + (row[size - idx - 1] || 0), 0));
  const density = normalize266((diagonal + antiDiagonal) / Math.max(1, size * 2));

  return {
    matrix,
    rowTotals,
    colTotals,
    diagonal,
    antiDiagonal,
    density,
  };
}

export function buildForecast266(rows, horizon = 18) {
  const source = Array.isArray(rows) ? rows : [];
  const base = source.slice(-24).map((row) => toNumber266(row.score || row.smooth || 0));
  const seed = base.length ? base.reduce((sum, value) => sum + value, 0) / base.length : 50;
  const output = [];
  for (let i = 0; i < horizon; i += 1) {
    const wave = Math.sin((i + 266) / 8) * 6;
    const drift = Math.cos((i + 266) / 4) * 4;
    const momentum = base.length ? base[(i + base.length - 1) % base.length] * 0.08 : 0;
    const value = normalize266(seed + wave + drift + momentum + (i % 5) * 0.7);
    output.push({
      step: i + 1,
      value,
      guard: normalize266(100 - Math.abs(value - 50) * 1.1),
      load: normalize266(value * 0.61 + (i + 1) * 0.33),
    });
  }
  return output;
}

export function detectAnomalies266(rows, threshold = 72) {
  const source = Array.isArray(rows) ? rows : [];
  const anomalies = [];
  for (let i = 1; i < source.length; i += 1) {
    const prev = toNumber266(source[i - 1].score || source[i - 1].smooth || 0);
    const curr = toNumber266(source[i].score || source[i].smooth || 0);
    const delta = normalize266(curr - prev);
    const severity = normalize266(Math.abs(delta) + Math.max(0, curr - threshold) * 0.8);
    if (Math.abs(delta) > 9 || curr > threshold) {
      anomalies.push({
        id: i + 1,
        lane: source[i].lane || 'N/A',
        score: curr,
        delta,
        severity,
        level: severity > 20 ? 'critical' : severity > 11 ? 'high' : 'medium',
      });
    }
  }
  return anomalies;
}

export function segmentDistribution266(rows) {
  const source = Array.isArray(rows) ? rows : [];
  const map = { low: 0, medium: 0, high: 0, critical: 0 };
  for (let i = 0; i < source.length; i += 1) {
    const status = source[i].status || classify266(source[i].score || 0);
    if (status in map) {
      map[status] += 1;
    }
  }
  const total = source.length || 1;
  return Object.keys(map).map((key) => ({
    key,
    count: map[key],
    ratio: normalize266((map[key] / total) * 100),
    weight: normalize266(map[key] * 1.7 + (key === 'critical' ? 8 : key === 'high' ? 4 : 1)),
  }));
}
