
import { AnswersReference } from '../models/answers-reference';
import AnswersReferenceRepository, { AnswersReferenceType } from '../schemas/answers-reference.schema';

class AnswersReferenceService {

  async create(answersReference: AnswersReference): Promise<AnswersReference> {
    return (await new AnswersReferenceRepository(answersReference).save());
  }

  async update(answersReference: AnswersReference): Promise<AnswersReference> {
    return AnswersReferenceRepository.updateOne(
      { idx: answersReference.idx },
      answersReference
    );
  }

}

export default new AnswersReferenceService();
