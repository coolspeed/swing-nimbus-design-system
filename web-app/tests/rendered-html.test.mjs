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
  assert.match(html, /data-window-title-bar="visible"/);
  assert.match(html, /data-testid="tab-foundations"/);
  assert.match(html, /#D6D9DF/);
  assert.match(html, /#33628C/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /https:\/\/nimbus\.test\/og\.png/);
  assert.doesNotMatch(html, /Nimbus native|theme-chip/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps the design-system tokens and interactive contracts explicit", async () => {
  const [page, layout, css, packageJson, config] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/nimbus-config.ts", import.meta.url), "utf8"),
  ]);

  assert.ok(page.includes('data-testid={`tab-${tab.id}`}'));
  assert.doesNotMatch(page, /Nimbus native|theme-chip|toolbar-spacer/i);
  assert.match(page, /const openContextAt = \(event: React\.MouseEvent<HTMLElement>\)[\s\S]*?event\.clientX[\s\S]*?event\.clientY[\s\S]*?getBoundingClientRect\(\)[\s\S]*?setContextMenuPosition/i);
  assert.match(page, /style=\{\{ left: contextMenuPosition\.x, top: contextMenuPosition\.y \}\}/i);
  assert.match(page, /onContextMenu=\{\(event\)[\s\S]*?openContext\(event\)/i);
  assert.doesNotMatch(css, /\.context-menu\s*\{\s*position:\s*absolute;\s*top:\s*48%;\s*left:\s*54%/i);
  assert.match(page, /<div className="tab-strip">[\s\S]*?<div className="tab-list" role="tablist"[\s\S]*?<div className="tab-divider" aria-hidden="true" \/>/i);
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
  assert.match(css, /body\s*\{[\s\S]*?font-size:\s*12px[\s\S]*?font-kerning:\s*none[\s\S]*?font-variant-ligatures:\s*none[\s\S]*?font-synthesis:\s*none/i);
  assert.match(css, /\.page-head h1\s*\{[\s\S]*?font-size:\s*20px[\s\S]*?font-weight:\s*700/i);
  assert.match(css, /\.swatch code\s*\{[\s\S]*?font-family:\s*inherit[\s\S]*?font-size:\s*12px/i);
  assert.doesNotMatch(css, /Cascadia Mono|Consolas/i);
  assert.match(css, /\.app-window\s*\{[\s\S]*?width:\s*min\(1200px,\s*calc\(100vw - 140px\)\)[\s\S]*?height:\s*min\(720px,\s*calc\(100vh - 140px\)\)/i);
  assert.match(config, /export const SHOW_WINDOW_TITLE_BAR = true/);
  assert.match(page, /SHOW_WINDOW_TITLE_BAR\s*\?\s*""\s*:\s*"without-title-bar"/);
  assert.match(page, /data-window-title-bar=\{SHOW_WINDOW_TITLE_BAR \? "visible" : "hidden"\}/);
  assert.match(page, /\{SHOW_WINDOW_TITLE_BAR && \([\s\S]*?<header className="title-bar">/i);
  assert.match(css, /\.app-window\.without-title-bar\s*\{[\s\S]*?grid-template-rows:\s*25px 36px auto 34px 1fr 26px/i);
  assert.match(css, /\.app-window\.view-mobile\.without-title-bar\s*\{[\s\S]*?grid-template-rows:\s*28px auto auto 39px 1fr 30px/i);
  assert.match(page, /function NimbusSelect\([\s\S]*?nimbus-select-arrow/i);
  assert.match(page, /function NimbusSpinner\([\s\S]*?Increase quantity[\s\S]*?Decrease quantity/i);
  assert.match(css, /\.nimbus-button,[\s\S]*?\.nimbus-select-shell\s*\{[\s\S]*?min-height:\s*23px/i);
  assert.match(css, /\.nimbus-button,[\s\S]*?\.nimbus-select-shell\s*\{[\s\S]*?border:\s*1px solid #6e747a[\s\S]*?linear-gradient\([\s\S]*?#f6f6f8 3%,[\s\S]*?#d6d9df 63%,[\s\S]*?#d6d9df 70%,[\s\S]*?#f5f8fd 100%/i);
  assert.match(css, /\.nimbus-button\s*\{[\s\S]*?min-height:\s*27px/i);
  assert.match(css, /\.tool-bar \.nimbus-button\s*\{[\s\S]*?min-height:\s*23px/i);
  assert.match(css, /\.hero-action\s*\{[\s\S]*?min-height:\s*54px/i);
  assert.match(css, /\.tool-primary,[\s\S]*?\.dialog-default\s*\{[\s\S]*?0 0 0 2px rgba\(115,164,209,\.65\)[\s\S]*?inset -1px 0 rgba\(54,62,70,\.15\)[\s\S]*?0 1px 1px rgba\(38,44,50,\.42\)/i);
  assert.match(css, /\.nimbus-select-shell\s*\{[\s\S]*?overflow:\s*hidden/i);
  assert.match(css, /\.nimbus-select-arrow\s*\{[\s\S]*?width:\s*17px/i);
  assert.match(css, /--nimbus-control-chrome-top:\s*#d6e2ea/i);
  assert.match(css, /--nimbus-control-chrome-dark:\s*#9fb5c7/i);
  assert.match(css, /--nimbus-control-chrome-edge:\s*#cedce7/i);
  assert.match(css, /\.nimbus-select-arrow,\s*\.nimbus-spinner-step\s*\{[\s\S]*?linear-gradient\([\s\S]*?var\(--nimbus-control-chrome-top\) 0%,[\s\S]*?var\(--nimbus-control-chrome-dark\) 62%,[\s\S]*?var\(--nimbus-control-chrome-edge\) 100%/i);
  assert.match(css, /\.nimbus-spinner\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\) 17px[\s\S]*?overflow:\s*hidden/i);
  assert.match(css, /\.nimbus-spinner-buttons\s*\{[\s\S]*?grid-template-rows:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)[\s\S]*?border-left:\s*1px solid var\(--nimbus-control-chrome-border\)/i);
  assert.match(css, /\.nimbus-spinner-step:first-child\s*\{[\s\S]*?var\(--nimbus-control-chrome-dark\) 94%,[\s\S]*?var\(--nimbus-control-chrome-edge\) 100%/i);
  assert.match(css, /\.nimbus-spinner-step:last-child\s*\{[\s\S]*?var\(--nimbus-control-chrome-upper\) 6%,[\s\S]*?var\(--nimbus-control-chrome-dark\) 16%/i);
  assert.match(css, /\.nimbus-spinner-step \+ \.nimbus-spinner-step\s*\{[\s\S]*?border-top:\s*1px solid var\(--nimbus-control-chrome-border\)/i);
  assert.match(css, /\.nimbus-input\s*\{[\s\S]*?min-height:\s*23px/i);
  assert.doesNotMatch(page, /SCREENSHOT-DERIVED UI KIT|status-dot/i);
  assert.match(css, /label,[\s\S]*?\.status-bar\s*\{[\s\S]*?user-select:\s*none/i);
  assert.match(css, /\.tab-strip button\s*\{[\s\S]*?height:\s*24px/i);
  assert.match(css, /\.tab-strip\s*\{[\s\S]*?min-width:\s*0[\s\S]*?overflow:\s*hidden/i);
  assert.match(css, /\.tab-list\s*\{[\s\S]*?width:\s*100%[\s\S]*?padding:\s*0 0 3px 17px[\s\S]*?overflow-x:\s*auto[\s\S]*?scrollbar-width:\s*none/i);
  assert.match(css, /\.tab-divider\s*\{[\s\S]*?right:\s*12px[\s\S]*?left:\s*12px[\s\S]*?border-bottom:\s*3px double #294a63/i);
  assert.doesNotMatch(css, /\.tab-strip::after/);
  assert.match(css, /@container nimbus-window \(max-width:\s*720px\)[\s\S]*?\.tab-list\s*\{[\s\S]*?padding-left:\s*8px/i);
  assert.match(css, /@media \(max-width:\s*720px\)[\s\S]*?\.tab-list\s*\{[\s\S]*?padding-left:\s*8px/i);
  assert.match(css, /\.tab-strip button\[aria-selected="true"\]\s*\{[\s\S]*?border-width:\s*1\.5px 1\.5px 0[\s\S]*?border-color:\s*#22313f[\s\S]*?linear-gradient\(#d8e2e9 0%,\s*#c3d0db 36%,\s*#adbfce 66%,\s*#96aec1 100%\)/i);
  assert.match(css, /\.progress-track\s*\{[\s\S]*?height:\s*19px[\s\S]*?border:\s*1px solid #898c92[\s\S]*?#fff 0%,[\s\S]*?#ced0d4 46%,[\s\S]*?#f9fbff 100%/i);
  assert.match(css, /\.progress-track > \.progress-fill\s*\{[\s\S]*?#e7bc88 0%,[\s\S]*?#aa4a00 54%,[\s\S]*?#f49a31 100%[\s\S]*?0 -2px 3px rgba\(170,74,0,\.48\)[\s\S]*?0 3px 4px rgba\(166,70,0,\.38\)/i);
  assert.match(css, /animation:\s*indeterminate \.52s linear infinite/i);
  assert.match(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?height:\s*13px[\s\S]*?overflow:\s*hidden[\s\S]*?#fff 10%,[\s\S]*?#d8d9dc 52%,[\s\S]*?#fbfcff 100%[\s\S]*?inset 0 2px rgba\(255,255,255,\.92\)/i);
  assert.doesNotMatch(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?background:\s*#d87a12/i);
  assert.match(css, /\.progress-track\.indeterminate \.progress-indeterminate-pattern\s*\{[\s\S]*?top:\s*50%[\s\S]*?height:\s*14px[\s\S]*?margin-top:\s*-7px/i);
  assert.match(css, /\.progress-indeterminate-pattern::before\s*\{[\s\S]*?inset:\s*6px 0 auto[\s\S]*?height:\s*2px[\s\S]*?linear-gradient\(#e0a05e,\s*#c36903 54%,\s*#df8120\)/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?flex:\s*0 0 34px[\s\S]*?width:\s*34px[\s\S]*?height:\s*14px[\s\S]*?margin-right:\s*-1px[\s\S]*?transform:\s*scaleY\(\.86\)/i);
  assert.match(css, /clip-path:\s*path\("M -1 6 C 2\.25 6 3\.75 6 5\.25 5\.5/i);
  assert.match(css, /C 13\.5 1\.5 15 1\.5 16\.5 1\.5/);
  assert.match(css, /C 29\.25 6 30\.75 6 33\.75 6 L 33\.75 8/i);
  assert.match(css, /@keyframes indeterminate\s*\{[\s\S]*?translateX\(33px\)/i);
  assert.doesNotMatch(css, /radial-gradient\(ellipse 18px 9px at 50% 50%/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?rgba\(255,206,139,\.9\) 35% 37%[\s\S]*?rgba\(255,206,139,\.9\) 63% 65%[\s\S]*?#f0c995 0%,[\s\S]*?#c36903 54%,[\s\S]*?#f8aa48 100%/i);
  assert.match(css, /\.fake-scrollbar\s*\{[\s\S]*?height:\s*15px[\s\S]*?grid-template-columns:\s*24px 1fr 24px[\s\S]*?#68696d 0%,[\s\S]*?#d6d9df 100%/i);
  assert.match(css, /\.fake-scrollbar \.scroll-track\s*\{[\s\S]*?left:\s*-10px[\s\S]*?width:\s*calc\(100% \+ 20px\)[\s\S]*?touch-action:\s*none/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?width:\s*27%/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?cursor:\s*default[\s\S]*?touch-action:\s*none/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?cursor:\s*grab/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb:active\s*\{[\s\S]*?cursor:\s*grabbing/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?transition:/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?top:\s*-1px[\s\S]*?height:\s*16px[\s\S]*?border-radius:\s*3px 3px 22px 22px \/ 2px 2px 14px 14px[\s\S]*?#e6edef 0%,[\s\S]*?#95aec3 32%,[\s\S]*?#dcebf0 100%[\s\S]*?inset 0 0 0 1px rgba\(33,62,84,\.18\)[\s\S]*?inset 0 -1px #70899c[\s\S]*?0 1px 1px rgba\(21,39,55,\.22\)/i);
  assert.match(css, /border:\s*1px solid #34495c[\s\S]*?border-top-color:\s*#b8c3cd/i);
  assert.match(css, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)\s*\{[\s\S]*?\.fake-scrollbar \.scroll-thumb:hover\s*\{[\s\S]*?#f5f9fa 0%,[\s\S]*?#a6bed1 32%,[\s\S]*?#e9f7fa 100%/i);
  assert.ok(css.indexOf(".fake-scrollbar .scroll-thumb:hover") < css.indexOf(".fake-scrollbar .scroll-thumb:active"));
  assert.match(css, /\.fake-scrollbar \.scroll-thumb:active\s*\{[\s\S]*?border-color:\s*#17364d[\s\S]*?border-top-color:\s*#5a7289[\s\S]*?#8da8be 0%,[\s\S]*?#386791 35%,[\s\S]*?#7aa7d2 100%[\s\S]*?inset 0 0 0 1px rgba\(14,43,65,\.24\)[\s\S]*?inset 0 -1px #416484[\s\S]*?0 1px 1px rgba\(5,20,32,\.24\)/i);
  assert.match(css, /mask:\s*radial-gradient\(circle 7px at 100% 50%,\s*transparent 0 6px,\s*#000 7px\)/i);
  assert.doesNotMatch(css, /radial-gradient\(circle at (?:100%|0) 50%,\s*#dfe2e5/i);
  assert.match(css, /\.nimbus-fieldset\s*\{[\s\S]*?background:\s*var\(--canvas\)[\s\S]*?box-shadow:\s*none/i);
  assert.match(css, /\.nimbus-fieldset legend\s*\{[\s\S]*?padding:\s*0 6px;/i);
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
