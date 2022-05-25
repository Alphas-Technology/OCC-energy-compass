
import { ObjectID } from 'mongodb';

import { Dimention } from './dimention';

export interface Evaluated {
  evaluationRef?: ObjectID;
  baseToken?: string;
  token?: string;
  status?: string;
  sensitiveDataTreatmentPolicyAccepted: boolean;
  indEmpEntId?: number;
  employee?: any;
  evaluations: Dimention<Number>;
}
