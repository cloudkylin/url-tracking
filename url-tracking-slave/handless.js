const puppeteer = require("puppeteer");

async function urlTracking(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const result = [];
  page.on("response", (res) => {
    if (res._request._resourceType === "document") {
      result.push({
        url: res._url,
        code: res._status,
        whois: "",
      });
    }
  });
  await page.goto(url);
  // await page.screenshot({path: 'example.png'});

  await browser.close();
  return result;
}

module.exports = urlTracking;
