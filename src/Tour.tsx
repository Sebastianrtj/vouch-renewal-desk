import { useState } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { Scroll, Stage, Window, type Act } from './kit'
import { Case } from './Case'
import { initial, reduce, type Action, type State } from './model'

// The walkthrough: an authored cursor over the prototype's own screens. The
// cursor and the scene changes are scripted; nothing here calls the app.

const after = (...actions: Action[]) => actions.reduce(reduce, initial)

const S1 = after({ type: 'source', id: 'contract' })
const S2 = after({ type: 'approve' })
const S3 = after({ type: 'approve' }, { type: 'sendOutreach' })
const S4 = reduce(S3, { type: 'clientReplies' })
const S5 = reduce(reduce(S4, { type: 'handoff' }), { type: 'role', role: 'placement' })
const S6 = reduce(S5, { type: 'submit' })
const S7 = reduce(S6, { type: 'carriersRespond' })
const S8 = reduce(S7, { type: 'answer' })
const S9 = reduce(S8, { type: 'compare' })

// Bring the current task into view: the lanes stay in frame while the ball
// moves, then the card comes up whole so no real words run off the crop.
const LANES = 132
const CARD = 22

const script = async (a: Act<State>) => {
  const next = async (s: State, read = 1500, offset = LANES) => {
    await a.scroll('page', 'now', { offset, duration: 520 })
    a.put(s)
    await a.wait(read)
  }
  await a.wait(900)
  a.mark('evidence')
  await a.click('src-contract')
  a.put(S1)
  await a.wait(2200)
  await a.scroll('page', 'approve', { offset: 520 })
  await a.wait(400)
  a.mark('approve')
  await a.click('approve')
  await next(S2, 1300)
  await a.scroll('page', 'now', { offset: CARD })
  a.mark('send')
  await a.click('send-outreach')
  await next(S3, 1900)
  await a.click('skip')
  a.put(S4)
  await a.wait(1300)
  await a.scroll('page', 'now', { offset: CARD })
  await a.wait(600)
  a.mark('handoff')
  await a.click('handoff')
  a.put(S5)
  await a.wait(750)
  await a.scroll('page', 'submit', { offset: 560, duration: 700 })
  await a.wait(2200)
  await a.click('submit')
  await next(S6, 1600)
  await a.click('skip')
  a.put(S7)
  await a.wait(1300)
  await a.scroll('page', 'now', { offset: CARD })
  await a.wait(500)
  a.mark('answer')
  await a.click('answer')
  a.put(S8)
  await a.wait(1500)
  await a.click('compare')
  a.put(S9)
  await a.wait(1600)
}

const noop = () => {}

export function Tour() {
  const [run, setRun] = useState(0)
  return (
    <figure className="tour">
      <Stage<State>
        key={run}
        width={1180}
        height={700}
        initial={initial}
        poster={S9}
        script={script}
        play="once"
        cursor={{ at: { x: 760, y: 420 }, idle: false }}
        tokens={{ '--ss-canvas': '#f7faf2', '--ss-surface': '#ffffff', '--ss-chrome': '#eef2e8', '--ss-accent': '#3be0ad', '--ss-font': '"GT Standard", system-ui, sans-serif', '--ss-text-strong': '#0f1c2c', '--ss-text': '#4c5764', '--ss-text-faint': '#8a9198' }}
        className="tour-stage"
      >
        {(s) => (
          <Window url="renewals.vouch.example/halcyon-labs" className="tour-window">
            <Scroll name="page" className="tour-scroll">
              <div className="tour-page">
                <Case s={s} dispatch={noop} />
              </div>
            </Scroll>
          </Window>
        )}
      </Stage>
      <figcaption>
        <span>A scripted walkthrough of the worked example, from the brief to two comparable quotes.</span>
        <button className="link" onClick={() => setRun((n) => n + 1)}>
          <ArrowCounterClockwise size={14} /> Replay
        </button>
      </figcaption>
    </figure>
  )
}
