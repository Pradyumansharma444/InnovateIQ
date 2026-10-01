import mongoose, { Schema, Document } from 'mongoose';
import { ResearchGrant } from '../../src/types';

export interface IGrant extends Document, ResearchGrant {}

const GrantSchema = new Schema({
  id: { type: String, required: true, unique: true },
  projectTitle: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const GrantModel = mongoose.models.Grant || mongoose.model<IGrant>('Grant', GrantSchema);
