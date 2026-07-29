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
  assert.match(page, /className="progress-value">\{progress\}%/);
  assert.match(page, /progress-indeterminate-pattern/);
  assert.match(page, /Array\.from\(\{ length: 24 \}/);
  assert.match(page, /scroll-arrow-left/);
  assert.match(page, /scroll-arrow-right/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /event\.altKey/);
  assert.match(css, /--canvas:\s*#d6d9df/i);
  assert.match(css, /--focus:\s*#73a4d1/i);
  assert.match(css, /--font-ui:\s*Arial,\s*"Malgun Gothic",\s*sans-serif/i);
  assert.doesNotMatch(css, /--font-ui:[^;]*Segoe UI/i);
  assert.match(css, /body\s*\{[\s\S]*?font-size:\s*14px/i);
  assert.match(css, /\.nimbus-button,[\s\S]*?\.nimbus-select\s*\{[\s\S]*?min-height:\s*26px/i);
  assert.match(css, /\.nimbus-input\s*\{[\s\S]*?min-height:\s*26px/i);
  assert.match(css, /\.page-head \.eyebrow\s*\{[\s\S]*?color:\s*#525960/i);
  assert.match(css, /\.tab-strip button\s*\{[\s\S]*?height:\s*27px/i);
  assert.match(css, /\.progress-track\s*\{[\s\S]*?height:\s*18px/i);
  assert.match(css, /animation:\s*indeterminate \.8s linear infinite/i);
  assert.match(css, /clip-path:\s*path\("M 0 7 C 3 7 5 7 7 6/i);
  assert.doesNotMatch(css, /radial-gradient\(ellipse 18px 9px at 50% 50%/i);
  assert.match(css, /rgba\(255,190,105,\.78\) 35% 37%[\s\S]*?rgba\(255,190,105,\.78\) 63% 65%/i);
  assert.match(css, /\.fake-scrollbar\s*\{[\s\S]*?height:\s*16px[\s\S]*?grid-template-columns:\s*28px 1fr 28px/i);
  assert.match(css, /border-radius:\s*0 0 13px 13px/i);
  assert.match(css, /mask:\s*radial-gradient\(circle 8px at 100% 50%,\s*transparent 0 7px,\s*#000 8px\)/i);
  assert.doesNotMatch(css, /radial-gradient\(circle at (?:100%|0) 50%,\s*#dfe2e5/i);
  assert.match(css, /\.nimbus-fieldset\s*\{[\s\S]*?background:\s*var\(--canvas\)[\s\S]*?box-shadow:\s*none/i);
  assert.doesNotMatch(css, /tbody\s+tr:hover|status-pill|status-ready|status-draft|status-in-review/i);
  assert.doesNotMatch(css, /\.notice-(?:success|information|warning|danger)\s*\{[^}]*background\s*:/i);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /x-forwarded-host/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
