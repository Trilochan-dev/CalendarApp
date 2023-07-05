const mongoDB = require("mongoose");

const eventSchema = new mongoDB.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    dateTime: {
      type: Number,
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
    user: {
      type: mongoDB.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoDB.model("Event", eventSchema);
