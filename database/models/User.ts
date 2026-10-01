import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../src/types';

export interface IUser extends Document, User {}

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePhoto: { type: String },
  role: { type: String, required: true },
  roles: [{ type: String }],
  institutionId: { type: String, required: true },
  departmentId: { type: String },
  designation: { type: String },
  onboardingCompleted: { type: Boolean, default: false },
  isPrivilegedAdmin: { type: Boolean, default: false },
  isPrivilegedReviewer: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
