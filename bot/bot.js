const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setCookie({
    name: "FLAG",
    value: "CTF{n0w_y0u_h4ck3d_m3}",
    domain: "localhost",
  });

  console.log("[BOT] Starting patrol...");

  while (true) {
    try {
      console.log("[BOT] Visiting comments page...");
      await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

      await new Promise(r => setTimeout(r, 5000));
    } catch (err) {
      console.error("[BOT ERROR]", err);
    }

    console.log("[BOT] Sleeping 30s before next patrol...");
    await new Promise(r => setTimeout(r, 10000));
  }

})();
