
import * as mongoose from 'mongoose';

import { Evaluator } from '../models/evaluator';
import { ObjectID } from 'mongodb';

export type EvaluatorType = Evaluator & mongoose.Document;

const EvaluatorsSchema = new mongoose.Schema({
  employee: Object,
  token: { index: true, type: String },
  baseToken: String,
  evaluations: Object,
  status: { index: true, type: String },
  evaluationRef: { index: true, type: ObjectID }
}, { timestamps: true });


const EvaluatorsRepository = mongoose.model<EvaluatorType>('Evaluators', EvaluatorsSchema);
export default EvaluatorsRepository;
