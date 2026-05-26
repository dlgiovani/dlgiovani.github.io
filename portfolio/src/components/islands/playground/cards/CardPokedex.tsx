import type { Pokemon } from '../../../../types/pokemon';
import { typeColor, formatPokemonName, formatStat, weightFromRaw, heightFromRaw } from '../../../../lib/pokemon-utils';
import styles from './CardPokedex.module.css';

export function CardPokedex({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className={styles.dex}>
      <div className={styles.screen}>
        <img src={pokemon.sprite} alt={pokemon.name} className={styles.sprite} />
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <span className={styles.id}>No.{String(pokemon.id).padStart(3, '0')}</span>
          <span className={styles.name}>{formatPokemonName(pokemon.name)}</span>
        </div>
        <div className={styles.types}>
          {pokemon.types.map(t => (
            <span key={t} style={{ background: typeColor(t) }} className={styles.typeBadge}>{t}</span>
          ))}
        </div>
        <table className={styles.table}>
          <tbody>
            {pokemon.stats.slice(0, 4).map(s => (
              <tr key={s.name}>
                <td className={styles.statName}>{formatStat(s.name)}</td>
                <td className={styles.statVal}>{s.base}</td>
              </tr>
            ))}
            <tr><td>HT</td><td>{heightFromRaw(pokemon.height)}</td></tr>
            <tr><td>WT</td><td>{weightFromRaw(pokemon.weight)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
