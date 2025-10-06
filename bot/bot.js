const puppeteer = require("puppeteer");

const apiBase = process.env.API_BASE_URL || "http://backend:4000";
const webBase = process.env.API_FRONTEND_URL || "http://frontend";

(async () => {
  // const browser = await puppeteer.launch({ headless: true }); use this for localhost
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  console.log("[BOT] Starting patrol...");

  while (true) {
    try {
      const res = await fetch(`${apiBase}/users`);
      const users = await res.json();
      console.log("[BOT] got users:", users);
      for (let i = 0; i < users.length; i++) {
        await page.goto(`${webBase}`, { waitUntil: "domcontentloaded" });
        await page.setCookie({
          name: "FLAG",
          value: "CTF{n0w_y0u_h4ck3d_m3}",
          url: webBase,
          httpOnly: false,
          secure: false,    
        });
        await page.evaluate((id) => localStorage.setItem("userId", id), users[i].id);

        await page.reload({ waitUntil: "networkidle2" });

        console.log("[BOT] Visiting comments page...");

        const inner = await page.evaluate(() => {
          const ifr = document.querySelector("iframe");
          return ifr?.contentDocument?.body?.innerHTML || "<no iframe body>";
        });
      }

    } catch (err) {
      console.error("[BOT ERROR]", err);
    }

    console.log("[BOT] Sleeping 10s before next patrol...");
    await new Promise(r => setTimeout(r, 10000));
  }
})();
