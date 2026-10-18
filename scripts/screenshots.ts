// npm run screenshots [base-url]: capture the README screenshots from a
// running app (default http://localhost:3000, e.g. `npm run demo` in another
// terminal) at desktop and phone widths, saved as WebP in docs/screenshots/.
// Needs a Chromium for Playwright: `npx playwright install chromium`.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT_DIR = path.join(process.cwd(), "docs", "screenshots");

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

// The Next.js dev-tools badge is not part of the app
const HIDE_DEV_OVERLAY = "nextjs-portal { display: none !important; }";

async function firstIdeaHref(page: Page) {
  await page.goto(`${BASE}/?sort=top`, { waitUntil: "networkidle" });
  const href = await page
    .locator('article a[href^="/idea/"]')
    .first()
    .getAttribute("href");
  if (!href) throw new Error("No ideas on the feed. Is the database seeded?");
  return href;
}

async function capture(
  page: Page,
  route: string,
  name: string,
  fullPage = false,
) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
  const png = await page.screenshot({ fullPage });
  const file = path.join(OUT_DIR, `${name}.webp`);
  const info = await sharp(png).webp({ quality: 82 }).toFile(file);
  console.log(
    `${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  const desktop = await browser.newPage({
    viewport: DESKTOP,
    deviceScaleFactor: 1,
  });
  const ideaHref = await firstIdeaHref(desktop);
  await capture(desktop, "/", "feed-desktop");
  await capture(desktop, ideaHref, "thread-desktop");

  const phone = await browser.newPage({
    viewport: PHONE,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await capture(phone, "/", "feed-phone");
  await capture(phone, "/profile/seed_priya", "profile-phone");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
