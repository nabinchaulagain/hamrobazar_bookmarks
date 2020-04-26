const Scraper = require("../services/scraper");
const saveLatestItemInBookmark = async (bookmark) => {
  if (process.env.NODE_ENV === "production") {
    Scraper.getLatestItem(bookmark.criteria).then((latestItem) => {
      bookmark.latestItem = latestItem;
      bookmark.save();
    });
  } else {
    const latestItem = await Scraper.getLatestItem(bookmark.criteria);
    bookmark.latestItem = latestItem;
    await bookmark.save();
  }
};

module.exports = { saveLatestItemInBookmark };
