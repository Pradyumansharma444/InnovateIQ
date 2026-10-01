import mongoose, { Schema, Document } from 'mongoose';
import { Patent } from '../../src/types';

export interface IPatent extends Document, Patent {}

const PatentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const PatentModel = mongoose.models.Patent || mongoose.model<IPatent>('Patent', PatentSchema);
