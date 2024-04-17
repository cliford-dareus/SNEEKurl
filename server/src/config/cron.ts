import cron from "node-cron";
import Short from "../models/short";

const cron_job = async () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Cleaning up expired short URLs...");
    const expiredUrls = await Short.find({
      expired_in: { $lt: new Date() },
    });

    await Short.deleteMany({ _id: { $in: expiredUrls.map((url) => url._id) } });

    console.log(`Deleted ${expiredUrls.length} expired short URLs.`);
  });
};

export default cron_job;
