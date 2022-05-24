
import { Dimention } from './dimention';
import { Question } from './question';
import { DemographicItem } from './demographic-item';
import { AnswerOpenQuestion } from './answer-open-question';

export interface EvaluationAnswers {
  evaluationRef: any,
  _populationId: any,
  demographicItems: DemographicItem,
  evaluations: Dimention<Question>;
  openQuestions: Array<AnswerOpenQuestion>
  additionalQuestions: any
}
