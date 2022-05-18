
import { CustomEmail } from './custom-email';
import { Questionnaire } from './questionnaire';
import { AnswersReference } from './answers-reference';
import { QuestionsIndex } from './question-index';
import { Reminder } from './reminder';

export interface Evaluation {
  _id?: string;
  name: string;
  displayName?: string;
  slug: string;
  enterpriseId: number;
  enterprise?: any;
  questionnaire: Questionnaire;
  answersReference: AnswersReference;
  questionsIndex: QuestionsIndex;
  status: string;
  timeZone: string;
  deliveredAt: Date;
  validUntil: Date;
  operations: Array<number>;
  reminders: Array<Reminder>;
  customEmailRelease: CustomEmail;
  customEmailDeadline: CustomEmail;
  customEmailReminder: CustomEmail;
  createdAt?: Date;
  updatedAt?: Date;
}