const conditions = { any: "", new: 1, used: 2 };
const generateUrl = ({ searchWord, condition = "any", minPrice = "", maxPrice = "" }) => {
  const conditionNum = conditions[condition];
  return `https://hamrobazaar.com/search.php?do_search=Search&searchword=${searchWord}&e_2=${conditionNum}&e_1_from=${minPrice}&e_1_to=${
    maxPrice === 0 ? "" : maxPrice
  }&way=0&order=siteid`;
};

const getTimeFrom = (date) => {
  const currentDate = Date.now();
  const givenDate = new Date(date).getTime();
  if (currentDate < givenDate) {
    throw new Error("invalid date given");
  }
  const diff = (currentDate - givenDate) / 1000;
  switch (true) {
    case diff <= 30:
      return "a few seconds ago";
    case diff <= 60:
      return `${Math.floor(diff)} seconds ago`;
    case diff <= 60 * 60:
      return `${Math.floor(diff / 60)} minutes ago`;
    case diff <= 60 * 60 * 24:
      return `${Math.floor(diff / 60 / 60)} hours ago`;
    case diff <= 60 * 60 * 24 * 30:
      return `${Math.floor(diff / 60 / 60 / 24)} days ago`;
    case diff <= 60 * 60 * 24 * 30 * 30 * 12:
      return `${Math.floor(diff / 60 / 60 / 24 / 30 / 30)} months ago`;
    default:
      return `${Math.floor(diff / 60 / 60 / 24 / 30 / 30 / 12)} years ago`;
  }
};

const getCurrentHour = () => {
  const date = new Date().toUTCString();
  const [time] = /\d{2}:\d{2}:\d{2}/gi.exec(date);
  let hour = parseInt(time.split(":")[0], 10);
  return hour;
};

module.exports = { generateUrl, getTimeFrom, getCurrentHour };
