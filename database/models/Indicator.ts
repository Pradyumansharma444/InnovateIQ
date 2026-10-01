import mongoose, { Schema, Document } from 'mongoose';
import { IndicatorDefinition } from '../../src/types';

export interface IIndicator extends Document, IndicatorDefinition {}

const IndicatorSchema = new Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  weight: { type: Number, required: true },
  target: { type: Number, required: true },
  calculationMethod: { type: String },
  reportingPeriod: { type: String },
  assignedTo: { type: String },
  isActive: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true, strict: false });

export const IndicatorModel = mongoose.models.Indicator || mongoose.model<IIndicator>('Indicator', IndicatorSchema);
