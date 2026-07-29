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
  assert.match(page, /data-testid=\{`dialog-\$\{type\}`\}/);
  assert.match(page, /className="progress-value">\{progress\}%/);
  assert.match(page, /progress-indeterminate-pattern/);
  assert.match(page, /scroll-arrow-left/);
  assert.match(page, /scroll-arrow-right/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /event\.altKey/);
  assert.match(css, /--canvas:\s*#d6d9df/i);
  assert.match(css, /--focus:\s*#73a4d1/i);
  assert.match(css, /--font-ui:\s*Arial,\s*"Malgun Gothic",\s*sans-serif/i);
  assert.doesNotMatch(css, /--font-ui:[^;]*Segoe UI/i);
  assert.match(css, /\.tab-strip button\s*\{[\s\S]*?height:\s*30px/i);
  assert.match(css, /\.progress-track\s*\{[\s\S]*?height:\s*20px/i);
  assert.match(css, /border-radius:\s*0 0 22px 22px/i);
  assert.match(css, /\.nimbus-fieldset\s*\{[\s\S]*?background:\s*var\(--canvas\)[\s\S]*?box-shadow:\s*none/i);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /x-forwarded-host/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
