import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  company: string;
  role: string;
  jdLink?: string;
  notes?: string;
  dateApplied: Date;
  status: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    jdLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    salaryMin: {
      type: Number,
    },
    salaryMax: {
      type: Number,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    niceToHaveSkills: {
      type: [String],
      default: [],
    },
    seniority: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    resumeSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, company: 1 });

export const Application = mongoose.model<IApplication>(
  'Application',
  applicationSchema
);
