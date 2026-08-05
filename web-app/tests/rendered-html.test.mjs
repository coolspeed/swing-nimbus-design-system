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
  assert.match(page, /const openContextAt = \(event: React\.MouseEvent<HTMLElement>,\s*language: PreviewLanguage = "en"\)[\s\S]*?event\.clientX[\s\S]*?event\.clientY[\s\S]*?getBoundingClientRect\(\)[\s\S]*?setContextMenuPosition/i);
  assert.match(page, /style=\{\{ left: contextMenuPosition\.x, top: contextMenuPosition\.y \}\}/i);
  assert.match(page, /onContextMenu=\{\(event\)[\s\S]*?openContext\(event\)/i);
  assert.doesNotMatch(css, /\.context-menu\s*\{\s*position:\s*absolute;\s*top:\s*48%;\s*left:\s*54%/i);
  assert.match(page, /<div className="tab-strip">[\s\S]*?<div className="tab-scroller">[\s\S]*?<div className="tab-list" role="tablist"[\s\S]*?<div className="tab-divider" aria-hidden="true" \/>/i);
  for (const tab of ["foundations", "controls", "data", "feedback", "dialogs"]) {
    assert.match(page, new RegExp(`panel-${tab}`));
  }
  assert.match(page, /\{ id: "dialogs", label: "Dialogs"/);
  assert.match(page, /id="panel-dialogs"[\s\S]*?className="two-column korean-preview" lang="ko"[\s\S]*?대화상자 및 메뉴 예제/);
  assert.match(page, /openDialog=\{\(id\) => showDialog\(id, "ko"\)\}/);
  assert.match(page, /openContext=\{\(event\) => openContextAt\(event, "ko"\)\}/);
  assert.match(page, /const \[dialogLanguage, setDialogLanguage\] = useState<PreviewLanguage>\("en"\)/);
  assert.match(css, /--font-ui-korean:\s*Arial, "Malgun Gothic", "맑은 고딕", sans-serif/);

  assert.match(page, /data-testid="component-table"/);
  assert.match(page, /<td>\{row\.status\}<\/td>/);
  assert.doesNotMatch(page, /status-pill|status-ready|status-draft|status-in-review/);
  assert.match(page, /data-testid=\{`dialog-\$\{type\}`\}/);
  assert.match(page, /function InternalDesktop\(\)[\s\S]*?setPointerCapture\(event\.pointerId\)[\s\S]*?getBoundingClientRect\(\)[\s\S]*?data-active=\{activeWindow === id\}/i);
  assert.match(css, /\.internal-window header\s*\{[\s\S]*?cursor:\s*default/i);
  assert.doesNotMatch(css, /\.internal-window header\s*\{[\s\S]*?cursor:\s*move/i);
  assert.match(page, /className="internal-minimize"[\s\S]*?className="internal-maximize"[\s\S]*?className="internal-close"/i);
  assert.match(page, /aria-label=\{`\$\{title\} 최소화`\}[\s\S]*?aria-label=\{`\$\{title\} \$\{state\.maximized \? "복원" : "최대화"\}`\}[\s\S]*?aria-label=\{`\$\{title\} 닫기`\}/i);
  assert.match(css, /\.internal-window\[data-active="true"\] \.internal-minimize\s*\{[\s\S]*?#c66708 48%/i);
  assert.match(css, /\.internal-window\[data-active="true"\] \.internal-maximize\s*\{[\s\S]*?#6f8a10 48%/i);
  assert.match(css, /\.internal-window\[data-active="true"\] \.internal-close\s*\{[\s\S]*?#b22a1d 48%/i);
  for (const fileAction of ["Up one level", "Home folder", "Create new folder", "List", "Details"]) {
    assert.ok(page.includes(`"${fileAction}"`));
  }
  for (const fileAction of ["상위 폴더", "홈 폴더", "새 폴더 만들기", "목록", "자세히"]) {
    assert.ok(page.includes(`"${fileAction}"`));
  }
  for (const icon of ["up", "home", "new-folder", "list", "details"]) {
    assert.match(page, new RegExp(`className="file-toolbar-icon icon-${icon}" aria-hidden="true" \\/>`));
  }
  assert.doesNotMatch(page, /file-toolbar-icon[^>]*>[↑⌂✳▤▦]/i);
  assert.match(css, /\.icon-up::before,[\s\S]*?\.icon-new-folder::before[\s\S]*?clip-path:\s*polygon/i);
  assert.match(css, /\.icon-up::after[\s\S]*?#63b8eb[\s\S]*?clip-path:\s*polygon/i);
  assert.match(css, /\.icon-home::before[\s\S]*?#f5dc76[\s\S]*?clip-path:\s*polygon/i);
  assert.match(css, /\.icon-new-folder::after[\s\S]*?#ffeb75[\s\S]*?clip-path:\s*polygon/i);
  assert.match(css, /\.icon-list::before,[\s\S]*?\.icon-details::before[\s\S]*?border:\s*1px solid #8297a6/i);
  assert.match(css, /\.icon-details::after[\s\S]*?border:\s*2px solid #40596b[\s\S]*?border-radius:\s*50%/i);
  assert.match(page, /const \[fileView, setFileView\] = useState<"list" \| "details">\("list"\)/i);
  assert.match(page, /onClick=\{createFolder\}[\s\S]*?setFileView\("list"\)[\s\S]*?setFileView\("details"\)/i);
  assert.match(page, /className=\{`file-grid file-view-\$\{fileView\}`\}[\s\S]*?aria-selected=\{selectedFile === folder\}/i);
  assert.match(css, /@media \(max-width:\s*600px\)[\s\S]*?\.look-in\s*\{[\s\S]*?grid-template-columns:\s*auto minmax\(0,\s*1fr\)[\s\S]*?\.file-toolbar\s*\{[\s\S]*?grid-column:\s*2/i);
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
  assert.match(css, /\.nimbus-select-shell\s*\{[\s\S]*?#c9ced4 63%,[\s\S]*?#c1c7ce 72%,[\s\S]*?#c8ced5 80%,[\s\S]*?#e5e8ec 100%[\s\S]*?inset 0 -1px rgba\(255,255,255,\.42\)[\s\S]*?0 1px 1px rgba\(38,44,50,\.42\)/i);
  assert.match(css, /\.nimbus-select-arrow\s*\{[\s\S]*?width:\s*17px/i);
  assert.match(css, /\.nimbus-select-arrow\s*\{[\s\S]*?#8fa7ba 72%,[\s\S]*?#9aafbf 82%,[\s\S]*?#c1ced7 100%[\s\S]*?inset 0 -1px rgba\(255,255,255,\.28\)[\s\S]*?font-size:\s*9px/i);
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
  assert.match(css, /\.tab-strip\s*\{[\s\S]*?--tab-divider-gutter:\s*clamp\(4px,\s*1\.2%,\s*12px\)[\s\S]*?min-width:\s*0[\s\S]*?overflow:\s*hidden/i);
  assert.match(css, /\.tab-scroller\s*\{[\s\S]*?width:\s*100%[\s\S]*?overflow-x:\s*auto[\s\S]*?scrollbar-width:\s*none/i);
  assert.match(css, /\.tab-list\s*\{[\s\S]*?width:\s*max-content[\s\S]*?min-width:\s*100%[\s\S]*?padding:\s*0 var\(--tab-divider-gutter\) 3px var\(--tab-start-gutter\)/i);
  assert.match(css, /\.tab-divider\s*\{[\s\S]*?right:\s*var\(--tab-divider-gutter\)[\s\S]*?left:\s*var\(--tab-divider-gutter\)[\s\S]*?border-bottom:\s*3px double #294a63/i);
  assert.doesNotMatch(css, /\.tab-strip::after/);
  assert.match(css, /\.tab-strip button\s*\{[\s\S]*?border-width:\s*1\.25px 1\.25px 0[\s\S]*?border-color:\s*#566572/i);
  assert.match(css, /\.tab-strip button\[aria-selected="true"\]\s*\{[\s\S]*?border-width:\s*1\.5px 1\.5px 0[\s\S]*?border-color:\s*#22313f[\s\S]*?linear-gradient\(#d8e2e9 0%,\s*#c3d0db 36%,\s*#adbfce 66%,\s*#96aec1 100%\)/i);
  assert.match(css, /\.progress-track\s*\{[\s\S]*?height:\s*19px[\s\S]*?border:\s*1px solid #898c92[\s\S]*?#fff 0%,[\s\S]*?#ced0d4 46%,[\s\S]*?#f9fbff 100%/i);
  assert.match(css, /\.progress-track > \.progress-fill\s*\{[\s\S]*?#e7bc88 0%,[\s\S]*?#aa4a00 54%,[\s\S]*?#f49a31 100%[\s\S]*?0 -2px 3px rgba\(170,74,0,\.48\)[\s\S]*?0 3px 4px rgba\(166,70,0,\.38\)/i);
  assert.match(css, /animation:\s*indeterminate \.333s linear infinite/i);
  assert.match(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?height:\s*15px[\s\S]*?overflow:\s*hidden[\s\S]*?#fff 10%,[\s\S]*?#dee0e3 52%,[\s\S]*?#fbfcff 100%[\s\S]*?inset 0 2px rgba\(255,255,255,\.82\)[\s\S]*?inset 0 3px rgba\(84,89,96,\.12\)[\s\S]*?inset 0 -1px rgba\(95,101,109,\.34\)/i);
  assert.doesNotMatch(css, /\.progress-track\.indeterminate\s*\{[\s\S]*?background:\s*#d87a12/i);
  assert.match(css, /\.progress-track\.indeterminate \.progress-indeterminate-pattern\s*\{[\s\S]*?top:\s*50%[\s\S]*?left:\s*-28px[\s\S]*?height:\s*14px[\s\S]*?margin-top:\s*-7\.5px/i);
  assert.match(css, /\.progress-indeterminate-pattern::before\s*\{[\s\S]*?inset:\s*6\.8px 0 auto[\s\S]*?height:\s*\.4px[\s\S]*?linear-gradient\(#e6a65f,\s*var\(--orange\) 54%,\s*#e78a24\)/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?flex:\s*0 0 30px[\s\S]*?width:\s*30px[\s\S]*?height:\s*14px[\s\S]*?margin-right:\s*-2px[\s\S]*?transform:\s*scaleY\(\.86\)/i);
  assert.match(css, /clip-path:\s*path\("M -1 6 C 1\.5 6 3\.25 6 4 5\.75/i);
  assert.match(css, /C 13 1\.5 14 1\.5 15 1\.5/);
  assert.match(css, /C 26\.75 6 28\.5 6 30 6 L 30 8/i);
  assert.match(css, /@keyframes indeterminate\s*\{[\s\S]*?translateX\(28px\)/i);
  assert.doesNotMatch(css, /radial-gradient\(ellipse 18px 9px at 50% 50%/i);
  assert.match(css, /\.progress-indeterminate-pattern i\s*\{[\s\S]*?rgba\(238,159,78,\.78\) 35% 37%[\s\S]*?rgba\(238,159,78,\.78\) 63% 65%[\s\S]*?#f3cfa0 0%,[\s\S]*?var\(--orange\) 54%,[\s\S]*?#fbaa4a 100%/i);
  assert.match(css, /\.fake-scrollbar\s*\{[\s\S]*?position:\s*relative[\s\S]*?height:\s*15px[\s\S]*?grid-template-columns:\s*24px 1fr 24px[\s\S]*?overflow:\s*visible[\s\S]*?background:\s*transparent[\s\S]*?box-shadow:\s*none/i);
  assert.match(css, /\.fake-scrollbar::before\s*\{[\s\S]*?inset:\s*\.5px 0 -1\.5px[\s\S]*?#494a4c 0%,[\s\S]*?#646669 8%,[\s\S]*?#7f8184 12%,[\s\S]*?#93969a 16%,[\s\S]*?#aaacb2 25%,[\s\S]*?#c2c4ca 35%,[\s\S]*?#c7c9cf 42%,[\s\S]*?#cfd2d8 65%,[\s\S]*?#d6d9df 100%[\s\S]*?pointer-events:\s*none/i);
  assert.doesNotMatch(css, /\.fake-scrollbar\s*\{[\s\S]*?#f1f2f3 26%/i);
  assert.match(css, /\.fake-scrollbar \.scroll-track\s*\{[\s\S]*?left:\s*-10px[\s\S]*?width:\s*calc\(100% \+ 20px\)[\s\S]*?touch-action:\s*none/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?width:\s*27%/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?cursor:\s*default[\s\S]*?touch-action:\s*none/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?cursor:\s*grab/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb:active\s*\{[\s\S]*?cursor:\s*grabbing/i);
  assert.doesNotMatch(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?transition:/i);
  assert.match(css, /\.fake-scrollbar \.scroll-thumb\s*\{[\s\S]*?top:\s*\.5px[\s\S]*?height:\s*16px[\s\S]*?border-radius:\s*5px 5px 22px 22px \/ 3px 3px 14px 14px[\s\S]*?#e6edef 0%,[\s\S]*?#95aec3 32%,[\s\S]*?#dcebf0 100%[\s\S]*?inset 0 1px rgba\(255,255,255,\.98\)[\s\S]*?inset 0 2px rgba\(224,245,255,\.72\)[\s\S]*?inset 0 3px rgba\(255,255,255,\.24\)[\s\S]*?inset 0 0 0 1px rgba\(33,62,84,\.18\)[\s\S]*?inset -1px 0 rgba\(18,40,57,\.3\)[\s\S]*?inset 0 -1px #526f85[\s\S]*?inset 0 -2px rgba\(228,247,253,\.6\)[\s\S]*?inset 0 -3px rgba\(219,240,250,\.28\)[\s\S]*?0 1px 1px rgba\(21,39,55,\.22\)/i);
  assert.match(css, /border:\s*1px solid #0c1d28[\s\S]*?border-top-color:\s*#b9d8e7/i);
  assert.match(css, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)\s*\{[\s\S]*?\.fake-scrollbar \.scroll-thumb:hover\s*\{[\s\S]*?#f5f9fa 0%,[\s\S]*?#a6bed1 32%,[\s\S]*?#e9f7fa 100%/i);
  assert.ok(css.indexOf(".fake-scrollbar .scroll-thumb:hover") < css.indexOf(".fake-scrollbar .scroll-thumb:active"));
  assert.match(css, /\.fake-scrollbar \.scroll-thumb:active\s*\{[\s\S]*?border-color:\s*#091c29[\s\S]*?border-top-color:\s*#a5c8db[\s\S]*?#8da8be 0%,[\s\S]*?#386791 35%,[\s\S]*?#7aa7d2 100%[\s\S]*?inset 0 0 0 1px rgba\(14,43,65,\.24\)[\s\S]*?inset 0 -1px #416484[\s\S]*?0 1px 1px rgba\(5,20,32,\.24\)/i);
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
