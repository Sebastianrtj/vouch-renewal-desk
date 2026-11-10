import { Tour } from './Tour'

type Kind = 'Rule' | 'AI drafts' | 'Person decides'
const STEPS: { today: string; who: string; desk: string; why: string; kinds: Kind[] }[] = [
  { today: 'Renewal alert at 120 days', who: 'Client manager', desk: 'A date rule opens the case and gathers the file.', why: 'One input, one outcome. A model adds nothing but risk.', kinds: ['Rule'] },
  { today: 'Build the picture, set a strategy', who: 'Client manager', desk: 'Reads policies, emails and public news into a sourced brief of what changed, with a strategy per policy.', why: 'Hours of reading scattered, unstructured text. The decision stays with the broker.', kinds: ['AI drafts', 'Person decides'] },
  { today: 'Outreach, application, discovery call', who: 'Client manager', desk: 'Drafts the email, fills in last year’s answers, turns the call into confirmed facts.', why: 'Repetitive writing from known context. A better-prepared call replaces later back and forth.', kinds: ['AI drafts'] },
  { today: 'Package to placement', who: 'Client manager', desk: 'A checklist blocks a partial handoff. Likely carrier questions are answered up front.', why: 'Completeness is a rule. Predicting questions is pattern-matching on past submissions.', kinds: ['Rule', 'AI drafts'] },
  { today: 'Choose markets', who: 'Placement', desk: 'Shows appetite and response times counted from placement history.', why: 'These are facts to look up, not text to generate. Placement chooses.', kinds: ['Rule', 'Person decides'] },
  { today: 'Submit, then back and forth', who: 'Placement and carriers', desk: 'Sorts each reply into quote, decline or question, and answers from the case file when it can.', why: 'Free-text email in, a small set of labels out. Most questions were already answered once.', kinds: ['AI drafts'] },
  { today: 'Quotes and declinations', who: 'Placement', desk: 'Reads every quote into one table on the same terms. Placement recommends.', why: 'Each carrier formats quotes differently. Which one is better is judgment.', kinds: ['AI drafts', 'Person decides'] },
  { today: 'Present, client decides', who: 'Client manager and client', desk: 'Drafts the options in plain language for the broker to edit and send.', why: 'Vouch owes the client its own advice. The model never sends.', kinds: ['AI drafts', 'Person decides'] },
]

export function How({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="how">
      <h1>
        One case that grows, and one answer to <mark>who has the ball.</mark>
      </h1>
      <p className="lede">
        A renewal today is eight steps across two teams, a client and several carriers, mostly in email. Renewal Desk keeps it in one place: everything known about the client, what changed, and whose move it is.
      </p>

      <Tour />

      <section>
        <h2>Where AI helps, and where it should not</h2>
        <p className="lede">Rules where the answer must be the same every time. A model where the input is messy text. A person wherever Vouch is giving advice.</p>
        <ol className="steps">
          {STEPS.map((x, i) => (
            <li key={x.today}>
              <span className="n">{i + 1}</span>
              <div>
                <p className="step-today">{x.today}</p>
                <p className="faint small">{x.who}</p>
              </div>
              <div>
                <p>{x.desk}</p>
                <p className="faint small">{x.why}</p>
              </div>
              <div className="kinds">
                {x.kinds.map((k) => (
                  <span key={k} className="kind" data-kind={k}>
                    {k}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="first">
        <h2>What to build first</h2>
        <div className="two">
          <div>
            <p className="eyebrow">First</p>
            <h3>The case file</h3>
            <p>One record per renewal that every email, document and call lands in, with the ball always on one party. Everything else is built on it.</p>
            <p className="faint small">How we would know: fewer handoffs sent back by placement, and fewer client emails per renewal.</p>
          </div>
          <div>
            <p className="eyebrow">Second</p>
            <h3>The change brief</h3>
            <p>What changed since the last renewal, each point with its source, ready before the discovery call. The most reading saved for the least risk.</p>
            <p className="faint small">How we would know: brokers open it before most renewal calls, and dismiss few of its points.</p>
          </div>
        </div>
        <p className="faint small note">These measures are proposals. Nothing in this prototype has been measured.</p>
        <button className="btn" onClick={onOpen}>
          Open the worked example
        </button>
      </section>
    </div>
  )
}
