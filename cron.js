console.time("cron job");
const { Notification, Bookmark } = require("./models");
const mongoose = require("mongoose");
const { getItems } = require("./scraper");
require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  async () => {
    const bookmarks = await Bookmark.find({}, { latestItem: 1, criteria: 1 });
    for (const bookmark of bookmarks) {
      const items = await getItems(bookmark.criteria);
      try {
        const newItems = getNewItems(bookmark.latestItem, items);
        if (newItems.length !== 0) {
          createNotifications(bookmark._id, newItems);
          bookmark.latestItem = items[0];
          bookmark.save();
        }
        await waitFor30Seconds();
      } catch (err) {
        console.log(err);
      }
    }
    console.timeEnd("cron job");
    process.exit();
  }
);

function createNotifications(bookmarkId, newItems) {
  for (const item of newItems) {
    Notification.create({
      item,
      bookmark: bookmarkId
    });
  }
}

function getNewItems(latestItem, items) {
  const newItems = [];
  if (!latestItem) {
    for (const item of items) {
      newItems.push(item);
    }
    return newItems;
  }
  for (const item of items) {
    if (item.link === latestItem.link) {
      break;
    }
    newItems.push(item);
  }
  return newItems;
}

const waitFor30Seconds = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 30000);
  });
};
