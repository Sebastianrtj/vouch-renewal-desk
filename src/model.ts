// One renewal case as a single growing record. Every screen is a pure
// function of this state, so the live prototype and the authored walkthrough
// render the same components.

export type Role = 'cm' | 'placement'
export type DemoScene = 'brief' | 'outreach' | 'placement' | 'replies' | 'quotes' | 'decision'
export type Party = 'cm' | 'client' | 'placement' | 'carriers'
export type Step =
  | 'brief'
  | 'outreach'
  | 'awaitClient'
  | 'handoff'
  | 'markets'
  | 'awaitCarriers'
  | 'responses'
  | 'quotes'
  | 'present'
  | 'awaitDecision'
  | 'done'

export const STEPS: Step[] = ['brief', 'outreach', 'awaitClient', 'handoff', 'markets', 'awaitCarriers', 'responses', 'quotes', 'present', 'awaitDecision', 'done']

export type LineId = 'cyber' | 'dno' | 'gl'
export type Approach = 'renew' | 'remarket'

export type State = {
  step: Step
  role: Role
  strategy: Record<LineId, Approach>
  /** Change id → reason the client manager gave for dismissing it */
  dismissed: Record<string, string>
  /** Change id whose evidence is open */
  openSource: string | null
  outreach: string
  markets: Record<string, boolean>
  answered: boolean
  pick: 'northlight' | 'atlas'
  note: string
  options: string
}

export const OUTREACH = `Hi Priya,

Halcyon's policies renew on March 10. A lot has changed since last year, so I'd like to make sure the cover has kept up: the Series B, the London entity, the team growing to 112, and the $5M cyber requirement in the Orbis contract.

I've attached both applications with last year's answers filled in. 11 questions need your input, all marked.

Could we take 30 minutes next week? Tuesday 10:00, Wednesday 14:30 and Thursday 11:00 Eastern are open on my side.

Sam`

export const NOTE = `Northlight is $2,400 more than Atlas, with half the retention and full EU regulatory cover. With the London entity, that cover matters more than the saving.`
const ATLAS_NOTE = `Atlas saves $2,400 in premium. Its retention is $50,000 and EU regulatory cover is capped at $1M. Review those tradeoffs with Priya before choosing.`

const QUOTE = {
  northlight: 'Northlight: $41,800, a $25,000 retention, and full cover for EU regulatory action',
  atlas: 'Atlas: $39,400, a $50,000 retention, and EU regulatory cover capped at $1M',
}

/** The options email, written from what was actually quoted and recommended. */
export function optionsFor(s: Pick<State, 'markets' | 'pick'>): string {
  const q = quoted(s)
  const pick = q.includes(s.pick) ? s.pick : q[0]
  const other = q.find((id) => id !== pick)
  const n = Object.values(s.markets).filter(Boolean).length
  return `Hi Priya,

We took cyber to ${n === 1 ? 'one market' : `${['', '', 'two', 'three', 'four', 'five'][n]} markets`}. ${q.length === 2 ? 'Two quoted' : 'One quoted'} at the $5M limit Orbis requires. Your current carrier stops at $3M for companies like Halcyon.

Our recommendation is ${QUOTE[pick]}.${other ? ` The alternative is ${QUOTE[other]}.` : ''}

D&O renews with Harbor at the $5M your board asked for: $44,900. General liability renews unchanged.

The comparison is attached. Happy to walk through it on a call.

Sam`
}

export const quoted = (s: Pick<State, 'markets'>) => (['northlight', 'atlas'] as const).filter((id) => s.markets[id])

export const initial: State = {
  step: 'brief',
  role: 'cm',
  strategy: { cyber: 'remarket', dno: 'renew', gl: 'renew' },
  dismissed: {},
  openSource: null,
  outreach: OUTREACH,
  markets: { northlight: true, atlas: true, meridian: true, beacon: false, crestline: false },
  answered: false,
  pick: 'northlight',
  note: NOTE,
  options: '',
}

export type Action =
  | { type: 'demoScene'; scene: DemoScene }
  | { type: 'role'; role: Role }
  | { type: 'source'; id: string }
  | { type: 'dismiss'; id: string; reason: string }
  | { type: 'restore'; id: string }
  | { type: 'strategy'; line: LineId; approach: Approach }
  | { type: 'approve' }
  | { type: 'reopen' }
  | { type: 'outreach'; text: string }
  | { type: 'sendOutreach' }
  | { type: 'clientReplies' }
  | { type: 'handoff' }
  | { type: 'market'; id: string }
  | { type: 'submit' }
  | { type: 'carriersRespond' }
  | { type: 'answer' }
  | { type: 'backToMarkets' }
  | { type: 'compare' }
  | { type: 'pick'; id: State['pick'] }
  | { type: 'note'; text: string }
  | { type: 'recommend' }
  | { type: 'options'; text: string }
  | { type: 'sendOptions' }
  | { type: 'clientDecides' }
  | { type: 'reset' }

export function reduce(s: State, a: Action): State {
  switch (a.type) {
    case 'demoScene':
      return demoScene(a.scene)
    case 'role':
      return { ...s, role: a.role }
    case 'source':
      return { ...s, openSource: s.openSource === a.id ? null : a.id }
    case 'dismiss':
      return { ...s, dismissed: { ...s.dismissed, [a.id]: a.reason }, openSource: null }
    case 'restore': {
      const { [a.id]: _, ...rest } = s.dismissed
      return { ...s, dismissed: rest }
    }
    case 'strategy':
      return { ...s, strategy: { ...s.strategy, [a.line]: a.approach } }
    case 'approve':
      return { ...s, step: 'outreach', openSource: null }
    case 'reopen':
      return { ...s, step: 'brief' }
    case 'outreach':
      return { ...s, outreach: a.text }
    case 'sendOutreach':
      return { ...s, step: 'awaitClient' }
    case 'clientReplies':
      return { ...s, step: 'handoff' }
    case 'handoff':
      return { ...s, step: 'markets' }
    case 'market':
      return { ...s, markets: { ...s.markets, [a.id]: !s.markets[a.id] } }
    case 'submit':
      return { ...s, step: 'awaitCarriers' }
    case 'carriersRespond':
      return { ...s, step: 'responses' }
    case 'answer':
      return { ...s, answered: true }
    case 'backToMarkets':
      return { ...s, step: 'markets', answered: false }
    case 'compare':
      return { ...s, step: 'quotes' }
    case 'pick':
      return { ...s, pick: a.id, note: [NOTE, ATLAS_NOTE].includes(s.note) ? (a.id === 'atlas' ? ATLAS_NOTE : NOTE) : s.note }
    case 'note':
      return { ...s, note: a.text }
    case 'recommend':
      return { ...s, step: 'present', options: optionsFor(s) }
    case 'options':
      return { ...s, options: a.text }
    case 'sendOptions':
      return { ...s, step: 'awaitDecision' }
    case 'clientDecides':
      return { ...s, step: 'done' }
    case 'reset':
      return { ...initial, role: s.role }
  }
}

/** Presenter shortcuts load explicit synthetic snapshots via the normal reducer. */
export function demoScene(scene: DemoScene): State {
  const target: Record<DemoScene, Step> = { brief: 'brief', outreach: 'outreach', placement: 'markets', replies: 'responses', quotes: 'quotes', decision: 'present' }
  const actions: Action[] = [{ type: 'approve' }, { type: 'sendOutreach' }, { type: 'clientReplies' }, { type: 'handoff' }, { type: 'submit' }, { type: 'carriersRespond' }, { type: 'answer' }, { type: 'compare' }, { type: 'recommend' }]
  let state = { ...initial }
  for (const action of actions) {
    if (state.step === target[scene]) break
    state = reduce(state, action)
  }
  return { ...state, role: ['placement', 'replies', 'quotes'].includes(scene) ? 'placement' : 'cm' }
}

export const at = (s: State, step: Step) => STEPS.indexOf(s.step) >= STEPS.indexOf(step)

/** Who has to act next. null once the renewal is decided. */
export function ball(step: Step): Party | null {
  switch (step) {
    case 'brief':
    case 'outreach':
    case 'handoff':
    case 'present':
      return 'cm'
    case 'awaitClient':
    case 'awaitDecision':
      return 'client'
    case 'markets':
    case 'responses':
    case 'quotes':
      return 'placement'
    case 'awaitCarriers':
      return 'carriers'
    case 'done':
      return null
  }
}

export const TASK: Record<Step, string> = {
  brief: 'Review the renewal brief',
  outreach: 'Send the outreach',
  awaitClient: 'Applications and a call',
  handoff: 'Hand off to placement',
  markets: 'Choose the markets',
  awaitCarriers: 'Reviewing submissions',
  responses: 'Answer a carrier question',
  quotes: 'Recommend a quote',
  present: 'Send the options to Priya',
  awaitDecision: 'Choosing an option',
  done: 'Renewal decided',
}
