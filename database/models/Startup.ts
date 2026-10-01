import mongoose, { Schema, Document } from 'mongoose';
import { Startup } from '../../src/types';

export interface IStartup extends Document, Startup {}

const StartupSchema = new Schema({
  id: { type: String, required: true, unique: true },
  startupName: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const StartupModel = mongoose.models.Startup || mongoose.model<IStartup>('Startup', StartupSchema);
