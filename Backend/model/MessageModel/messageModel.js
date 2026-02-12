const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: 'sent'
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userRegister",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.pre("validate", function (next) {
  const hasReceiver = Boolean(this.receiver);
  const hasGroup = Boolean(this.group);

  if (!hasReceiver && !hasGroup) {
    return next(new Error("Message must have either receiver or group"));
  }

  if (hasReceiver && hasGroup) {
    return next(new Error("Message cannot have both receiver and group"));
  }

  return next();
});

module.exports = mongoose.model("Message", messageSchema);
