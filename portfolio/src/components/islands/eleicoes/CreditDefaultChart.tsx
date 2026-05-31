import type { DefaultDataPoint, GovPeriod } from '../../../data/eleicoes';

interface Props {
  series: DefaultDataPoint[];
  periods: GovPeriod[];
  locale: 'en' | 'pt';
  labels: {
    title: string;
    subtitle: string;
    source: string;
    axisY: string;
    pandemicNote: string;
    highNote: string;
  };
}

const W = 800;
const H = 340;
const ML = 52, MR = 24, MT = 30, MB = 60;
const PW = W - ML - MR;
const PH = H - MT - MB;
const Y_MIN = 1.5, Y_MAX = 5.0;

function dateToIndex(date: string, series: DefaultDataPoint[]): number {
  return series.findIndex(d => d.date === date);
}

function toX(index: number, total: number): number {
  return ML + (index / (total - 1)) * PW;
}

function toY(value: number): number {
  return MT + PH - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * PH;
}

function dateLabel(date: string): string {
  return date.split('-')[0]; // just the year
}

export default function CreditDefaultChart({ series, periods, locale, labels }: Props) {
  if (!series.length) return null;
  const total = series.length;
  const pointsStr = series.map((d, i) => `${toX(i, total).toFixed(1)},${toY(d.value).toFixed(1)}`).join(' ');

  // Annotated extremes
  const minPt = series.reduce((a, b) => b.value < a.value ? b : a);
  const maxPt = series.reduce((a, b) => b.value > a.value ? b : a);
  const minIdx = series.indexOf(minPt);
  const maxIdx = series.indexOf(maxPt);
  const minX = toX(minIdx, total);
  const minY = toY(minPt.value);
  const maxX = toX(maxIdx, total);
  const maxY = toY(maxPt.value);

  // Y-axis gridlines
  const yTicks: number[] = [];
  for (let v = Y_MIN; v <= Y_MAX + 0.001; v += 0.5) yTicks.push(parseFloat(v.toFixed(1)));

  // X-axis year ticks — every even year, at January (or nearest available)
  const xTicks: { x: number; label: string }[] = [];
  for (let yr = 2012; yr <= 2026; yr += 2) {
    const jan = `${yr}-01`;
    const idx = series.findIndex(d => d.date >= jan);
    if (idx >= 0) xTicks.push({ x: toX(idx, total), label: String(yr) });
  }

  // Government period bands
  const bands = periods.map(p => {
    const si = dateToIndex(p.start, series);
    const ei = dateToIndex(p.end, series);
    const startIdx = si >= 0 ? si : 0;
    const endIdx = ei >= 0 ? ei : total - 1;
    const x1 = toX(startIdx, total);
    const x2 = toX(endIdx, total);
    return { ...p, x1, x2, midX: (x1 + x2) / 2 };
  });

  // Clamp callout text anchor so labels stay within the plot area
  // We estimate ~5.5px per char at 9px mono; half-width used for clamping
  const clampAnchor = (x: number, chars: number) => {
    const half = (chars * 5.5) / 2 + 4;
    return Math.max(ML + half, Math.min(x, ML + PW - half));
  };
  const minLabelX = clampAnchor(minX, labels.pandemicNote.length);
  const maxLabelText = `${maxPt.value.toFixed(2)}% (${dateLabel(maxPt.date)}) — ${labels.highNote}`;
  const maxLabelX = clampAnchor(maxX, maxLabelText.length);

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label={labels.title}
      >
        {/* Government period bands */}
        {bands.map(b => (
          <g key={b.id}>
            <rect
              x={b.x1} y={MT}
              width={Math.max(0, b.x2 - b.x1)}
              height={PH}
              fill={b.color}
            />
            <text
              x={b.midX} y={MT - 8}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--mono)"
              fill="var(--muted)"
              letterSpacing="0.06em"
            >
              {b.label[locale].toUpperCase()}
            </text>
          </g>
        ))}

        {/* Y gridlines */}
        {yTicks.map(v => {
          const y = toY(v);
          return (
            <g key={v}>
              <line
                x1={ML} y1={y} x2={ML + PW} y2={y}
                stroke="var(--line-soft)"
                strokeWidth={1}
              />
              <text
                x={ML - 6} y={y + 4}
                textAnchor="end"
                fontSize={10}
                fontFamily="var(--mono)"
                fill="var(--muted)"
              >
                {v.toFixed(1)}%
              </text>
            </g>
          );
        })}

        {/* Y axis label */}
        <text
          x={10} y={MT + PH / 2}
          textAnchor="middle"
          fontSize={9}
          fontFamily="var(--mono)"
          fill="var(--muted)"
          transform={`rotate(-90, 10, ${MT + PH / 2})`}
          letterSpacing="0.06em"
        >
          {labels.axisY.toUpperCase()}
        </text>

        {/* X axis ticks */}
        {xTicks.map(t => (
          <g key={t.label}>
            <line
              x1={t.x} y1={MT + PH} x2={t.x} y2={MT + PH + 4}
              stroke="var(--muted)" strokeWidth={1}
            />
            <text
              x={t.x} y={MT + PH + 14}
              textAnchor="middle"
              fontSize={10}
              fontFamily="var(--mono)"
              fill="var(--muted)"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Axes borders */}
        <line x1={ML} y1={MT} x2={ML} y2={MT + PH} stroke="var(--line)" strokeWidth={1} />
        <line x1={ML} y1={MT + PH} x2={ML + PW} y2={MT + PH} stroke="var(--line)" strokeWidth={1} />

        {/* Data line */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.6}
          strokeOpacity={0.85}
          strokeLinejoin="round"
        />

        {/* Pandemic low annotation */}
        <line
          x1={minX} y1={minY + 5} x2={minX} y2={MT + PH}
          stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3"
        />
        <circle cx={minX} cy={minY} r={3.5} fill="var(--up)" opacity={0.9} />
        <text
          x={minLabelX} y={minY - 10}
          textAnchor="middle" fontSize={9} fontFamily="var(--mono)"
          fill="var(--up)" fontWeight="600"
          stroke="var(--paper)" strokeWidth={3} strokeLinejoin="round"
          paintOrder="stroke"
        >
          {labels.pandemicNote}
        </text>

        {/* Current high annotation */}
        <circle cx={maxX} cy={maxY} r={3.5} fill="var(--down)" opacity={0.9} />
        <text
          x={maxLabelX} y={maxY - 10}
          textAnchor="middle" fontSize={9} fontFamily="var(--mono)"
          fill="var(--down)" fontWeight="600"
          stroke="var(--paper)" strokeWidth={3} strokeLinejoin="round"
          paintOrder="stroke"
        >
          {maxLabelText}
        </text>

        {/* Source line */}
        <text
          x={ML} y={H - 10}
          fontSize={9}
          fontFamily="var(--mono)"
          fill="var(--muted)"
          opacity={0.7}
        >
          {labels.source}
        </text>
      </svg>
    </div>
  );
}
