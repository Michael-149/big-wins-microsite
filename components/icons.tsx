// Design-system icons and the SIL symbol, inlined so they take the text color.
// Paths are copied from the kit (ds-kit/icons, ds-kit/symbols). Never rotate,
// mirror or recolor the symbol beyond its two variations (solid white, solid black).

type IconProps = { className?: string };

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 25 24" aria-hidden="true" focusable="false">
      <path d="M13.076 22.175l1.46 1.325L25 12 14.536.5l-1.46 1.325 8.362 9.19H0v1.97h21.438l-8.362 9.19z" />
    </svg>
  );
}

export function ArrowPrevIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 9 16" aria-hidden="true" focusable="false">
      <path d="M8.098 14.209l.112-.098-.096-.113L3.01 8l5.103-5.998.096-.113-.112-.098L7.053.887l-.114-.1-.098.116-5.956 7L.803 8l.082.097 5.956 7 .098.116.114-.1 1.045-.904z" />
    </svg>
  );
}

export function ArrowNextIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 9 16" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d="M.578 1.873L2.075.575 8.393 8l-6.318 7.425-1.497-1.298L5.79 8 .578 1.873zM6.185 8L1 14.095 2.044 15 8 8 2.044 1 1 1.905 6.185 8z" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M7 5V0H5v5H0v2h5v5h2V7h5V5H7z" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 13 2" aria-hidden="true" focusable="false">
      <path d="M.5 0h12v2H.5V0z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M0 10.5h12V12H0v-1.5zM0 5.25h12v1.5H0v-1.5zM0 0h12v1.5H0V0z" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M2.288 1.227l8.485 8.485-1.06 1.06-8.486-8.485 1.061-1.06z" />
      <path d="M10.773 2.287l-8.486 8.486-1.06-1.061 8.485-8.485 1.06 1.06z" />
    </svg>
  );
}

const SYMBOL_PATH = 'M2688.52,3000H3000V0H0V311.47C1484.83,311.47,2688.52,1515.17,2688.52,3000Z';

/** One SIL symbol at 24 units, pointing top right. */
function Sym({ x, y, black }: { x: number; y: number; black?: boolean }) {
  return <path d={SYMBOL_PATH} transform={`translate(${x} ${y}) scale(0.008)`} fill={black ? '#000' : '#fff'} />;
}

/**
 * The nine-symbol cluster from the DS cover and note card: one size, two
 * variations (solid white, solid black), stepping into the top-right corner.
 * Drawn on a 120 x 88 grid (24px symbols, 32px pitch); CSS sets its size.
 */
export function SymbolCluster({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 88" aria-hidden="true" focusable="false">
      <Sym x={0} y={0} black />
      <Sym x={32} y={0} />
      <Sym x={64} y={0} />
      <Sym x={96} y={0} />
      <Sym x={32} y={32} />
      <Sym x={64} y={32} />
      <Sym x={96} y={32} />
      <Sym x={64} y={64} black />
      <Sym x={96} y={64} />
    </svg>
  );
}

/** A four-symbol cluster for small corners (the practices callout), stepping into the top right. */
export function SymbolClusterSmall({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 88 56" aria-hidden="true" focusable="false">
      <Sym x={0} y={0} black />
      <Sym x={32} y={0} />
      <Sym x={64} y={0} />
      <Sym x={64} y={32} />
    </svg>
  );
}
