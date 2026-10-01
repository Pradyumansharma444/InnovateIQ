import mongoose, { Schema, Document } from 'mongoose';
import { Competition } from '../../src/types';

export interface ICompetition extends Document, Competition {}

const CompetitionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const CompetitionModel = mongoose.models.Competition || mongoose.model<ICompetition>('Competition', CompetitionSchema);
