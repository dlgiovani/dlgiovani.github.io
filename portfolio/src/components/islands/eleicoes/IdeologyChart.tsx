import type { IdeologyRow } from '../../../data/eleicoes';

interface CandidateMeta {
  id: string;
  color: string;
  shortName: string;
}

interface Props {
  rows: IdeologyRow[];
  locale: 'en' | 'pt-br';
  candidates: CandidateMeta[];
  labels: { axis: string };
}

function scoreToPercent(score: number): number {
  // score: -2 to +2 → 0% to 100%
  return ((score + 2) / 4) * 100;
}

export default function IdeologyChart({ rows, locale, candidates, labels }: Props) {
  return (
    <div>
      {/* Legend */}
      <div className="leaning-legend" style={{ marginBottom: 'var(--space-xl)' }}>
        {candidates.map(c => (
          <div key={c.id} className="leaning-legend-item">
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c.color,
                border: '1px solid var(--line)',
              }}
            />
            {c.shortName}
          </div>
        ))}
      </div>

      {rows.map((row, i) => (
        <div key={i} className="ideology-axis">
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              marginBottom: 'var(--space-xs)',
            }}
          >
            {row.axis[locale]}
          </div>

          <div className="ideology-labels">
            <span>{row.axisLeft[locale]}</span>
            <span>{row.axisRight[locale]}</span>
          </div>

          <div className="ideology-track">
            {candidates.map(c => {
              const data =
                c.id === 'lula'
                  ? row.lula
                  : c.id === 'flavio'
                  ? row.flavio
                  : row.renan;
              const pct = scoreToPercent(data.score);
              return (
                <div
                  key={c.id}
                  className="ideology-marker"
                  title={data.description[locale]}
                  style={{
                    left: `${pct}%`,
                    background: c.color,
                  }}
                />
              );
            })}
          </div>

          {/* Descriptions beneath the track */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-md)',
              marginTop: 'var(--space-sm)',
            }}
          >
            {candidates.map(c => {
              const data =
                c.id === 'lula'
                  ? row.lula
                  : c.id === 'flavio'
                  ? row.flavio
                  : row.renan;
              return (
                <div key={c.id}>
                  <p
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: c.color,
                      marginBottom: 2,
                    }}
                  >
                    {c.shortName}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--serif)',
                      fontStyle: 'italic',
                      fontSize: 12,
                      color: 'var(--muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {data.description[locale]}
                  </p>
                </div>
              );
            })}
          </div>

          {i < rows.length - 1 && (
            <div
              style={{
                borderBottom: '1px solid var(--line-soft)',
                marginTop: 'var(--space-xl)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
