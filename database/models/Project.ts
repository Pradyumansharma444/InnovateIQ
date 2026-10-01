import mongoose, { Schema, Document } from 'mongoose';
import { InnovationProject } from '../../src/types';

export interface IProject extends Document, InnovationProject {}

const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  institutionId: { type: String, required: true },
  departmentId: { type: String, required: true },
  title: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
