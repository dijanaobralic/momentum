import { useState } from 'react'
import { useStore } from './store'
import { AREAS, COMFORTABLE_LOAD, areasMoved, fraction, mondayOf, weekLabel } from './lib'
import { ProgressControl } from './ProgressControl'
import type { Action, AppState, Goal } from './types'

type Tab = 'week' | 'goals' | 'library' | 'wins'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'week', label: 'Week', icon: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4' },
  { id: 'goals', label: 'Goals', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M12 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10' },
  { id: 'library', label: 'Library', icon: 'M4 4h6v16H4zM14 4h6v16h-6z' },
  { id: 'wins', label: 'Wins', icon: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function App() {
  const { state, setProgress, reset } = useStore()
  const [tab, setTab] = useState<Tab>('week')

  return (
    <div className="shell">
      <nav className="nav" aria-label="Main">
        <div className="brand">
          momentum<span>.</span>
        </div>
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'nav-item active' : 'nav-item'} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
            <Icon d={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
        <p className="mantra">“Depression can’t hit a moving target.”</p>
      </nav>

      <main className="main">
        {tab === 'week' && <WeekScreen state={state} onProgress={setProgress} />}
        {tab === 'goals' && <GoalsScreen state={state} />}
        {tab === 'library' && <Placeholder title="Library" text="Plans, trackers and reports attached to your goals. Coming next." />}
        {tab === 'wins' && <WinsScreen state={state} />}
        <button type="button" className="link-btn reset" onClick={reset}>
          Reset sample data
        </button>
      </main>
    </div>
  )
}

function WeekScreen({ state, onProgress }: { state: AppState; onProgress: (id: string, p: Action['progress']) => void }) {
  const week = mondayOf()
  const actions = state.actions.filter((a) => a.weekOf === week)
  const moved = areasMoved(actions)
  const open = actions.filter((a) => fraction(a.progress) < 1)
  const goalById = new Map(state.goals.map((g) => [g.id, g]))
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">
          Week of {weekLabel(week)} · {today}
        </div>
        <h1>{moved.size > 0 ? 'Hi Dijana, you’re moving.' : 'Hi Dijana. One small step?'}</h1>
      </header>

      <section className="card momentum" aria-label="Momentum this week">
        <div>
          <div className="big">
            {moved.size} of {AREAS.length} areas moved
          </div>
          <div className="muted">Movement counts, not completion.</div>
        </div>
        <div className="dots">
          {AREAS.map((a) => (
            <span key={a.id} className="dot-wrap">
              <span className={moved.has(a.id) ? `dot area-bg-${a.id}` : `dot empty area-border-${a.id}`} />
              {a.label}
            </span>
          ))}
        </div>
      </section>

      {actions.length > COMFORTABLE_LOAD && (
        <section className="card coach" aria-label="Coach">
          <div className="coach-label">Coach</div>
          <p>
            This week has {actions.length} actions. Your comfortable range is around {COMFORTABLE_LOAD}. {open.length} are still open. Want to pick one to move to next week?
          </p>
        </section>
      )}

      <div className="grid">
        {AREAS.map((area) => {
          const items = actions.filter((a) => a.area === area.id)
          if (items.length === 0) return null
          const goalIds = [...new Set(items.map((i) => i.goalId).filter(Boolean))] as string[]
          const longGoals = goalIds.map((id) => goalById.get(id)).filter((g): g is Goal => !!g && g.horizon === 'long')
          return (
            <section key={area.id} className="card area-card">
              <div className="area-head">
                <span className={`area-name area-text-${area.id}`}>{area.label}</span>
                <span className="chips">
                  {longGoals.map((g) => (
                    <span key={g.id} className={`chip area-text-${area.id}`}>
                      ↗ {g.title}
                    </span>
                  ))}
                </span>
              </div>
              {items.map((a) => (
                <ProgressControl key={a.id} title={a.note ? `${a.title} · ${a.note}` : a.title} area={a.area} progress={a.progress} onChange={(p) => onProgress(a.id, p)} />
              ))}
              {longGoals
                .filter((g) => g.why)
                .map((g) => (
                  <div key={g.id} className="why">
                    Why: <span>{g.why}</span>
                  </div>
                ))}
            </section>
          )
        })}
      </div>
    </>
  )
}

function GoalsScreen({ state }: { state: AppState }) {
  const week = mondayOf()
  return (
    <>
      <header className="page-head">
        <h1>Goals</h1>
        <div className="muted">Big goals carry a plan or tracker. Small ones live for one week.</div>
      </header>
      {(['long', 'week'] as const).map((h) => (
        <section key={h}>
          <h2 className="section-label">{h === 'long' ? 'With a plan' : 'This week only'}</h2>
          <div className="grid">
            {state.goals
              .filter((g) => g.horizon === h)
              .map((g) => {
                const acts = state.actions.filter((a) => a.goalId === g.id && a.weekOf === week)
                const pct = acts.length ? acts.reduce((s, a) => s + fraction(a.progress), 0) / acts.length : 0
                return (
                  <article key={g.id} className={`card goal-card top-${g.area}`}>
                    <span className={`area-name area-text-${g.area}`}>{AREAS.find((a) => a.id === g.area)?.label}</span>
                    <h3>{g.title}</h3>
                    {acts.length > 0 && <div className="muted small">This week: {acts.map((a) => a.title).join(' · ')}</div>}
                    <div className={`bar area-${g.area}`} aria-label={`${Math.round(pct * 100)}% of this week’s actions`}>
                      <span style={{ width: `${pct * 100}%` }} />
                    </div>
                    {g.artifactTitle && <div className={`small area-text-${g.area}`}>▤ {g.artifactTitle}</div>}
                  </article>
                )
              })}
          </div>
        </section>
      ))}
    </>
  )
}

function WinsScreen({ state }: { state: AppState }) {
  const wins = state.actions.filter((a) => fraction(a.progress) >= 1)
  return (
    <>
      <header className="page-head">
        <h1>Look how far you’ve come.</h1>
      </header>
      <section className="card">
        {wins.length === 0 ? (
          <p className="muted">Finished things land here.</p>
        ) : (
          <ul className="wins">
            {wins.map((w) => (
              <li key={w.id}>
                <span className={`dot small-dot area-bg-${w.area}`} />
                {w.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function Placeholder({ title, text }: { title: string; text: string }) {
  return (
    <>
      <header className="page-head">
        <h1>{title}</h1>
      </header>
      <section className="card">
        <p className="muted">{text}</p>
      </section>
    </>
  )
}
