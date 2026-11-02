import type { Area, Progress } from './types'
import { fraction, progressLabel } from './lib'

interface Props {
  title: string
  area: Area
  progress: Progress
  onChange: (p: Progress) => void
}

/** One control per progress kind: +/- for counts, tappable quarters for fuzzy tasks, a single bar for yes/no. */
export function ProgressControl({ title, area, progress, onChange }: Props) {
  const label = progressLabel(progress)
  const done = fraction(progress) >= 1

  return (
    <div className="pc">
      <div className="pc-head">
        <span className={done ? 'pc-title done' : 'pc-title'}>{title}</span>
        <span className={`pc-label area-text-${area}`}>{label}</span>
      </div>

      {progress.kind === 'count' && (
        <div className="pc-count">
          <div className={`bar area-${area}`} aria-hidden="true">
            <span style={{ width: `${fraction(progress) * 100}%` }} />
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label={`Less ${title}`}
            onClick={() => onChange({ ...progress, done: Math.max(0, progress.done - (progress.step ?? 1)) })}
          >
            −
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label={`More ${title}`}
            onClick={() => onChange({ ...progress, done: progress.done + (progress.step ?? 1) })}
          >
            +
          </button>
        </div>
      )}

      {progress.kind === 'steps' && (
        <div className={`segs area-${area}`} role="group" aria-label={`${title} progress`}>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              className={n <= progress.value ? 'seg on' : 'seg'}
              aria-label={`Set ${title} to ${n * 25}%`}
              aria-pressed={n <= progress.value}
              onClick={() => onChange({ kind: 'steps', value: progress.value === n ? n - 1 : n })}
            />
          ))}
        </div>
      )}

      {progress.kind === 'binary' && (
        <div className={`segs area-${area}`}>
          <button
            type="button"
            className={progress.done ? 'seg on' : 'seg'}
            aria-label={`Mark ${title} ${progress.done ? 'not done' : 'done'}`}
            aria-pressed={progress.done}
            onClick={() => onChange({ kind: 'binary', done: !progress.done })}
          />
        </div>
      )}
    </div>
  )
}
