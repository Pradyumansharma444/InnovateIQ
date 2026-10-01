import mongoose, { Schema, Document } from 'mongoose';
import { Feedback } from '../../src/types';

export interface IFeedback extends Document, Feedback {}

const FeedbackSchema = new Schema({
  id: { type: String, required: true, unique: true },
  message: { type: String, required: true }
}, { timestamps: true, strict: false });

export const FeedbackModel = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
