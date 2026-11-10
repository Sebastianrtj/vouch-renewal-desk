import { useEffect, useRef } from 'react'
import { STEPS, TASK, type DemoScene, type State } from './model'

const scenes: { id: DemoScene; label: string; steps: number[] }[] = [
  { id: 'brief', label: 'Brief', steps: [0] },
  { id: 'outreach', label: 'Outreach', steps: [1, 2, 3] },
  { id: 'placement', label: 'Placement', steps: [4, 5] },
  { id: 'quotes', label: 'Quotes', steps: [6, 7] },
  { id: 'decision', label: 'Client decision', steps: [8, 9, 10] },
]

export function Presenter({ s, onScene }: { s: State; onScene: (scene: DemoScene) => void }) {
  const index = STEPS.indexOf(s.step)
  const active = scenes.findIndex(scene => scene.steps.includes(index))
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const nav = ref.current
    const button = nav?.querySelector<HTMLElement>('[aria-current="step"]')
    if (nav && button && nav.scrollWidth > nav.clientWidth)
      nav.scrollTo({ left: button.offsetLeft - nav.offsetLeft - 8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [active])
  return (
    <nav className="presenter-nav" ref={ref} aria-label="Presentation demo scenes">
      {scenes.map((scene, i) => (
        <button key={scene.id} aria-current={active === i ? 'step' : undefined} onClick={() => onScene(scene.id)} title={`Load sample ${scene.label.toLowerCase()} scene`}>
          <span>{scene.label}</span>
          <small>{active === i ? TASK[s.step] : '\u00a0'}</small>
          <span className="presenter-segments" aria-hidden>{scene.steps.map(step => <i key={step} data-on={step <= index || undefined} />)}</span>
        </button>
      ))}
    </nav>
  )
}
