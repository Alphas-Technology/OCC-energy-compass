
import { ObjectID } from 'mongodb';

import { Dimention } from './dimention';

export interface Evaluator {
  employee?: any;
  baseToken?: string;
  token?: string;
  evaluations: Dimention<Number>;
  status?: string;
  evaluationRef?: ObjectID;
}
