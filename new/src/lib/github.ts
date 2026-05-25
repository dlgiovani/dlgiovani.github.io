export function generateHeatmap(seed: number): number[][] {
  const weeks = 53;
  const days = 7;
  const grid: number[][] = [];
  let rng = seed;
  const next = () => {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff;
    return (rng >>> 0) / 0xffffffff;
  };
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const r = next();
      week.push(r < 0.4 ? 0 : r < 0.65 ? 1 : r < 0.82 ? 2 : r < 0.93 ? 3 : 4);
    }
    grid.push(week);
  }
  return grid;
}
