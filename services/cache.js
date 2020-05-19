const mongoose = require("mongoose");
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});
const exec = mongoose.Query.prototype.exec;

const hget = client.hget;
client.hget = function (key, field) {
  return new Promise((resolve, reject) => {
    hget.apply(this, [
      key,
      field,
      (err, val) => {
        if (err) {
          return reject(err);
        }
        resolve(val);
      }
    ]);
  });
};
const hset = client.hset;
client.hset = function (key, field, val) {
  return new Promise((resolve, reject) => {
    hset.apply(this, [
      key,
      field,
      val,
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    ]);
  });
};

mongoose.Query.prototype.cache = function (key) {
  this.shouldCache = true;
  this.hashKey = key || "default";
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.shouldCache) {
    return exec.apply(this, arguments);
  }
  const cacheKey = JSON.stringify({
    collection: this.mongooseCollection.name,
    ...this.getQuery()
  });
  const cachedVal = await client.hget(this.hashKey, cacheKey);
  if (cachedVal) {
    const queryRes = JSON.parse(cachedVal);
    if (queryRes === null) {
      return null;
    }
    return Array.isArray(queryRes)
      ? queryRes.map((doc) => this.model.hydrate(doc))
      : this.model.hydrate(queryRes);
  }
  const queryRes = await exec.apply(this, arguments);
  await client.hset(this.hashKey, cacheKey, JSON.stringify(queryRes));
  return queryRes;
};

const clearHash = (hashKey) => {
  return new Promise((resolve) => {
    client.del(hashKey || "default", () => {
      resolve();
    });
  });
};

const flushCache = () => {
  return new Promise((resolve) => {
    client.flushdb(() => {
      resolve();
    });
  });
};

const disconnectToRedis = () => {
  return new Promise((resolve) => {
    client.quit(() => {
      resolve();
    });
  });
};

module.exports = { clearHash, flushCache, disconnectToRedis };
