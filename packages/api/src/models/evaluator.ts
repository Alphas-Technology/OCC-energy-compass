
import { ObjectID } from 'mongodb';

import { Dimention } from './dimention';

export interface Evaluator {
  evaluationRef?: ObjectID;
  baseToken?: string;
  token?: string;
  status?: string;
  indEmpEntId?: number;
  employee?: any;
  evaluations: Dimention<Number>;
}
