import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    to: mongoose.SchemaTypes.Mixed,
    subject: mongoose.SchemaTypes.String,
    type: mongoose.SchemaTypes.String,
    message: mongoose.SchemaTypes.Mixed,
    from: mongoose.SchemaTypes.String,
    seen: mongoose.SchemaTypes.Boolean,
  },
  { collection: "notifications", timestamps: true }
);

export const NotificationModel = mongoose.model("Notification", Schema);
