import mongoose, { Schema, Document } from 'mongoose';
import { Award } from '../../src/types';

export interface IAward extends Document, Award {}

const AwardSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const AwardModel = mongoose.models.Award || mongoose.model<IAward>('Award', AwardSchema);
