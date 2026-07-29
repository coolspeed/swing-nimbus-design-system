# Nimbus fidelity correction checklist

Reference: `design-system/screenshots/00.png`–`04.png` and the user-provided
detail crops for indeterminate progress, both horizontal-scrollbar comparisons,
and the titled border.

- [ ] Record the deployed web app URL in both `AGENTS.md` and the root `README.md`.
- [ ] Make widget surfaces matte and low-contrast instead of high-gloss.
- [ ] Remove decorative accent color from `SCREENSHOT-DERIVED UI KIT` and enforce Nimbus color restraint: reserve color for functional state, selection, focus, progress, and semantic feedback.
- [ ] Scale every web widget down one compact size to match the screenshot density, including typography, chrome, buttons, inputs, tabs, table rows, progress bars, scrollbars, messages, and internal windows.
- [ ] Reduce excessive widget padding, especially the tabs' vertical padding.
- [ ] Match the OpenJDK Nimbus font mapping, sizes, and font weights.
- [ ] Make the selected tab use the reference Nimbus blue-grey color.
- [ ] Reduce the Upload progress bar height and render `72%` inside the bar.
- [ ] Recreate Background task as a full-width orange bar containing one continuous horizontal stream: narrow and wide sections both have short plateaus, cubic curves smoothly connect their thicknesses, and the 44 px pattern flows sideways every 0.8 s. Do not fake it with semicircle outlines or a straight skewer line with ellipses.
- [ ] Add the two bright-orange tone-on-tone vertical highlight lines visible inside every repeating orange droplet, synchronized with the Background task stream.
- [ ] Recreate the horizontal scrollbar at the reference proportions: compact 18 px track, narrow 31 px end buttons whose shallow concave inner edges are truly masked/cut out (never simulated by a painted overlay patch), and a centered thumb with a flat top and rounded lower corners.
- [ ] Recreate the Swing `TitledBorder`/group-box gap without a painted-over background patch.
- [ ] Ensure table rows do not change background or otherwise react visually on mouse hover.
- [ ] Render Ready, Draft, and In review as plain table text with no color, fill, border, pill, or rounded-square treatment.
- [ ] Keep Success, Information, Warning, and Error message boxes unfilled: semantic color may appear on the border/title/icon, never as a background tint.
- [ ] Keep or add automated contracts for the fidelity requirements.
- [ ] Verify the Java catalog still compiles and document the Java build/run commands in the handoff.
- [ ] Pass an adversarial subagent review against every item in this checklist.
