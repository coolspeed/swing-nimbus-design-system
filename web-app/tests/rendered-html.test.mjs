import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://nimbus.test/", {
      headers: {
        accept: "text/html",
        host: "nimbus.test",
        "x-forwarded-host": "nimbus.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Nimbus design-system catalog", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Nimbus Swing Design System — Web Edition<\/title>/i);
  assert.match(html, /Nimbus component showcase/);
  assert.match(html, /data-testid="tab-foundations"/);
  assert.match(html, /#D6D9DF/);
  assert.match(html, /#33628C/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /https:\/\/nimbus\.test\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps the design-system tokens and interactive contracts explicit", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.ok(page.includes('data-testid={`tab-${tab.id}`}'));
  for (const tab of ["foundations", "controls", "data", "feedback", "dialogs"]) {
    assert.match(page, new RegExp(`panel-${tab}`));
  }

  assert.match(page, /data-testid="component-table"/);
  assert.match(page, /<td>\{row\.status\}<\/td>/);
  assert.doesNotMatch(page, /status-pill|status-ready|status-draft|status-in-review/);
  assert.match(page, /data-testid=\{`dialog-\$\{type\}`\}/);
  assert.match(page, /className="progress-value">72%/);
  assert.doesNotMatch(page, /Adjust progress|progress-control/);
  assert.match(page, /progress-indeterminate-pattern/);
  assert.match(page, /Array\.from\(\{ length: 24 \}/);
  assert.match(page, /scroll-arrow-left/);
  assert.match(page, /scroll-arrow-right/);
  assert.match(page, /const \[scrollPosition,\s*setScrollPosition\] = useState\(50\)/);
  assert.match(page, /onClick=\{\(\) => moveScrollbar\(-10\)\}/);
  assert.match(page, /onClick=\{\(\) => moveScrollbar\(10\)\}/);
  assert.match(page, /role="slider"[\s\S]*?aria-valuenow=\{Math\.round\(scrollPosition\)\}/);
  assert.match(page, /left:\s*`\$\{scrollPosition\}%`[\s\S]*?transform:\s*`translateX\(-\$\{scrollPosition\}%\)`/);
  assert.doesNotMatch(page, /scrollPosition \* 0\.73/);
  assert.match(page, /scrollThumbRef\.current\?\.getBoundingClientRect\(\)\.width/);
  assert.match(page, /setPointerCapture\(event\.pointerId\)/);
  assert.match(page, /event\.key === "Home"[\s\S]*?event\.key === "End"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /event\.altKey/);
  assert.match(css, /--canvas:\s*#d6d9df/i);
  assert.match(css, /--focus:\s*#73a4d1/i);
  assert.match(css, /--font-ui:\s*Arial,\s*"Malgun Gothic",\s*sans-serif/i);
  assert.doesNotMatch(css, /--font-ui:[^;]*Segoe UI/i);
  assert.match(css, /body\s*\{[\s\S]*?font-size:\s*12px/i);
  assert.match(css, /\.app-window\s*\{[\s\S]*?width:\s*min\(1200px,\s*calc\(100vw - 140px\)\)[\s\S]*?height:\s*min\(720px,\s*calc\(100vh - 140px\)\)/i);
  assert.match(css, /\.nimbus-button,[\s\S]*?\.nimbus-select\s*\{[\s\S]*?min-height:\s*23px/i);
  assert.match(css, /\.nimbus-input\s*\{[\s\S]*?min-height:\s*23px/i);
  assert.doesNotMatch(page, /SCREENSHOT-DERIVED UI KIT|status-dot/i);
  assert.match(css, /label,[\s\S]*?\.status-bar\s*\{[\s\S]*?user-select:\s*none/i);
  assert.match(css, /\.tab-strip button\s*\{[\s\S]*?height:\s*24px/i);
  assert.match(css, /\.tab-strip button\[aria-selected="true"\]\s*\{[\s\S]*?linear-gradient\(#e3eaef 0%,\s*#cdd8e2 36%,\s*#baccda 66%,\s*#a5bacc 100%\)/i);
  assert.match(css, /\.progress-track\s*\{[\s\S]*?height:\s*16px/i);
  assert.match(css, /animation:\s*indeterminate \.8s linear infinite/i);
  assert.match(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?background:\s*linear-gradient\(#fafafa 0%,\s*#e7e8e9 52%,\s*#f5f5f6 100%\)/i);
  assert.doesNotMatch(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?background:\s*#d87a12/i);
  assert.match(css, /\.progress-track\.indeterminate \.progress-indeterminate-pattern\s*\{[\s\S]*?top:\s*50%[\s\S]*?height:\s*14px[\s\S]*?margin-top:\s*-7px/i);
  assert.match(css, /\.progress-indeterminate-pattern::before\s*\{[\s\S]*?inset:\s*6px 0 auto[\s\S]*?height:\s*2px[\s\S]*?linear-gradient\(#e9a348,\s*#c96d0b 58%,\s*#e58b20\)/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?flex:\s*0 0 45px[\s\S]*?margin-right:\s*-1px/i);
  assert.match(css, /clip-path:\s*path\("M -1 6 C 3 6 5 6 7 5\.5/i);
  assert.match(css, /C 18 1\.5 20 1\.5 22 1\.5/);
  assert.match(css, /C 39 6 41 6 45 6 L 45 8/i);
  assert.doesNotMatch(css, /radial-gradient\(ellipse 18px 9px at 50% 50%/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?rgba\(255,190,105,\.88\) 35% 37%[\s\S]*?rgba\(255,190,105,\.88\) 63% 65%[\s\S]*?linear-gradient\(#e9a348 0%,\s*#c96d0b 58%,\s*#e58b20 100%\)/i);
  assert.match(css, /\.fake-scrollbar\s*\{[\s\S]*?height:\s*14px[\s\S]*?grid-template-columns:\s*24px 1fr 24px/i);
  assert.match(css, /\.fake-scrollbar \.scroll-track\s*\{[\s\S]*?left:\s*-7px[\s\S]*?width:\s*calc\(100% \+ 14px\)[\s\S]*?touch-action:\s*none/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?width:\s*27%/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?transition:/i);
  assert.match(css, /border-radius:\s*0 0 11px 11px/i);
  assert.match(css, /background:\s*linear-gradient\(#cbd4db 0%,\s*#ccd8e4 20%,\s*#acc1d4 42%,\s*#bbd0e3 58%,\s*#cbe0ef 76%,\s*#def1f8 100%\)/i);
  assert.match(css, /border:\s*1px solid #4c5e6f/i);
  assert.match(css, /mask:\s*radial-gradient\(circle 7px at 100% 50%,\s*transparent 0 6px,\s*#000 7px\)/i);
  assert.doesNotMatch(css, /radial-gradient\(circle at (?:100%|0) 50%,\s*#dfe2e5/i);
  assert.match(css, /\.nimbus-fieldset\s*\{[\s\S]*?background:\s*var\(--canvas\)[\s\S]*?box-shadow:\s*none/i);
  assert.doesNotMatch(css, /tbody\s+tr:hover|activity-panel\s+li:hover|status-pill|status-ready|status-draft|status-in-review/i);
  assert.match(page, /aria-selected=\{selectedRow === row\.component\}/i);
  assert.match(css, /tbody tr\[aria-selected="true"\]\s*\{[\s\S]*?background:\s*#39698a/i);
  assert.match(page, /aria-selected=\{selectedActivity === id\}/i);
  assert.match(css, /\.activity-panel li\[aria-selected="true"\]\s*\{[\s\S]*?background:\s*#39698a/i);
  assert.doesNotMatch(css, /\.notice-(?:success|information|warning|danger)\s*\{[^}]*background\s*:/i);
  assert.match(css, /container:\s*nimbus-window\s*\/\s*inline-size/i);
  assert.match(css, /@media \(min-width:\s*981px\)[\s\S]*?\.app-window\.view-tablet\s*\{[\s\S]*?width:\s*820px/i);
  assert.match(css, /@media \(min-width:\s*981px\)[\s\S]*?\.app-window\.view-mobile\s*\{[\s\S]*?width:\s*430px/i);
  assert.match(css, /@container nimbus-window \(max-width:\s*980px\)/i);
  assert.match(css, /@container nimbus-window \(max-width:\s*720px\)/i);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /x-forwarded-host/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
