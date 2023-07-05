const mongoDB = require("mongoose");

const userSchema =new mongoDB.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    events: [
      {
        type: mongoDB.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoDB.model("User", userSchema);
