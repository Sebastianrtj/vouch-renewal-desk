import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { Case } from './Case'
import { How } from './How'
import { Tour } from './Tour'
import { Presenter } from './Presenter'
import { CLIENT, PEOPLE, QUEUE } from './data'
import { ball, demoScene, initial, reduce, TASK, type DemoScene, type Party, type Role } from './model'

type Page = 'queue' | 'case' | 'how'
const pageOf = (hash: string): Page => (hash.startsWith('#/halcyon') ? 'case' : hash.startsWith('#/how') ? 'how' : 'queue')

export function App() {
  const [params] = useState(() => new URLSearchParams(location.search))
  const presenting = params.has('present')
  const [s, dispatch] = useReducer(reduce, initial, () => {
    const scene = params.get('scene') as DemoScene
    return presenting && ['brief', 'outreach', 'placement', 'replies', 'quotes', 'decision'].includes(scene) ? demoScene(scene) : initial
  })
  const [page, setPage] = useState<Page>(() => pageOf(location.hash))

  useEffect(() => {
    const on = () => {
      setPage(pageOf(location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  // Each handoff brings the new task to the top
  const first = useRef(true)
  useEffect(() => {
    if (first.current) first.current = false
    else window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [s.step])

  useEffect(() => {
    if (!params.has('embedded')) return
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (s.openSource) { dispatch({ type: 'source', id: s.openSource }); return }
      try {
        const origin = new URL(document.referrer).origin
        if (['http://localhost:5181', 'http://127.0.0.1:5181'].includes(origin)) window.parent.postMessage({ type: 'vouch-demo-close' }, origin)
      } catch {}
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [params, s.openSource])

  // The walkthrough alone, for filming: /?capture=tour
  if (new URLSearchParams(location.search).get('capture') === 'tour')
    return (
      <div id="example" className="capture">
        <Tour />
      </div>
    )

  const go = (p: Page) => (location.hash = p === 'case' ? '#/halcyon-labs' : p === 'how' ? '#/how-it-works' : '#/')

  return (
    <>
      <header className="top">
        <a className="brand" href="#/" aria-label="Vouch renewals">
          <img src="./vouch.svg" alt="Vouch" />
        </a>
        <nav>
          <a href="#/" data-on={page !== 'how' || undefined}>
            Renewals
          </a>
          <a href="#/how-it-works" data-on={page === 'how' || undefined}>
            How it works
          </a>
        </nav>
        <span className="proto">Prototype · sample data</span>
        <div className="seg role" role="radiogroup" aria-label="View as">
          {(['cm', 'placement'] as Role[]).map((r) => (
            <button key={r} role="radio" aria-checked={s.role === r} data-on={s.role === r || undefined} onClick={() => dispatch({ type: 'role', role: r })}>
              {PEOPLE[r].role}
            </button>
          ))}
        </div>
        <button className="icon" aria-label="Start the case again" title="Start the case again" onClick={() => dispatch({ type: 'reset' })}>
          <ArrowCounterClockwise size={16} />
        </button>
      </header>

      <main className={'page' + (presenting ? ' presenting' : '')}>
        {page === 'case' && <Case s={s} dispatch={dispatch} onBack={() => go('queue')} />}
        {page === 'how' && <How onOpen={() => go('case')} />}
        {page === 'queue' && <Queue role={s.role} owner={ball(s.step)} task={TASK[s.step]} onOpen={() => go('case')} />}
      </main>
      {presenting && <Presenter s={s} onScene={scene => { dispatch({ type: 'demoScene', scene }); go('case') }} />}
    </>
  )
}

function Queue({ role, owner, task, onOpen }: { role: Role; owner: Party | null; task: string; onOpen: () => void }) {
  const rows = [...QUEUE, { name: CLIENT.name, renews: 'Mar 10', days: CLIENT.daysOut, lines: 'Cyber, D&O, GL', premium: CLIENT.premium, with: owner, task, live: true }]
  const mine = rows.filter((r) => r.with === role).length
  return (
    <div className="queue">
      <h1>Renewals</h1>
      <p className="meta">
        <span>{rows.length} open</span>
        <span>
          {mine} with you
        </span>
      </p>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Renews</th>
            <th>Policies</th>
            <th className="num">Premium</th>
            <th>Has the ball</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const live = 'live' in r
            return (
              <tr key={r.name} data-live={live || undefined} onClick={live ? onOpen : undefined}>
                <th scope="row">
                  {live ? (
                    <a href="#/halcyon-labs">{r.name}</a>
                  ) : (
                    r.name
                  )}
                  {live && owner === 'cm' && <span className="new">Opened today</span>}
                </th>
                <td>
                  {r.renews} <span className="faint">· {r.days} days</span>
                </td>
                <td>{r.lines}</td>
                <td className="num">{r.premium}</td>
                <td>
                  <span className="holder">{r.with === null ? 'Decided' : r.with === role ? <mark>You</mark> : PEOPLE[r.with].role}</span>
                  <span className="faint">{r.task}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="faint small note">Halcyon Labs is the worked example. The other rows show how a full book reads.</p>
    </div>
  )
}
