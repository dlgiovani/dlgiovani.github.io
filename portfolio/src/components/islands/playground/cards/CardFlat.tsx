import type { Pokemon } from '../../../../types/pokemon';
import { typeColor, formatPokemonName, formatStat, weightFromRaw, heightFromRaw } from '../../../../lib/pokemon-utils';
import styles from './CardFlat.module.css';

export function CardFlat({ pokemon }: { pokemon: Pokemon }) {
  const mainColor = typeColor(pokemon.types[0]);
  return (
    <div className={styles.card} style={{ '--type-color': mainColor } as React.CSSProperties}>
      <img src={pokemon.artwork} alt={pokemon.name} className={styles.art} width={160} height={160} />
      <div className={styles.body}>
        <p className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</p>
        <h3 className={styles.name}>{formatPokemonName(pokemon.name)}</h3>
        <div className={styles.types}>
          {pokemon.types.map(t => (
            <span key={t} className={styles.badge} style={{ background: typeColor(t) }}>{t}</span>
          ))}
        </div>
        <dl className={styles.stats}>
          {pokemon.stats.map(s => (
            <div key={s.name} className={styles.statRow}>
              <dt>{formatStat(s.name)}</dt>
              <dd>
                <div className={styles.bar}>
                  <div className={styles.fill} style={{ width: `${Math.min(100, (s.base / 255) * 100)}%` }} />
                </div>
                <span>{s.base}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={styles.meta}>{heightFromRaw(pokemon.height)} · {weightFromRaw(pokemon.weight)}</p>
      </div>
    </div>
  );
}
