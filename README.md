# Renewal Desk — call version

Sebastian’s preferred product demo is the Halcyon Labs case on port **5183**. It keeps one growing case, one current task, and a clear owner across the client manager, client, placement team, and carriers.

## Open for the call

- [Presentation](http://localhost:5181/alex-renewal-discovery.html)
- [Live presenter mode](http://localhost:5183/?present=1&scene=brief#/halcyon-labs)
- [Normal product](http://localhost:5183/)

**Run demo** in the deck opens this product. **Back to slides** returns to the exact slide. Presenter mode adds five scene shortcuts at the bottom. Each loads an explicit sample snapshot; you can then use the normal product controls. The shortcuts automatically select the client manager or placement role needed for that task. They do not appear in the normal product.

## Suggested five-minute walkthrough

1. **Brief:** open the Orbis contract source. Explain what changed, why it matters, and why strategy approval stays with the broker. Approve the strategy to show the editable outreach.
2. **Outreach:** send the sample email, skip ahead to Priya’s reply and call, then hand off the completed brief. Switch to placement when prompted.
3. **Placement:** review the markets and submit. Skip ahead to carrier replies. Atlas’s question is answered from the existing call and application; comparison stays blocked until it is resolved.
4. **Quotes:** compare limits, retention, and EU cover. Choose a quote and send the recommendation to Sam. Switching the default quote also updates the default explanatory note; broker edits are preserved.
5. **Client decision:** edit the options email, send the sample options, and skip ahead to Priya’s choice. The chosen carrier and program totals follow the selection.

Use the scene bar if time is short or Alex asks about a later step. **Start the case again** resets the sample. Refresh loads the scene named in the URL.

## Relaunch

```sh
cd /Users/sebastian/Documents/ChatGPT/Vouch/tasks/renewal-desk
npm install
npm run present
```

This builds the product and presentation, starts their local servers, or reuses the existing Renewal Desk servers. Ctrl+C stops servers started by the command. For active development, `npm run dev` uses port 5183; stop the preview before switching because both use that port.

## Scope and verification

All clients, sources, applications, messages, appetite, quotes, and results are synthetic. Sending advances local UI state. There are no live AI, CRM, carrier, email, or binding integrations. The How it works cursor sequence is authored Stageshow animation, separate from the functional case controls. The technical architecture and evaluation slides describe a proposed build, not delivered integrations or measured results.

The existing design and motion are retained: rounded surfaces, moving ownership marker, expanding evidence, fading task handoffs, and smoothly changing card heights. Presenter navigation and press feedback use the same restrained easing. Reduced motion removes movement and the delayed card handoff.

Fresh-eye review found no urgent layout or motion defects in the final desktop/compact captures and sampled scene transitions. The quote table scrolls within its card on phones. A short recording is retained as `evidence/presenter-motion.mp4`; the 4fps contact sheet is a sampling check, not a frame-complete audit.

```sh
npm run build
npm run check:presenter
```

The browser check exercises the complete case, source inspection, editable outreach, ownership changes, the carrier-question gate, alternate quote selection and note, client totals, presenter jumps, deck embedding, exact slide return, and 1440/698/390px layouts. Captures are in `evidence/presenter-*.png`. No production integration or general AI accuracy is verified.

The requested inspiration sites, [Motion](https://motionin.design) and [Prompt Motion](https://prompt-motion.com), informed the restrained surface and navigation transitions. Stageshow’s upstream kit, licences, and notices remain under `src/kit/`.
