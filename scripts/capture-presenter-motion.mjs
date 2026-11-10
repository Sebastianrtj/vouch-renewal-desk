import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'chrome' })
await mkdir('evidence/motion', { recursive: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: 'evidence/motion', size: { width: 1440, height: 1000 } } })
const page = await context.newPage()
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
await page.goto('http://localhost:5183/?present=1&scene=brief#/halcyon-labs')
await page.getByRole('heading', { name: 'Halcyon Labs', exact: true }).waitFor()
await page.evaluate(() => document.fonts.ready)
await pause(700)
await page.locator('[data-target="src-contract"]').click()
await pause(950)
const nav = page.getByRole('navigation', { name: 'Presentation demo scenes' })
for (const name of ['Outreach', 'Placement', 'Quotes', 'Client decision', 'Brief']) {
  await nav.getByRole('button', { name: new RegExp('^' + name) }).click()
  await pause(1200)
}
const video = page.video()
await context.close()
console.log(await video.path())
await browser.close()
