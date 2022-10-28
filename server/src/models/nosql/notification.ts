import mongoose from "mongoose";

export interface INotificationModel {
  to: any;
  subject: string;
  type: string;
  message: any;
  from: string;
  seen: boolean;
}

const Schema = new mongoose.Schema<INotificationModel>(
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
