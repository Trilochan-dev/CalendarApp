const nodeMailer = require("nodemailer");
const moment = require("moment-timezone");
const Event = require("../model/event");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendMail(req, res) {
  const currentTime = new Date().getTime();
  const tenMinutesLater = currentTime + 10 * 60 * 1000;
  const events = await Event.find({
    dateTime: { $gte: currentTime, $lt: tenMinutesLater },
    is_mail_sent: false,
  }).populate("user");

  if (!events.length) {
    console.log("No events found");
    return;
  }
  for (const event of events) {
    const { user, title, dateTime, timezone } = event;
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: user.email,
      subject: "Event Reminder",
      text: `
      Event ${title} is starting at ${moment(dateTime)
        .tz(timezone)
        .format("lll")}.  Don't forget to attend !
        `,
    };

    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log("Email send failed", err);
        return;
      }
      event.is_mail_sent = true;
      await event.save();
      console.log("Email sent successfully", info.response);
    });
  }
}

module.exports = { sendMail };
