
import { Dimention } from './dimention';
import { DemographicItem } from './demographic-item';
import { AnswerOpenQuestion } from './answer-open-question';

export interface EvaluationAnswers {
  evaluationRef: any,
  _populationId: any,
  demographicItems: DemographicItem,
  segmentation: Array<{ segmentationId: Number, detailId: Number }>;
  evaluations: Array<any>;
  indices: Array<any>;
  additionalQuestions: any
  openQuestions: Array<AnswerOpenQuestion>;
}
