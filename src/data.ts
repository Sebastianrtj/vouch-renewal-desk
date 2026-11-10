// Synthetic fixtures. Halcyon Labs, its people, carriers, figures and
// documents are invented for this prototype.

import type { LineId, Party, Step } from './model'

export const CLIENT = {
  name: 'Halcyon Labs',
  about: 'Developer tools for ML teams',
  renews: 'Mar 10, 2027',
  daysOut: 120,
  premium: '$76,600',
}

export const PEOPLE: Record<Party, { role: string; name: string; short: string }> = {
  cm: { role: 'Client manager', name: 'Sam Okafor', short: 'Sam' },
  client: { role: 'Client', name: 'Priya Raman, CFO', short: 'Priya' },
  placement: { role: 'Placement', name: 'Maya Chen', short: 'Maya' },
  carriers: { role: 'Carriers', name: 'Four markets', short: 'Carriers' },
}

export type Change = {
  id: string
  /** Rendered as before → after, the after value marked */
  label: string
  before?: string
  after: string
  matters: string
  source: string
  quote: string
  cite: string
}

export const CHANGES: Change[] = [
  {
    id: 'contract',
    label: 'Contract requirement',
    after: '$5M cyber limit',
    matters: 'The Orbis agreement requires $5M. The current cyber and tech E&O limit is $2M.',
    source: 'Email, Aug 2',
    quote: '“Vendor shall maintain technology errors and omissions and cyber liability insurance with limits of not less than $5,000,000 per claim.”',
    cite: 'Orbis MSA, section 11.2, attached to Priya’s certificate request',
  },
  {
    id: 'funding',
    label: 'Funding',
    after: '$45M Series B',
    matters: 'Boards usually ask for more D&O after a priced round. The current limit is $3M.',
    source: 'Press release',
    quote: '“Halcyon Labs today announced a $45 million Series B to expand its evaluation platform for machine learning teams.”',
    cite: 'halcyonlabs.example/news, Sep 16, 2026',
  },
  {
    id: 'uk',
    label: 'New entity',
    after: 'Halcyon Labs UK Ltd',
    matters: 'All three policies name the US entity only. Foreign cover needs confirming.',
    source: 'Email, Jun 14',
    quote: '“We’ve incorporated in the UK and signed a lease in Shoreditch. Do we need to do anything on the insurance side?”',
    cite: 'Priya Raman to Sam Okafor. No reply on file.',
  },
  {
    id: 'headcount',
    label: 'Headcount',
    before: '38',
    after: '112',
    matters: 'Moves the D&O application to a new band. There is no employment practices cover in the program.',
    source: 'Salesforce',
    quote: 'Employees: 112, updated Oct 28, 2026. Last year’s application stated 38.',
    cite: 'Account record, checked against LinkedIn (109 profiles)',
  },
]

export const DISMISS_REASONS = ['Out of date', 'Wrong company', 'Not relevant']

export const TO_CONFIRM = ['FY26 revenue. Last year’s application said $6.1M.', 'Whether the UK entity has employees or holds customer data.', 'Claims or incidents since March. None are on file.']

export type Line = { id: LineId; name: string; carrier: string; limit: string; premium: string; why: Record<'renew' | 'remarket', string> }

export const LINES: Line[] = [
  {
    id: 'cyber',
    name: 'Cyber and tech E&O',
    carrier: 'Beacon Specialty',
    limit: '$2M',
    premium: '$38,200',
    why: {
      remarket: 'Needs $5M. Beacon stops at $3M for this class.',
      renew: 'Beacon stops at $3M, so the Orbis requirement would not be met.',
    },
  },
  {
    id: 'dno',
    name: 'Directors and officers',
    carrier: 'Harbor Mutual',
    limit: '$3M',
    premium: '$31,500',
    why: {
      renew: 'Harbor offers $5M to post-Series B accounts. No claims.',
      remarket: 'Adds two to three weeks. Harbor already offers $5M.',
    },
  },
  {
    id: 'gl',
    name: 'General liability',
    carrier: 'Kestrel',
    limit: '$1M',
    premium: '$6,900',
    why: {
      renew: 'Nothing material changed for this line.',
      remarket: 'Little to gain. Nothing material changed for this line.',
    },
  },
]

export const ATTACHMENTS = [
  { name: 'Cyber and tech E&O application', note: '31 of 38 answers filled in' },
  { name: 'D&O renewal application', note: '22 of 26 answers filled in' },
]

export const CALL_FACTS = [
  { at: '04:12', text: 'FY26 revenue is $14.2M', was: 'was $6.1M' },
  { at: '09:40', text: 'UK entity has 9 employees and holds about 40,000 EU customer records' },
  { at: '14:32', text: 'MFA is enforced on every admin account' },
  { at: '17:05', text: 'No claims or incidents since last renewal' },
  { at: '21:18', text: 'The board asked for $5M of D&O after the Series B' },
]

export const PACKAGE = [
  { name: 'Signed applications', note: '2 of 2' },
  { name: 'Loss runs, five years', note: 'Requested Nov 11, received Nov 14' },
  { name: 'Financials', note: 'FY25 and FY26 year to date' },
  { name: 'SOC 2 Type II report', note: 'Found in Priya’s email of Sep 3' },
  { name: 'Likely carrier questions', note: '3 answered on the call' },
]

export type Fit = 'Strong' | 'Good' | 'Limited' | 'Outside'
export const MARKETS: { id: string; name: string; fit: Fit; days: string; why: string }[] = [
  { id: 'northlight', name: 'Northlight Specialty', fit: 'Strong', days: '5 days', why: 'Quoted 14 of 19 similar accounts.' },
  { id: 'atlas', name: 'Atlas Cyber', fit: 'Strong', days: '8 days', why: 'Usually asks about EU data.' },
  { id: 'meridian', name: 'Meridian Underwriters', fit: 'Good', days: '4 days', why: 'Declined 2 of 5 with a UK entity.' },
  { id: 'beacon', name: 'Beacon Specialty', fit: 'Limited', days: '6 days', why: 'Incumbent. Stops at $3M.' },
  { id: 'crestline', name: 'Crestline', fit: 'Outside', days: '', why: 'No tech E&O under 250 staff.' },
]

export const QUOTE_ROWS: { label: string; expiring: string; northlight: string; atlas: string; mark?: 'northlight' | 'atlas' }[] = [
  { label: 'Premium', expiring: '$38,200', northlight: '$41,800', atlas: '$39,400', mark: 'atlas' },
  { label: 'Limit', expiring: '$2M', northlight: '$5M', atlas: '$5M' },
  { label: 'Retention', expiring: '$25,000', northlight: '$25,000', atlas: '$50,000', mark: 'northlight' },
  { label: 'Social engineering', expiring: '$100,000', northlight: '$250,000', atlas: '$100,000', mark: 'northlight' },
  { label: 'EU regulatory cover', expiring: 'None', northlight: 'Full limit', atlas: '$1M cap', mark: 'northlight' },
  { label: 'Valid until', expiring: '', northlight: 'Dec 27', atlas: 'Dec 20' },
]

export type FileItem = { id: string; from: Step; kind: 'crm' | 'doc' | 'mail' | 'web' | 'call' | 'quote'; name: string; note: string; count: number }

export const FILE: FileItem[] = [
  { id: 'decision', from: 'done', kind: 'mail', name: 'Priya’s decision', note: 'Dec 4', count: 1 },
  { id: 'options', from: 'awaitDecision', kind: 'mail', name: 'Options sent to Priya', note: 'Nov 30', count: 1 },
  { id: 'rec', from: 'present', kind: 'doc', name: 'Placement recommendation', note: 'Maya, Nov 30', count: 1 },
  { id: 'replies', from: 'responses', kind: 'quote', name: 'Carrier replies', note: 'Nov 27', count: 4 },
  { id: 'subs', from: 'awaitCarriers', kind: 'mail', name: 'Submissions', note: 'Nov 19', count: 4 },
  { id: 'call', from: 'handoff', kind: 'call', name: 'Discovery call', note: 'Nov 18, 26 min', count: 1 },
  { id: 'signed', from: 'handoff', kind: 'doc', name: 'Signed applications and reports', note: '4 documents', count: 4 },
  { id: 'outreach', from: 'awaitClient', kind: 'mail', name: 'Outreach to Priya', note: 'Nov 10', count: 1 },
  { id: 'sf', from: 'brief', kind: 'crm', name: 'Salesforce account', note: 'Updated Oct 28', count: 1 },
  { id: 'policies', from: 'brief', kind: 'doc', name: 'Expiring policies', note: '3 documents', count: 3 },
  { id: 'apps', from: 'brief', kind: 'doc', name: 'Last year’s applications', note: '2 documents', count: 2 },
  { id: 'thread', from: 'brief', kind: 'mail', name: 'Email with Priya', note: '14 messages since March', count: 14 },
  { id: 'press', from: 'brief', kind: 'web', name: 'Series B press release', note: 'Sep 16', count: 1 },
  { id: 'li', from: 'brief', kind: 'web', name: 'LinkedIn headcount', note: '109 profiles', count: 1 },
  { id: 'msa', from: 'brief', kind: 'doc', name: 'Orbis MSA excerpt', note: 'Aug 2', count: 1 },
]

export const ASK: { q: string; a: string; cite: string }[] = [
  {
    q: 'Why remarket cyber?',
    a: 'The Orbis contract requires a $5M limit. Beacon, the current carrier, stops at $3M for software companies of this size, so it cannot meet the requirement on its own.',
    cite: 'Orbis MSA 11.2 · Placement history, Beacon',
  },
  {
    q: 'What did Priya ask that we never answered?',
    a: 'On June 14 she asked whether the new UK entity needed anything on the insurance side. There is no reply on file. It is the first item in the outreach.',
    cite: 'Email with Priya, Jun 14',
  },
  {
    q: 'What is the total premium at stake?',
    a: '$76,600 across three policies: $38,200 for cyber and tech E&O, $31,500 for D&O and $6,900 for general liability.',
    cite: 'Expiring policies',
  },
]

export const QUEUE = [
  { name: 'Tessel Health', renews: 'Feb 2', days: 84, lines: 'Cyber, D&O, EPL', premium: '$112,300', with: 'placement' as Party, task: 'Compare quotes' },
  { name: 'Fieldnote', renews: 'Feb 19', days: 101, lines: 'Tech E&O, GL', premium: '$24,100', with: 'client' as Party, task: 'Applications out' },
  { name: 'Quanta Freight', renews: 'Feb 26', days: 108, lines: 'Cyber, D&O', premium: '$58,750', with: 'carriers' as Party, task: 'Three submissions' },
  { name: 'Lumen Bio', renews: 'Mar 3', days: 113, lines: 'D&O, Product', premium: '$203,400', with: 'cm' as Party, task: 'Send outreach' },
]
