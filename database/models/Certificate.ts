import mongoose, { Schema, Document } from 'mongoose';
import { CertificateRecord } from '../../src/types';

export interface ICertificate extends Document, CertificateRecord {}

const CertificateSchema = new Schema({
  id: { type: String, required: true, unique: true },
  certificateNumber: { type: String, required: true, unique: true }
}, { timestamps: true, strict: false });

export const CertificateModel = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
