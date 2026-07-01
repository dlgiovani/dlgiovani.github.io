import { useState } from 'react';
import { CategoryAnim } from './CategoryAnim';
import { ConsultingForm } from './ConsultingForm';
import styles from './Solutions.module.css';
import type { Category, SolutionsStrings } from './types';

// The lever animations draw on a fixed light panel, so their accent stays the
// design's original regardless of theme.
const ANIM_ACCENT = '#E0512B';

interface Props {
  strings: SolutionsStrings;
  apiUrl: string;
  homeHref: string;
}

const CARD_MOTIFS: Record<Exclude<Category, 'else'>, React.ReactNode> = {
  consulting: (
    <svg width="120" height="92" viewBox="0 0 120 92">
      <g className={styles.dashSpin}>
        <path d="M34 22 L86 46" strokeWidth="1.8" />
        <path d="M34 46 L86 22" strokeWidth="1.8" />
        <path d="M34 70 L86 70" strokeWidth="1.8" />
      </g>
      {[22, 46, 70].map((y) => (
        <g key={y}>
          <circle cx="34" cy={y} r="5" className={styles.motifFill} />
          <circle cx="86" cy={y} r="5" className={styles.motifFill} />
        </g>
      ))}
    </svg>
  ),
  integration: (
    <svg width="120" height="92" viewBox="0 0 120 92">
      <rect x="14" y="34" width="20" height="26" rx="2" strokeWidth="1.6" />
      <rect x="86" y="34" width="20" height="26" rx="2" strokeWidth="1.6" />
      <g className={styles.flyPlane}>
        <path d="M74 47 L50 41 L56 47 L50 53 Z" className={styles.motifFill} />
      </g>
    </svg>
  ),
  automation: (
    <svg width="120" height="92" viewBox="0 0 120 92">
      <rect x="16" y="28" width="30" height="38" rx="2" strokeWidth="1.4" />
      <path d="M16 40 H46 M16 52 H46 M31 28 V66" strokeWidth="0.9" opacity="0.5" />
      <rect x="74" y="28" width="30" height="38" rx="2" strokeWidth="1.4" />
      <path d="M74 40 H104 M74 52 H104 M89 28 V66" strokeWidth="0.9" opacity="0.5" />
      <circle cx="52" cy="47" r="2.6" className={`${styles.motifFill} ${styles.stream1}`} />
      <circle cx="58" cy="47" r="2.6" className={`${styles.motifFill} ${styles.stream2}`} />
    </svg>
  ),
};

export function SolutionsChooser({ strings, apiUrl, homeHref }: Props) {
  const [view, setView] = useState<'home' | Category>('home');

  const go = (v: 'home' | Category) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <a href={homeHref} className={styles.logo}>
          <span style={{ fontWeight: 500 }}>dl</span>
          <span className={styles.logoDot}>.</span>
          <span>giovani</span>
        </a>
      </header>

      {view === 'home' ? (
        <main className={styles.home}>
          <p className={styles.kicker}>{strings.kicker}</p>
          <h1 className={styles.heroTitle}>{strings.hero}</h1>
          <p className={styles.heroSub}>{strings.heroSub}</p>

          <div className={styles.cards}>
            {(['consulting', 'integration', 'automation'] as const).map((cat, i) => (
              <button
                key={cat}
                className={styles.card}
                style={{ animationDelay: `${0.05 + i * 0.07}s` }}
                onClick={() => go(cat)}
              >
                <span className={styles.cardNum}>0{i + 1}</span>
                <div className={styles.cardArt}>{CARD_MOTIFS[cat]}</div>
                <span className={styles.cardLabel}>{strings.blocks[cat].label}</span>
                <span className={styles.cardDesc}>{strings.blocks[cat].desc}</span>
              </button>
            ))}

            <button
              className={styles.cardElse}
              style={{ animationDelay: '0.26s' }}
              onClick={() => go('else')}
            >
              <div className={styles.elseCircle}>
                <svg width="30" height="30" viewBox="0 0 30 30" className={styles.elseIcon}>
                  <g>
                    <path d="M15 4 V26 M4 15 H26 M7.2 7.2 L22.8 22.8 M22.8 7.2 L7.2 22.8" />
                  </g>
                </svg>
                <span className={styles.elseLabel}>{strings.blocks.else.label}</span>
                <span className={styles.elseDesc}>{strings.blocks.else.desc}</span>
              </div>
            </button>
          </div>

          <footer className={styles.homeFooter}>dlgiovani.dev — contato [at] dlgiovani.dev</footer>
        </main>
      ) : (
        <main className={styles.detail} key={view}>
          <button className={styles.backBtn} onClick={() => go('home')}>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 1 L1 5 L5 9 M1 5 H15" />
            </svg>
            {strings.form.back}
          </button>

          <p className={styles.detailKicker}>{strings.details[view].kicker}</p>
          <h1 className={styles.detailTitle}>{strings.details[view].title}</h1>

          <div className={styles.animPanel}>
            <CategoryAnim category={view} accent={ANIM_ACCENT} />
          </div>
          <p className={styles.leverHint}>{strings.leverHint}</p>

          <p className={styles.detailPara}>{strings.details[view].para}</p>

          <div className={styles.formSection}>
            <h2 className={styles.formTitle}>{strings.form.title}</h2>
            <p className={styles.formSub}>{strings.form.sub}</p>
            <ConsultingForm
              key={view}
              category={view}
              strings={strings}
              apiUrl={apiUrl}
              accent={ANIM_ACCENT}
            />
          </div>
        </main>
      )}
    </div>
  );
}
