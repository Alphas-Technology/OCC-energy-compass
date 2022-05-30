
import { ObjectID } from 'mongodb';
import * as mongoose from 'mongoose';

import { Evaluated } from '../models/evaluated';

export type EvaluatedType = Evaluated & mongoose.Document;

const EvaluatedSchema = new mongoose.Schema({
  evaluationRef: { index: true, type: ObjectID },
  baseToken: String,
  token: { index: true, type: String },
  status: { index: true, type: String },
  sensitiveDataTreatmentPolicyAccepted: {
    accepted: Boolean,
    timestamp: Date,
    url: String
  },
  indEmpEntId: { index: true, type: Number },
  employee: Object,
  temp: {
    evaluations: [{
      name: String,
      score: Number,
      variable: [{
        score: Number
      }]
    }],
    open: [{
      question: String,
      answer: []
    }],
    additional: [{
      question: String,
      answer: []
    }],
    indices: [{
      idx: Number,
      answer: Number
    }],
    segmentation: Object,
  }
}, { timestamps: true, collection: 'evaluated' });


const EvaluatedRepository = mongoose.model<EvaluatedType>('Evaluated', EvaluatedSchema);
export default EvaluatedRepository;
