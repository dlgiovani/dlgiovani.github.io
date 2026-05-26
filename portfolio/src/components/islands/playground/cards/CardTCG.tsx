import type { Pokemon } from '../../../../types/pokemon';
import { typeColor, formatPokemonName, formatStat, weightFromRaw, heightFromRaw } from '../../../../lib/pokemon-utils';
import styles from './CardTCG.module.css';

export function CardTCG({ pokemon }: { pokemon: Pokemon }) {
  const color = typeColor(pokemon.types[0]);
  const hp = pokemon.stats.find(s => s.name === 'hp')?.base ?? 50;
  return (
    <div className={styles.card} style={{ '--type-color': color, '--type-color-light': color + '44' } as React.CSSProperties}>
      <div className={styles.cardInner}>
        <div className={styles.top}>
          <span className={styles.name}>{formatPokemonName(pokemon.name)}</span>
          <span className={styles.hp}><small>HP</small> {hp}</span>
        </div>
        <div className={styles.imageWrap}>
          <img src={pokemon.artwork} alt={pokemon.name} className={styles.art} width={200} height={200} />
        </div>
        <div className={styles.types}>
          {pokemon.types.map(t => (
            <span key={t} className={styles.type} style={{ background: typeColor(t) }}>{t}</span>
          ))}
        </div>
        <div className={styles.stats}>
          {pokemon.stats.slice(0, 3).map(s => (
            <div key={s.name} className={styles.statLine}>
              <span className={styles.statName}>{formatStat(s.name)}</span>
              <span className={styles.statVal}>{s.base}</span>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span>{heightFromRaw(pokemon.height)}</span>
          <span>{weightFromRaw(pokemon.weight)}</span>
        </div>
      </div>
    </div>
  );
}
