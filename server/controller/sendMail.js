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
  const currentTime = moment();
  const modifiedTime = currentTime.add(10, "minutes");
  // Format the modified time as hh:mm:ss
  const formattedTime = modifiedTime.format("HH:mm:ss");

  const events = await Event.find({
    end_time: formattedTime,
    is_mail_sent: false,
  }).populate("user");

  if (!events.length) {
    return;
  }
  const eventLink = "https://calendar-app-new.vercel.app/";

  for (const event of events) {
    const { user, title } = event;
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: user.email,
      subject: "Calendar App Reminder",
      text: `
      Hello,
      
      This is a friendly reminder that the "${title}" event is scheduled to start at ${modifiedTime.format("hh:mm A")}. We hope to see you there!
      
      You can find more details about the event here: https://calendar-app-new.vercel.app/
      
      Best regards,
      Calendar App
      `,
    };
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.log("Email send failed", err);
        return;
      }
      event.is_mail_sent = true;
      await event.save();
      console.log("Email sent successfully");
    });
  }
}

module.exports = { sendMail };
