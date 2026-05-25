import type { WeatherKind } from '../../../types/pokemon';
import styles from './WeatherScene.module.css';

const WEATHER_CONFIG: Record<WeatherKind, { label: string; emoji: string; particleCount: number }> = {
  clear:   { label: 'Clear',   emoji: '☀️', particleCount: 0  },
  rain:    { label: 'Rain',    emoji: '🌧️', particleCount: 30 },
  snow:    { label: 'Snow',    emoji: '❄️', particleCount: 25 },
  wind:    { label: 'Wind',    emoji: '💨', particleCount: 15 },
  thunder: { label: 'Thunder', emoji: '⛈️', particleCount: 20 },
};

export function WeatherScene({ weather, city }: { weather: WeatherKind; city: string }) {
  const cfg = WEATHER_CONFIG[weather];
  return (
    <div className={`${styles.scene} ${styles[weather]}`}>
      <div className={styles.particles}>
        {Array.from({ length: cfg.particleCount }).map((_, i) => (
          <span
            key={i}
            className={`${styles.particle} ${styles[`p${weather}`]}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className={styles.label}>
        <span className={styles.emoji}>{cfg.emoji}</span>
        <span>{cfg.label} in {city}</span>
      </div>
    </div>
  );
}
