import mongoose, { Schema, Document } from 'mongoose';
import { InnovationEvent } from '../../src/types';

export interface IEvent extends Document, InnovationEvent {}

const EventSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  verificationStatus: { type: String, default: 'submitted' }
}, { timestamps: true, strict: false });

export const EventModel = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
