import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Buildings, Check, EnvelopeSimple, FastForward, FileText, Globe, Paperclip, Phone, Quotes as QuoteIcon } from '@phosphor-icons/react'
import { ASK, ATTACHMENTS, CALL_FACTS, CHANGES, CLIENT, DISMISS_REASONS, FILE, LINES, MARKETS, PACKAGE, PEOPLE, QUOTE_ROWS, TO_CONFIRM, type FileItem } from './data'
import { at, ball, quoted, TASK, type Action, type Party, type State, type Step } from './model'

type Props = { s: State; dispatch: (a: Action) => void; onBack?: () => void }
const PARTIES: Party[] = ['cm', 'client', 'placement', 'carriers']
const CARRIER = { northlight: 'Northlight', atlas: 'Atlas' } as const

export function Case({ s, dispatch, onBack }: Props) {
  return (
    <div className="case">
      <header className="case-head">
        {onBack && (
          <button className="link back" onClick={onBack}>
            <ArrowLeft size={14} /> Renewals
          </button>
        )}
        <h1>{CLIENT.name}</h1>
        <p className="meta">
          <span>Renews {CLIENT.renews}</span>
          <span>{CLIENT.daysOut} days out</span>
          <span>3 policies</span>
          <span>{CLIENT.premium} expiring premium</span>
        </p>
      </header>

      <Lanes s={s} />

      <div className="case-grid">
        <div className="case-main">
          <Now s={s} dispatch={dispatch} />
          <Earlier s={s} />
        </div>
        <aside className="case-rail">
          <CaseFile s={s} />
          <Ask />
        </aside>
      </div>
    </div>
  )
}

/* Who has the ball. One marker, four parties: it slides to whoever acts next. */
function Lanes({ s }: { s: State }) {
  const owner = ball(s.step)
  const you: Party = s.role
  return (
    <section className="lanes" aria-label="Who has the ball" data-done={owner === null || undefined} style={{ ['--i' as string]: owner ? PARTIES.indexOf(owner) : 3 }}>
      <span className="lanes-ball" aria-hidden />
      {PARTIES.map((p) => (
        <div key={p} className="lane" data-on={p === owner || undefined}>
          <span className="eyebrow">
            {PEOPLE[p].role}
            <em data-on={p === you || undefined}>You</em>
          </span>
          <span className="lane-name">{p === 'carriers' ? carriersLabel(s) : PEOPLE[p].name}</span>
          <span className="lane-task">{p === owner ? TASK[s.step] : ' '}</span>
        </div>
      ))}
    </section>
  )
}

const submitted = (s: State) => MARKETS.filter((m) => s.markets[m.id]).length + 1 // plus the D&O incumbent
const carriersLabel = (s: State) => (at(s, 'awaitCarriers') ? `${submitted(s)} markets` : 'Not yet approached')

/* The one thing that needs doing now, for whoever has the ball. When the
   task changes, the old card fades out before the new one arrives. */
function Now({ s, dispatch }: Props) {
  const owner = ball(s.step)
  const key = `${s.step}:${owner === s.role}`
  const [shown, setShown] = useState({ s, key })
  const leaving = key !== shown.key
  // The card's height glides to the next task's, so what sits below never jumps
  const slot = useRef<HTMLDivElement>(null)
  const from = useRef(0)
  const height = () => (slot.current ? parseFloat(getComputedStyle(slot.current).height) : 0)
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => {
      from.current = height()
      setShown({ s, key })
    }, 170)
    return () => clearTimeout(t)
  }, [leaving, s, key])
  useLayoutEffect(() => {
    const el = slot.current
    if (!el || !from.current) return
    const to = height()
    if (Math.abs(from.current - to) > 0.5 && !matchMedia('(prefers-reduced-motion: reduce)').matches) el.animate([{ height: `${from.current}px` }, { height: `${to}px` }], { duration: 380, easing: 'cubic-bezier(0.3, 0.7, 0.2, 1)' })
    from.current = 0
  }, [shown.key])
  return (
    <div ref={slot} className="now-slot" data-target="now" data-leaving={leaving || undefined}>
      <Task key={shown.key} s={leaving ? shown.s : s} dispatch={dispatch} />
    </div>
  )
}

function Task({ s, dispatch }: Props) {
  const owner = ball(s.step)
  if (owner === 'client' || owner === 'carriers') return <External s={s} dispatch={dispatch} />
  if (owner && owner !== s.role) return <Internal s={s} dispatch={dispatch} owner={owner} />
  switch (s.step) {
    case 'brief':
      return <Brief s={s} dispatch={dispatch} />
    case 'outreach':
      return <Outreach s={s} dispatch={dispatch} />
    case 'handoff':
      return <Handoff s={s} dispatch={dispatch} />
    case 'markets':
      return <Markets s={s} dispatch={dispatch} />
    case 'responses':
      return <Responses s={s} dispatch={dispatch} />
    case 'quotes':
      return <Compare s={s} dispatch={dispatch} />
    case 'present':
      return <Present s={s} dispatch={dispatch} />
    default:
      return <Done s={s} dispatch={dispatch} />
  }
}

function Card({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="now">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

const COUNT = ['Nothing', 'One thing', 'Two things', 'Three things', 'Four things']

function Brief({ s, dispatch }: Props) {
  const [asking, setAsking] = useState<string | null>(null)
  const live = CHANGES.filter((c) => !s.dismissed[c.id])
  return (
    <Card eyebrow="Renewal brief · read from 23 sources" title={`${COUNT[live.length]} changed since Halcyon last renewed.`}>
      <ul className="changes">
        {CHANGES.map((c) => {
          const reason = s.dismissed[c.id]
          const open = s.openSource === c.id
          if (reason)
            return (
              <li key={c.id} className="change" data-dismissed>
                <span>
                  {c.label}: {c.after}
                </span>
                <span className="faint">Dismissed · {reason}</span>
                <button className="link" onClick={() => dispatch({ type: 'restore', id: c.id })}>
                  Undo
                </button>
              </li>
            )
          return (
            <li key={c.id} className="change" data-open={open || undefined}>
              <div className="change-row">
                <div className="change-text">
                  <p className="change-title">
                    <span className="faint">{c.label}</span>
                    {c.before && <span className="was">{c.before}</span>}
                    {c.before && <ArrowRight size={13} className="faint" />}
                    <mark>{c.after}</mark>
                  </p>
                  <p className="change-why">{c.matters}</p>
                </div>
                <button className="source" data-target={`src-${c.id}`} data-cursor="pointer" data-open={open || undefined} aria-expanded={open} onClick={() => dispatch({ type: 'source', id: c.id })}>
                  {c.source}
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="fold" data-open={open || undefined}>
                <div>
                  <blockquote className="evidence">
                    <p>{c.quote}</p>
                    <footer>
                      <span>{c.cite}</span>
                      {asking === c.id ? (
                        <span className="reasons">
                          {DISMISS_REASONS.map((r) => (
                            <button
                              key={r}
                              className="chip"
                              onClick={() => {
                                setAsking(null)
                                dispatch({ type: 'dismiss', id: c.id, reason: r })
                              }}
                            >
                              {r}
                            </button>
                          ))}
                        </span>
                      ) : (
                        <button className="link" onClick={() => setAsking(c.id)}>
                          Not right?
                        </button>
                      )}
                    </footer>
                  </blockquote>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="confirm">
        <p className="eyebrow">To confirm on the call</p>
        <ul>
          {TO_CONFIRM.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="strategy">
        <p className="eyebrow">Suggested strategy</p>
        {LINES.map((l) => (
          <div key={l.id} className="line">
            <div>
              <p className="line-name">{l.name}</p>
              <p className="faint small">
                {l.carrier} · {l.limit} · {l.premium}
              </p>
            </div>
            <div className="seg" role="radiogroup" aria-label={`${l.name} approach`}>
              {(['renew', 'remarket'] as const).map((v) => (
                <button key={v} role="radio" aria-checked={s.strategy[l.id] === v} data-on={s.strategy[l.id] === v || undefined} onClick={() => dispatch({ type: 'strategy', line: l.id, approach: v })}>
                  {v === 'renew' ? 'Renew' : 'Remarket'}
                </button>
              ))}
            </div>
            <p className="line-why">{l.why[s.strategy[l.id]]}</p>
          </div>
        ))}
      </div>

      <footer className="actions">
        <button className="btn" data-target="approve" data-cursor="pointer" onClick={() => dispatch({ type: 'approve' })}>
          Approve strategy
        </button>
        <span className="faint small">Nothing is sent until you approve.</span>
      </footer>
    </Card>
  )
}

function Email({ to, subject, value, onChange, label }: { to: string; subject: string; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="email">
      <p>
        <span className="faint">To</span> {to}
      </p>
      <p>
        <span className="faint">Subject</span> {subject}
      </p>
      <div className="email-body">
        <textarea aria-label={label} value={value} rows={value.split('\n').length + 3} spellCheck={false} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}

function Outreach({ s, dispatch }: Props) {
  return (
    <Card eyebrow="Outreach · drafted from the approved strategy" title="A first email to Priya, ready for your edits.">
      <Email to="Priya Raman" subject="Halcyon’s renewal on March 10" label="Outreach email" value={s.outreach} onChange={(text) => dispatch({ type: 'outreach', text })} />
      <ul className="attachments">
        {ATTACHMENTS.map((f) => (
          <li key={f.name}>
            <Paperclip size={15} />
            <span>{f.name}</span>
            <span className="faint">{f.note}</span>
          </li>
        ))}
      </ul>
      <footer className="actions">
        <button className="btn" data-target="send-outreach" data-cursor="pointer" onClick={() => dispatch({ type: 'sendOutreach' })}>
          Send to Priya
        </button>
        <button className="link" onClick={() => dispatch({ type: 'reopen' })}>
          Change strategy
        </button>
      </footer>
    </Card>
  )
}

function Handoff({ dispatch }: Props) {
  return (
    <Card eyebrow="Discovery · Nov 18, 26 minutes" title="The call settled every open question.">
      <ul className="facts">
        {CALL_FACTS.map((f) => (
          <li key={f.at}>
            <span className="stamp">{f.at}</span>
            <span>
              {f.text}
              {f.was && <span className="faint"> ({f.was})</span>}
            </span>
          </li>
        ))}
      </ul>
      <div className="package">
        <p className="eyebrow">Placement brief · complete</p>
        <ul>
          {PACKAGE.map((p) => (
            <li key={p.name}>
              <Check size={15} weight="bold" className="ok" />
              <span>{p.name}</span>
              <span className="faint">{p.note}</span>
            </li>
          ))}
        </ul>
      </div>
      <footer className="actions">
        <button className="btn" data-target="handoff" data-cursor="pointer" onClick={() => dispatch({ type: 'handoff' })}>
          Hand off to placement
        </button>
        <span className="faint small">Everything goes in one brief.</span>
      </footer>
    </Card>
  )
}

function Markets({ s, dispatch }: Props) {
  const n = MARKETS.filter((m) => s.markets[m.id]).length
  return (
    <Card eyebrow="Brief from Sam · Nov 18" title="Cyber goes to market at $5M. Choose where.">
      <p className="lede">
        Halcyon needs $5M of cyber and tech E&O for the Orbis contract, and Beacon stops at $3M. Revenue $14.2M, 112 staff, a UK entity holding EU data, no claims.
      </p>
      <div className="markets" role="group" aria-label="Markets">
        {MARKETS.map((m) => {
          const off = m.fit === 'Outside'
          return (
            <label key={m.id} className="market" data-on={s.markets[m.id] || undefined} data-off={off || undefined}>
              <input type="checkbox" checked={!!s.markets[m.id]} disabled={off} onChange={() => dispatch({ type: 'market', id: m.id })} />
              <span className="box" aria-hidden>
                <Check size={12} weight="bold" />
              </span>
              <span className="market-name">{m.name}</span>
              <span className="fit" data-fit={m.fit}>
                {m.fit}
              </span>
              <span className="market-days">{m.days}</span>
              <span className="market-why">{m.why}</span>
            </label>
          )
        })}
      </div>
      <p className="faint small note">Sample appetite and response times illustrate placement history. You choose the markets.</p>
      <footer className="actions">
        <button className="btn" data-target="submit" data-cursor="pointer" disabled={n === 0} onClick={() => dispatch({ type: 'submit' })}>
          Send {n} {n === 1 ? 'submission' : 'submissions'}
        </button>
        <span className="faint small">The D&O renewal request goes to Harbor at the same time.</span>
      </footer>
    </Card>
  )
}

function Responses({ s, dispatch }: Props) {
  const q = quoted(s)
  const rows: { id: string; name: string; status: 'Quote' | 'Declined' | 'Question'; text: string }[] = []
  if (s.markets.northlight) rows.push({ id: 'northlight', name: 'Northlight Specialty', status: 'Quote', text: '$41,800 at $5M' })
  if (s.markets.atlas) rows.push(s.answered ? { id: 'atlas', name: 'Atlas Cyber', status: 'Quote', text: '$39,400 at $5M' } : { id: 'atlas', name: 'Atlas Cyber', status: 'Question', text: 'EU records held by the UK entity?' })
  if (s.markets.beacon) rows.push({ id: 'beacon', name: 'Beacon Specialty', status: 'Quote', text: '$40,100 at $3M, its maximum' })
  if (s.markets.meridian) rows.push({ id: 'meridian', name: 'Meridian Underwriters', status: 'Declined', text: 'UK entity is outside appetite' })
  rows.push({ id: 'harbor', name: 'Harbor Mutual · D&O', status: 'Quote', text: '$44,900 at $5M' })
  const open = s.markets.atlas && !s.answered
  const title = q.length === 0 ? 'No market quoted at $5M.' : open ? 'The carriers replied. One has a question.' : s.markets.atlas ? `Question answered. ${q.length === 2 ? 'Two quotes' : 'One quote'} at $5M.` : 'Every carrier has replied.'
  return (
    <Card eyebrow="Carrier replies · sorted as they arrive" title={title}>
      <ul className="replies">
        {rows.map((r) => (
          <li key={r.id} data-status={r.status}>
            <span className="reply-name">{r.name}</span>
            <span className="status" data-status={r.status}>
              {r.status}
            </span>
            <span className="reply-text">{r.text}</span>
            {r.id === 'atlas' && (
              <div className="fold wide" data-open={r.status === 'Question' || undefined}>
                <div>
                  <div className="answer">
                    <p className="eyebrow">Answer found in the case file</p>
                    <p>About 40,000 records. Priya confirmed it on the discovery call, and it matches question 17 of the signed application.</p>
                    <p className="cites">
                      <span>
                        <Phone size={13} /> Call, 09:40
                      </span>
                      <span>
                        <FileText size={13} /> Application, Q17
                      </span>
                    </p>
                    <button className="btn" data-target="answer" data-cursor="pointer" tabIndex={r.status === 'Question' ? 0 : -1} onClick={() => dispatch({ type: 'answer' })}>
                      Send answer to Atlas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <footer className="actions">
        {q.length === 0 ? (
          <button className="btn" onClick={() => dispatch({ type: 'backToMarkets' })}>
            Choose more markets
          </button>
        ) : (
          <button className="btn" data-target="compare" data-cursor="pointer" disabled={open} onClick={() => dispatch({ type: 'compare' })}>
            {q.length === 2 ? 'Compare two quotes' : 'Review the quote'}
          </button>
        )}
        {s.markets.atlas && q.length > 0 && (
          <span className="faint small fade" data-off={!open || undefined}>
            No need to ask Sam or Priya. Atlas quotes once it has the answer.
          </span>
        )}
      </footer>
    </Card>
  )
}

function Compare({ s, dispatch }: Props) {
  const q = quoted(s)
  const pick = q.includes(s.pick) ? s.pick : q[0]
  return (
    <Card eyebrow="Cyber and tech E&O · terms read from the quote documents" title={q.length === 2 ? 'Compare two quotes.' : 'One quote against the expiring policy.'}>
      <div className="comparison-scroll"><table className="compare">
        <thead>
          <tr>
            <th />
            <th>
              <span className="faint">Expiring</span>
              <strong>Beacon</strong>
            </th>
            {q.map((id) => (
              <th key={id} data-pick={pick === id || undefined}>
                <button className="pick" aria-pressed={pick === id} onClick={() => dispatch({ type: 'pick', id })}>
                  <span className="radio" aria-hidden />
                  {pick === id ? 'Recommended' : 'Recommend'}
                </button>
                <strong>{CARRIER[id]}</strong>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {QUOTE_ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td className="faint">{r.expiring}</td>
              {q.map((id) => (
                <td key={id} data-pick={pick === id || undefined}>
                  {r.mark === id && q.length === 2 ? <mark>{r[id]}</mark> : r[id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>
      <label className="field">
        <span className="eyebrow">Your note to Sam</span>
        <textarea value={s.note} rows={3} onChange={(e) => dispatch({ type: 'note', text: e.target.value })} />
      </label>
      <footer className="actions">
        <button className="btn" data-target="recommend" data-cursor="pointer" onClick={() => dispatch({ type: 'recommend' })}>
          Send recommendation to Sam
        </button>
        <span className="faint small">D&O: Harbor at $5M for $44,900.</span>
      </footer>
    </Card>
  )
}

function Present({ s, dispatch }: Props) {
  return (
    <Card eyebrow="From placement · Maya’s recommendation" title="The options for Priya, in plain language.">
      <blockquote className="evidence solo">
        <p>{s.note}</p>
        <footer>
          <span>Maya Chen, Nov 30</span>
        </footer>
      </blockquote>
      <Email to="Priya Raman" subject="Your renewal options" label="Options email" value={s.options} onChange={(text) => dispatch({ type: 'options', text })} />
      <ul className="attachments">
        <li>
          <Paperclip size={15} />
          <span>Quote comparison</span>
          <span className="faint">One page</span>
        </li>
      </ul>
      <footer className="actions">
        <button className="btn" data-target="send-options" data-cursor="pointer" onClick={() => dispatch({ type: 'sendOptions' })}>
          Send options to Priya
        </button>
        <span className="faint small">The advice is yours. Edit anything before it goes.</span>
      </footer>
    </Card>
  )
}

function Done({ s, dispatch }: Props) {
  const q = quoted(s)
  const pick = q.includes(s.pick) ? s.pick : q[0]
  const premium = pick === 'atlas' ? '$39,400' : '$41,800'
  const total = pick === 'atlas' ? '$91,200' : '$93,600'
  const fixes = Object.keys(s.dismissed).length
  return (
    <Card eyebrow="Decided Dec 4 · 96 days before expiry" title={`Halcyon chose ${CARRIER[pick]}.`}>
      <table className="program">
        <tbody>
          <tr>
            <th scope="row">Cyber and tech E&O</th>
            <td>{CARRIER[pick]}</td>
            <td>$5M</td>
            <td>{premium}</td>
          </tr>
          <tr>
            <th scope="row">Directors and officers</th>
            <td>Harbor Mutual</td>
            <td>$5M</td>
            <td>$44,900</td>
          </tr>
          <tr>
            <th scope="row">General liability</th>
            <td>Kestrel</td>
            <td>$1M</td>
            <td>$6,900</td>
          </tr>
          <tr className="sum">
            <th scope="row">New program</th>
            <td className="faint">was {CLIENT.premium}</td>
            <td />
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
      <div className="confirm">
        <p className="eyebrow">How this renewal went</p>
        <ul>
          <li>Priya heard from Vouch three times: one outreach, one call, one set of options.</li>
          <li>Placement received one brief and sent nothing back.</li>
          {s.markets.atlas && <li>One carrier question, answered from the case file.</li>}
          <li>{fixes === 0 ? 'No corrections to the brief.' : `${fixes} ${fixes === 1 ? 'correction' : 'corrections'} to the brief, saved for review.`}</li>
        </ul>
      </div>
      <footer className="actions">
        <button className="btn quiet" onClick={() => dispatch({ type: 'reset' })}>
          Start the case again
        </button>
      </footer>
    </Card>
  )
}

/* The ball is with the client or the carriers. Nothing to do but wait; the
   skip control stands in for their reply and is marked as part of the demo. */
function External({ s, dispatch }: Props) {
  const copy: Partial<Record<Step, { eyebrow: string; title: string; body: string; skip: string; action: Action }>> = {
    awaitClient: {
      eyebrow: 'With Priya since Nov 10',
      title: 'Waiting on two applications and a call.',
      body: 'The case comes back to Sam when she replies. If a week passes, a reminder is drafted for him to send.',
      skip: 'Priya replies and joins the call',
      action: { type: 'clientReplies' },
    },
    awaitCarriers: {
      eyebrow: 'With the carriers since Nov 19',
      title: `${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][submitted(s)]} submissions are out.`,
      body: 'Each reply is filed as a quote, a decline or a question as it arrives. Maya gets the ball when there is something to act on.',
      skip: 'The carriers reply',
      action: { type: 'carriersRespond' },
    },
    awaitDecision: {
      eyebrow: 'With Priya since Nov 30',
      title: 'Waiting on her choice.',
      body: 'She has the comparison and Sam’s recommendation. The quotes stay valid until Dec 20.',
      skip: 'Priya chooses',
      action: { type: 'clientDecides' },
    },
  }
  const c = copy[s.step]!
  return (
    <section className="now waiting">
      <p className="eyebrow">{c.eyebrow}</p>
      <h2>{c.title}</h2>
      <p className="lede">{c.body}</p>
      <button className="skip" data-target="skip" data-cursor="pointer" onClick={() => dispatch(c.action)}>
        <FastForward size={15} weight="fill" />
        <span>
          <span className="faint">Demo · skip ahead</span>
          {c.skip}
        </span>
      </button>
    </section>
  )
}

/* The ball is with the other Vouch team. */
const DOING: Partial<Record<Step, string>> = {
  brief: 'Sam is reviewing the renewal brief.',
  outreach: 'Sam is writing to Priya.',
  handoff: 'Sam is preparing your brief.',
  markets: 'Maya is choosing markets.',
  responses: 'Maya is replying to a carrier.',
  quotes: 'Maya is comparing the quotes.',
  present: 'Sam is sending the options to Priya.',
}

function Internal({ s, dispatch, owner }: Props & { owner: Party }) {
  const p = PEOPLE[owner]
  const body =
    owner === 'placement'
      ? 'She has the full brief. You get the ball back when there are quotes to present.'
      : at(s, 'present')
        ? 'He has your recommendation. Nothing more is needed from placement.'
        : 'Nothing for placement yet. You get the ball when he hands off a complete brief.'
  return (
    <section className="now waiting">
      <p className="eyebrow">
        With {p.role.toLowerCase()} · {p.name}
      </p>
      <h2>{DOING[s.step]}</h2>
      <p className="lede">{body}</p>
      <button className="btn quiet" data-target="switch" data-cursor="pointer" onClick={() => dispatch({ type: 'role', role: owner as 'cm' | 'placement' })}>
        View as {p.role.toLowerCase()}
      </button>
    </section>
  )
}

function history(s: State) {
  const q = quoted(s)
  const pick = q.includes(s.pick) ? s.pick : q[0]
  const name = pick ? CARRIER[pick] : ''
  const rows: { from: Step; date: string; who: string; text: string }[] = [
    { from: 'done', date: 'Dec 4', who: 'Priya', text: `Chose ${name} for cyber and tech E&O` },
    { from: 'awaitDecision', date: 'Nov 30', who: 'Sam', text: 'Sent the options with a recommendation' },
    { from: 'present', date: 'Nov 30', who: 'Maya', text: `Recommended ${name}` },
    { from: 'responses', date: 'Nov 27', who: 'Carriers', text: 'Replied to every submission' },
    { from: 'awaitCarriers', date: 'Nov 19', who: 'Maya', text: `Sent ${submitted(s)} submissions` },
    { from: 'markets', date: 'Nov 18', who: 'Sam', text: 'Handed a complete brief to placement' },
    { from: 'handoff', date: 'Nov 18', who: 'Priya', text: 'Returned both applications and joined the discovery call' },
    { from: 'awaitClient', date: 'Nov 10', who: 'Sam', text: 'Sent outreach with two applications' },
    { from: 'outreach', date: 'Nov 10', who: 'Sam', text: 'Approved the renewal strategy' },
    { from: 'brief', date: 'Nov 10', who: 'Rule', text: 'Opened the case 120 days before expiry' },
  ]
  return rows.filter((r) => at(s, r.from))
}

function Earlier({ s }: { s: State }) {
  return (
    <section className="earlier">
      <p className="eyebrow">Earlier in this renewal</p>
      <ol>
        {history(s).map((h) => (
          <li key={h.from}>
            <span className="faint">{h.date}</span>
            <span className="who">{h.who}</span>
            <span>{h.text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

const KIND: Record<FileItem['kind'], ReactNode> = {
  crm: <Buildings size={16} />,
  doc: <FileText size={16} />,
  mail: <EnvelopeSimple size={16} />,
  web: <Globe size={16} />,
  call: <Phone size={16} />,
  quote: <QuoteIcon size={16} />,
}

function CaseFile({ s }: { s: State }) {
  const items = FILE.filter((f) => at(s, f.from))
  const total = items.reduce((n, f) => n + f.count, 0)
  return (
    <section className="file">
      <p className="eyebrow">
        Case file <span className="count">{total} sources</span>
      </p>
      <ul>
        {items.map((f) => (
          <li key={f.id} data-new={(f.from === s.step && s.step !== 'brief') || undefined}>
            {KIND[f.kind]}
            <span className="file-name">{f.name}</span>
            <span className="faint">{f.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Ask() {
  const [thread, setThread] = useState<{ q: string; a: string; cite?: string }[]>([])
  const [text, setText] = useState('')
  const send = (q: string) => {
    const hit = ASK.find((x) => x.q === q)
    setThread((t) => [...t, hit ?? { q, a: 'This prototype answers the three sample questions. In the product, every question is logged, so we learn what each team needs from what they ask.' }])
    setText('')
  }
  const left = ASK.filter((x) => !thread.some((t) => t.q === x.q))
  return (
    <section className="ask">
      <p className="eyebrow">Ask the case file</p>
      {thread.map((t, i) => (
        <div key={i} className="qa">
          <p className="q">{t.q}</p>
          <p>{t.a}</p>
          {t.cite && <p className="faint small">{t.cite}</p>}
        </div>
      ))}
      {left.length > 0 && (
        <div className="suggest">
          {left.map((x) => (
            <button key={x.q} className="chip" onClick={() => send(x.q)}>
              {x.q}
            </button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim()) send(text.trim())
        }}
      >
        <input aria-label="Ask about this renewal" placeholder="Ask about this renewal" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" aria-label="Ask" disabled={!text.trim()}>
          <ArrowRight size={16} />
        </button>
      </form>
    </section>
  )
}
