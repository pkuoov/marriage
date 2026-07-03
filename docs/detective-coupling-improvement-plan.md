# Detective Coupling Improvement Plan

This document applies `project-skills/detective-plot-coupling-review` to the current Steam demo pack. The goal is to make the cases feel more like fair-play detective stories inside a livestream call, not to turn the game into police investigation or a lecture.

## Structural Target

Each case should now be checked through this ledger:

1. Surface claim.
2. Dramatic object.
3. False solution.
4. Missing edge.
5. Interest path.
6. Caller edit.
7. Third pressure.
8. Reversal.
9. Truth boundary.
10. Final quote payoff.

The current pack already has dramatic objects, caller stakes, third pressure, truth boundaries, materials, and callback hooks. The next narrative pass should focus on coupling: each scene must set up, misdirect, revalue, or pay off another scene.

## Pack-Level Read

Current hidden thread: nice-sounding words and respectable documents are used to move money, responsibility, face, or opportunity onto someone else.

This thread is strong, but it needs to be felt through repeated detective structure, not explained in an opening thesis. The player should gradually notice the pattern:

- Case 1 uses "体面" to make debt feel like shared relationship pressure.
- Case 2 uses "自己人" to blur service warmth, sales routing, and emotional access.
- Case 3 uses "条件" and "诚信" to hide a negotiation over future money control.
- Case 4 uses "主责" and "流程" to split credit from payment risk.

The story pack should end by naming this pattern only after all cases have been played.

## Case 1: Credit Card / Decency

Current strength:

- The bill and social-security break create a concrete money timeline.
- The caller has a real self-edit: they were also drawn to the decent-looking life.
- The case has a strong false solution: "he lost his job and panicked."

Needed improvement:

- Make the false solution sharper before breaking it. Early dialogue should let the player almost accept "temporary panic" as a human explanation.
- Then make the missing edge land through timing: spending after job loss, urgency before bill review, and the demand for minimum repayment.
- Make one final quote point directly back to an earlier line about the deadline, so the ending feels earned by memory, not by result-card explanation.

Suggested clue roles:

- setup: bill deadline and "bonus came late" wording.
- misdirect: caller still remembers the decent version.
- missing-edge: social-security break and spending timeline.
- reversal: urgency was less about shame and more about preventing a full bill review.
- payoff: final quote that exposes who was being asked to carry the next payment.

## Case 2: Hair Salon / Insider

Current strength:

- The schedule and membership record make the service-world object concrete.
- The case naturally supports a Columbo-style interview: Tony's warmth can look innocent until the business route appears.
- The caller's self-edit is emotionally credible: they also liked the feeling of being treated as "one of us."

Needed improvement:

- Avoid letting the case flatten into "ambiguous flirting." The better false solution is "private warmth that got misunderstood."
- The reversal should be that the same warmth sits inside a conversion path: shifts, card sales, and selective attention.
- The material should revalue one harmless earlier detail, such as a schedule column or a familiar phrase Tony used with more than one person.

Suggested clue roles:

- setup: exclusive treatment or a familiar address.
- misdirect: the caller reads it as personal care.
- missing-edge: same service phrase or card route appears with another customer.
- reversal: "自己人" was both emotional bait and sales language.
- payoff: final quote that forces the host/player to distinguish feeling special from being routed.

## Case 3: Profile / Condition

Current strength:

- The MBA and bank-flow materials are a good red-herring pair.
- The caller's public reason and private concern already split: "honesty" versus future financial control.
- This case can be the best demonstration of mutual editing without gender-war framing.

Needed improvement:

- Do not let "MBA lied" be the whole detective answer. It should be the visible red herring.
- The deeper reversal should be why bank flow was requested and why the caller kept asking after already sensing the credential issue.
- Family or introducer pressure should be treated as an active third force, not background.

Suggested clue roles:

- setup: education and income labels appear as respectable screening words.
- misdirect: player focuses on the MBA mismatch.
- missing-edge: repeated demand for flows, not just balance or job title.
- reversal: the fight was also about who gets to audit whose future money.
- payoff: final quote that shows both sides used "conditions" to avoid saying their actual fear.

## Case 4: Workplace Reimbursement / Main Responsibility

Current strength:

- It already breaks the romance pattern by moving into workplace procedure.
- The second material gives the case a process difference from the first three.
- The caller's edit is useful: wanting main responsibility and wanting to avoid personal payment risk can coexist.

Needed improvement:

- Make the false solution "finance is slow" or "the coworker is just sloppy" feel plausible first.
- Then use the supplier/finance entry to reveal the true pressure: who keeps credit, who fronts money, and who controls the process.
- Use the workplace clock more aggressively: lunch break, finance cutoff, supplier deadline, or event day should make the player feel a closed-window detective problem.

Suggested clue roles:

- setup: approval screenshot shown as reassurance.
- misdirect: process delay feels ordinary.
- missing-edge: payment status and receiving route are absent.
- reversal: approval screenshot protected the opportunity while leaving payment risk outside the frame.
- payoff: final quote that separates "main responsibility" from "main risk."

## Data and Tooling Improvements

Add stable clue metadata in the next content schema pass:

- `sceneVersions[].id`: stable beat id; current JSON scenes are mostly position-based, which makes payoff review brittle.
- `sceneVersions[].clueRole`: `setup`, `misdirect`, `missing-edge`, `reversal`, or `payoff`.
- `sceneVersions[].falseFrame`: the tempting explanation this beat supports.
- `sceneVersions[].payoffFor`: earlier or later beat ids this line changes.
- `evidenceChecks[].revalues`: scene ids or quote ids that this material changes.
- `accusationChoices[].quoteSourceSceneId`: where the chosen line was first heard.

These fields are authoring and validation aids only. They should not appear in the UI.

## Next Editing Order

1. Add scene ids and clue roles to the four case JSON files.
2. Update `verify:pack` to require stable scene ids and at least one setup, misdirect, missing-edge, reversal, and payoff role per runtime-loaded case.
3. Rewrite each case only around missing roles, not all dialogue at once.
4. After the clue ledger is stable, tune host choices so each option represents a plausible false frame or sharper pressure question.
5. Only then write the next hidden-conspiracy thread. The thread should grow from repeated pressure mechanics already present in these four cases.

## Do Not Do Yet

- Do not add a dynamic barrage waterfall as the answer to weak coupling.
- Do not add a full phone simulator before the clue ledger works.
- Do not let AI free questioning invent new clue facts.
- Do not write the hidden conspiracy as an opening premise. It belongs in late callbacks and the final story-pack read.

