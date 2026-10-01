import mongoose, { Schema, Document } from 'mongoose';
import { ResearchPublication } from '../../src/types';

export interface IPublication extends Document, ResearchPublication {}

const PublicationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const PublicationModel = mongoose.models.Publication || mongoose.model<IPublication>('Publication', PublicationSchema);
