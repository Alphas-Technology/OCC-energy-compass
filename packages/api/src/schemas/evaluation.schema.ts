
import * as mongoose from 'mongoose';

import { Evaluation } from '../models/evaluation';

export type EvaluationsType = Evaluation & mongoose.Document;

const EvaluationsSchema = new mongoose.Schema({
  name: String,
  displayName: String,
  slug: { index: true, type: String, unique: true },
  enterpriseId: { index: true, type: Number },
  enterprise: Object,
  questionnaire: Object,
  answersReference: Object,
  questionsIndex: Object,
  status: { index: true, type: String },
  timeZone: String,
  deliveredAt: { index: true, type: Date },
  validUntil: { index: true, type: Date },
  createdAt: { index: true, type: Date },
  operations: Array,
  reminders: [{
    dateTime: Date,
    status: String,
    customEmail: {
      subject: String,
      body: String,
      attachment: String
    }
  }],
  customEmailRelease: {
    subject: String,
    body: String,
    attachment: String
  },
  customEmailDeadline: {
    body: String
  },
  customEmailReminder: {
    subject: String,
    body: String,
    attachment: String
  }
}, { timestamps: true });

const EvaluationRepository = mongoose.model<EvaluationsType>('Evaluation', EvaluationsSchema);
export default EvaluationRepository;
