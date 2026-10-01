import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog } from '../../src/types';

export interface IAuditLog extends Document, AuditLog {}

const AuditLogSchema = new Schema({
  id: { type: String, required: true, unique: true },
  recordTitle: { type: String, required: true }
}, { timestamps: true, strict: false });

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
