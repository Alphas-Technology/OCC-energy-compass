
import { Dimention } from './dimention';
import { AnswerOpenQuestion } from './answer-open-question';

export type EvaluatedAnswers = {
  evaluations: Dimention<Number>;
  open: Array<AnswerOpenQuestion>;
  additional: Array<AnswerOpenQuestion>;
  indices: Array<{ idx: Number, answer: Number }>;
  segmentation: Array<any>;
};
