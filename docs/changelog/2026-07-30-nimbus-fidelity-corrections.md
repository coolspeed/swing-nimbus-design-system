# Nimbus fidelity correction checklist

Status: completed on 2026-07-30.

Reference: `design-system/screenshots/00.png`–`04.png` and the user-provided
detail crops for indeterminate progress, both horizontal-scrollbar comparisons,
and the titled border.

- [x] Record the deployed web app URL in both `AGENTS.md` and the root `README.md`.
- [x] Make widget surfaces matte and low-contrast instead of high-gloss.
- [x] Remove the `SCREENSHOT-DERIVED UI KIT` eyebrow entirely and enforce Nimbus color restraint: reserve color for functional state, selection, focus, progress, and semantic feedback.
- [x] Scale every web widget down one compact size to match the screenshot density, including typography, chrome, buttons, inputs, tabs, table rows, progress bars, scrollbars, messages, and internal windows.
- [x] Reduce the desktop app-window itself one more step to a `1200 × 720 px` maximum with about 70 px of visible outer margin instead of nearly filling the browser viewport.
- [x] Reduce excessive widget padding, especially the tabs' vertical padding.
- [x] Match the OpenJDK Nimbus font mapping, sizes, and font weights.
- [x] Make the selected tab use the reference Nimbus blue-grey color.
- [x] Reduce the Upload progress bar height and render `72%` inside the bar.
- [x] Remove the non-reference `Adjust progress` label and slider; keep Upload progress as a static `72%` example.
- [x] Recreate Background task as a full-width orange bar containing one continuous horizontal stream: narrow and wide sections both have short plateaus, cubic curves smoothly connect their thicknesses, and the 44 px pattern flows sideways every 0.8 s. Do not fake it with semicircle outlines or a straight skewer line with ellipses.
- [x] Keep the Background task stream's wide plateau near 11 px inside the 14 px bar, leaving at least 1.5 px vertical clearance so it never spills into the border.
- [x] Add the two bright-orange tone-on-tone vertical highlight lines visible inside every repeating orange droplet, synchronized with the Background task stream.
- [x] Recreate the horizontal scrollbar at the final compact proportions: 14 px track, 24 px end buttons whose shallow concave inner edges are truly masked/cut out (never simulated by a painted overlay patch), and a centered thumb with a flat top and rounded lower corners.
- [x] Match the horizontal scrollbar thumb to the reference's nearly neutral pale blue-grey face and restrained dark outline; do not use a conspicuous saturated blue fill.
- [x] Recreate the Swing `TitledBorder`/group-box gap without a painted-over background patch.
- [x] Ensure table rows do not change background or otherwise react visually on mouse hover.
- [x] Keep table rows mouse- and keyboard-selectable; only a genuinely selected row uses the Nimbus dark-navy `#39698A` highlight with white text and synchronized `aria-selected`.
- [x] Make Recent activity ignore hover visuals but remain mouse- and keyboard-selectable, using the same `#39698A`/white selected-state treatment and `aria-selected` contract as the table.
- [x] Render Ready, Draft, and In review as plain table text with no color, fill, border, pill, or rounded-square treatment.
- [x] Keep Success, Information, Warning, and Error message boxes unfilled: semantic color may appear on the border/title/icon, never as a background tint.
- [x] Remove the green dot before `Ready • Nimbus Look & Feel`; keep the status-bar phrase as neutral plain text.
- [x] Make JLabel-equivalent web labels, legends, captions, and status text non-selectable while preserving selection for user-copyable values and body content.
- [x] Keep or add automated contracts for the fidelity requirements.
- [x] Verify the Java catalog still compiles and document the Java build/run commands in the handoff.

Automatic adversarial review was withdrawn by the user; final visual acceptance is manual.
