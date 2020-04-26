const childProcess = require("child_process");

const cronJob = () => {
  const cronProcess = childProcess.fork("services/cron.js");
  cronProcess.on("exit", (code, signal) => {
    if (code !== 0) {
      console.log(`cron job failed with code ${code} and signal ${signal}`);
    }
  });
};
cronJob();
