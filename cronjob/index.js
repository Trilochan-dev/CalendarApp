const cron = require("node-cron");
const { sendMail } = require("../controller/sendMail");

const cronjob = cron.schedule("* * * * *", async () => {
  console.log("running");
    await sendMail();
});

module.exports = {
  startCron: (taskname) => {
    if (taskname === "start") cronjob.start();
    else if (taskname === "stop") cronjob.stop();
    else if (taskname === "destroy") cronjob.destroy();
    return true;
  },
};
