const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { generateUrl } = require("./utils");

const blockedResourceTypes = [
  "image",
  "media",
  "font",
  "texttrack",
  "object",
  "beacon",
  "csp_report",
  "imageset"
];

const skippedResources = [
  "quantserve",
  "adzerk",
  "doubleclick",
  "adition",
  "exelator",
  "sharethrough",
  "cdn.api.twitter",
  "google-analytics",
  "googletagmanager",
  "google",
  "fontawesome",
  "facebook",
  "analytics",
  "optimizely",
  "clicktale",
  "mixpanel",
  "zedo",
  "clicksor",
  "tiqcdn"
];

class Browser {
  static async getBrowser() {
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080"
      ]
    });
    return browser;
  }
}

class Page {
  constructor(url) {
    this.url = url;
  }
  async getPageHTML() {
    const browser = await Browser.getBrowser();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const requestUrl = request._url.split("?")[0].split("#")[0];
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
        skippedResources.some((resource) => requestUrl.indexOf(resource) !== -1)
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(this.url, {
      timeout: 15000,
      waitUntil: "networkidle2"
    });
    let html = await page.content();
    await page.close();
    await browser.close();
    return html;
  }
}

class Scraper {
  static async getItems(criteria) {
    const page = new Page(generateUrl(criteria));
    const html = await page.getPageHTML();
    const $ = cheerio.load(html);
    const items = [];
    const adImages = $("td[width='130']");
    for (const adImage of adImages.toArray()) {
      const adRow = $(adImage).parent();
      const item = this.extractItemFromRow(adRow);
      items.push(item);
    }
    return items;
  }

  static async getLatestItem(criteria) {
    const page = new Page(generateUrl(criteria));
    const html = await page.getPageHTML();
    const $ = cheerio.load(html);
    const adImage = $("td[width='130']")[0];
    const adRow = $(adImage).parent();
    const item = this.extractItemFromRow(adRow);
    if (!item.name && !item.price) {
      return null;
    }
    return item;
  }

  static extractItemFromRow(adRow) {
    const item = {};
    item.name = adRow.find("a b").text();
    item.price = adRow.find("td[width='100'] b").text();
    item.link = "https://hamrobazaar.com/" + adRow.find("a").attr("href");
    return item;
  }
}

module.exports = Scraper;
