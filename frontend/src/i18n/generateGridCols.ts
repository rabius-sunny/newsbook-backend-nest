// lib/utils.ts
type GridCols =
  | number
  | Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>;

export function generateGridCols(cols: GridCols) {
  const make = (n: number, bp?: string) =>
    bp ? `${bp}:grid-cols-${n}` : `grid-cols-${n}`;

  if (typeof cols === 'number') return make(cols);

  return Object.entries(cols)
    .map(([bp, n]) => (n ? make(n, bp === 'base' ? '' : bp) : ''))
    .filter(Boolean)
    .join(' ');
}
