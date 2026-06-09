import { useState } from 'react';
import type { Candidate, Scandal } from '../../../data/eleicoes';

interface Props {
  candidates: Pick<Candidate, 'id' | 'fullName' | 'shortName' | 'candidateColor' | 'scandals'>[];
  locale: 'en' | 'pt-br';
  labels: {
    confirmed: string;
    alleged: string;
    noneConfirmed: string;
    noneAlleged: string;
    sources: string;
    outcome: string;
    annulmentLabel: string;
    badgeConfirmed: string;
    badgeAlleged: string;
    leaningLeft: string;
    leaningCenter: string;
    leaningRight: string;
  };
}

function ScandalCard({
  scandal,
  locale,
  labels,
}: {
  scandal: Scandal;
  locale: 'en' | 'pt-br';
  labels: Props['labels'];
}) {
  const [open, setOpen] = useState(false);
  const isConfirmed = scandal.type === 'CONFIRMED';

  return (
    <div className="scandal-card" data-open={open ? 'true' : 'false'}>
      <div
        className="scandal-card-head"
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-expanded={open}
      >
        <span className={`badge ${isConfirmed ? 'badge-confirmed' : 'badge-alleged'}`}>
          {isConfirmed ? labels.badgeConfirmed : labels.badgeAlleged}
        </span>
        <span className="scandal-card-title">{scandal.name[locale]}</span>
        <span className="scandal-card-year">{scandal.year}</span>
        <svg
          className="scandal-card-chevron"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>

      <div className="scandal-card-body">
        <p>{scandal.summary[locale]}</p>

        {scandal.outcome && (
          <p className="scandal-outcome">{scandal.outcome[locale]}</p>
        )}

        {scandal.sources.length > 0 && (
          <div className="scandal-sources" style={{ marginTop: 12 }}>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginRight: 4,
              }}
            >
              {labels.sources}
            </span>
            {scandal.sources.map((s, i) => {
              const leaningLabel =
                s.leaning === 'left'
                  ? labels.leaningLeft
                  : s.leaning === 'right'
                  ? labels.leaningRight
                  : labels.leaningCenter;
              return (
                <span
                  key={i}
                  className={`src-tag src-${s.leaning}`}
                  title={leaningLabel}
                >
                  {s.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScandalCards({ candidates, locale, labels }: Props) {
  return (
    <div className="candidates-grid">
      {candidates.map(c => (
        <div
          key={c.id}
          className={`candidate-${c.id}`}
          style={{ '--c-candidate': c.candidateColor } as React.CSSProperties}
        >
          <div className="candidate-section-label">
            <span className="candidate-section-name">
              {c.shortName}
            </span>
          </div>

          {/* Annulment note */}
          {c.scandals.annulmentNote && (
            <div className="annulment-box">
              <strong>{labels.annulmentLabel}:</strong>{' '}
              {c.scandals.annulmentNote[locale]}
            </div>
          )}

          {/* No-mandate / no-scandal note */}
          {c.scandals.noneNote && (
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 13,
                color: 'var(--muted)',
                fontStyle: 'italic',
                marginBottom: 'var(--space-md)',
              }}
            >
              {c.scandals.noneNote[locale]}
            </p>
          )}

          {/* Confirmed */}
          <div className="sub-section-head" style={{ marginTop: 'var(--space-lg)' }}>
            <p className="sub-section-kicker">{labels.confirmed}</p>
          </div>
          {c.scandals.confirmed.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--muted)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {labels.noneConfirmed}
            </p>
          ) : (
            c.scandals.confirmed.map(s => (
              <ScandalCard key={s.name.en} scandal={s} locale={locale} labels={labels} />
            ))
          )}

          {/* Alleged */}
          <div className="sub-section-head" style={{ marginTop: 'var(--space-xl)' }}>
            <p className="sub-section-kicker">{labels.alleged}</p>
          </div>
          {c.scandals.alleged.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--muted)',
              }}
            >
              {labels.noneAlleged}
            </p>
          ) : (
            c.scandals.alleged.map(s => (
              <ScandalCard key={s.name.en} scandal={s} locale={locale} labels={labels} />
            ))
          )}
        </div>
      ))}
    </div>
  );
}
