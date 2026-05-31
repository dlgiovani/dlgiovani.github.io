import type { Candidate } from '../../../data/eleicoes';

interface Props {
  candidates: Pick<Candidate, 'id' | 'fullName' | 'shortName' | 'candidateColor' | 'videos'>[];
  locale: 'en' | 'pt';
  emptyLabel: string;
}

export default function VideoSection({ candidates, locale, emptyLabel }: Props) {
  return (
    <div className="video-grid">
      {candidates.map(c => (
        <div key={c.id}>
          <p
            className="video-col-header"
            style={{ borderBottomColor: c.candidateColor }}
          >
            <span style={{ color: c.candidateColor }}>
              {c.shortName}
            </span>
          </p>

          {c.videos.length === 0 ? (
            <div className="video-item">
              <div className="video-embed">
                <div className="video-placeholder">{emptyLabel}</div>
              </div>
            </div>
          ) : (
            c.videos.map((v, i) => (
              <div key={i} className="video-item">
                <div className="video-embed">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    title={v.title[locale]}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-meta">
                  <p className="video-title">{v.title[locale]}</p>
                  <p className="video-outlet">{v.outlet}</p>
                  <p className="video-desc">{v.description[locale]}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
