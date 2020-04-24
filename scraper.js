const request = require("cloudscraper");
const cheerio = require("cheerio");
const { generateUrl } = require("./utils");

const extractItemFromRow = (adRow) => {
  const item = {};
  item.name = adRow.find("a b").text();
  item.price = adRow.find("td[width='100'] b").text();
  item.link = "https://hamrobazaar.com/" + adRow.find("a").attr("href");
  return item;
};

const getItems = async (criteria) => {
  const html = await request.get(generateUrl(criteria));
  const $ = cheerio.load(html);
  const items = [];
  const adImages = $("td[width='130']");
  for (const adImage of adImages.toArray()) {
    const adRow = $(adImage).parent();
    const item = extractItemFromRow(adRow);
    items.push(item);
  }
  return items;
};

const getLatestItem = async (criteria) => {
  const html = await request.get(generateUrl(criteria));
  const $ = cheerio.load(html);
  const adImage = $("td[width='130']")[0];
  const adRow = $(adImage).parent();
  const item = extractItemFromRow(adRow);
  if (!item.name && !item.price) {
    return null;
  }
  return item;
};

module.exports = { getLatestItem, getItems };
