// Captures the README images from the running dev server: node scripts/readme-shots.mjs
import { launch } from './browser.mjs'
const base = process.argv[2] ?? 'http://localhost:5183'
const browser = await launch()
const ctx = await browser.newContext({ viewport: { width: 1360, height: 850 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const click = async (t) => { await page.click(`[data-target="${t}"]`); await page.waitForTimeout(900) }
const shot = async (name, y = 0) => { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(500); await page.screenshot({ path: `docs/${name}.png` }) }
await page.goto(`${base}/#/halcyon-labs`); await page.waitForTimeout(1500)
await click('src-contract'); await shot('brief')
for (const t of ['approve', 'send-outreach', 'skip', 'handoff', 'switch']) await click(t)
await shot('markets', 150)
for (const t of ['submit', 'skip']) await click(t)
await shot('answer', 150)
for (const t of ['answer', 'compare']) await click(t)
await shot('quotes', 150)
await page.goto(`${base}/#/how-it-works`); await page.waitForTimeout(800)
await page.evaluate(() => document.querySelector('.steps').scrollIntoView({ block: 'center' })); await page.waitForTimeout(500)
await page.screenshot({ path: 'docs/workflow.png' })
await ctx.close()
// The walkthrough, recorded at real speed
const vctx = await browser.newContext({ viewport: { width: 1228, height: 790 }, recordVideo: { dir: 'docs/_video', size: { width: 1228, height: 790 } } })
const v = await vctx.newPage()
await v.goto(`${base}/?capture=tour`); await v.waitForTimeout(33000)
await vctx.close(); await browser.close()
