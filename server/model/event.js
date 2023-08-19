const mongoDB = require("mongoose");

const eventSchema = new mongoDB.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    is_mail_sent: {
      type: Boolean,
      default: false,
    },
    timeZone: {
      type: String,
      required: false,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: false,
    },
    user: {
      type: mongoDB.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoDB.model("Event", eventSchema);
