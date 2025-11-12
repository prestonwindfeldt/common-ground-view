import mongoose, { Schema, Document } from 'mongoose';

export interface Comment {
  text: string;
  timestamp: string;
}

export interface WebcamData {
  visitCount: number;
  comments: Comment[];
}

export interface IWebcam extends Document {
  webcamId: string;
  visitCount: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const WebcamSchema = new Schema(
  {
    webcamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

export const Webcam = mongoose.models.Webcam || mongoose.model<IWebcam>('Webcam', WebcamSchema);