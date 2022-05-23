
import * as mongoose from 'mongoose';

import { Evaluator } from '../models/evaluator';
import { ObjectID } from 'mongodb';

export type EvaluatorType = Evaluator & mongoose.Document;

const EvaluatorsSchema = new mongoose.Schema({
  evaluationRef: { index: true, type: ObjectID },
  baseToken: String,
  token: { index: true, type: String },
  status: { index: true, type: String },
  indEmpEntId: { index: true, type: Number },
  employee: Object,
  evaluations: Object
}, { timestamps: true });


const EvaluatorsRepository = mongoose.model<EvaluatorType>('Evaluators', EvaluatorsSchema);
export default EvaluatorsRepository;
