
import { OpenQuestion } from '../models/open-question';
import OpenQuestionRepository, { OpenQuestionType } from '../schemas/open-question.schema';

/**
 * @class OpenQuestionService
 */
class OpenQuestionService {

  /**
   * @description Fetches single product service from the storage by name
   * @param name
   * @returns {Promise<OpenQuestion>}
   */
  async findByName(name): Promise<OpenQuestion|OpenQuestionType> {
    return OpenQuestionRepository.findOne({name: name});
  }

  /**
   * @description Saves the question service in the storage
   * @param {OpenQuestion} openQuestion
   * @returns {Promise<OpenQuestion>}
   */
  async save(openQuestion: OpenQuestion): Promise<OpenQuestion|OpenQuestionType> {
    return (await new OpenQuestionRepository(openQuestion).save());
  }

  /**
   * @description Fetches single question service by id and sets active flag
   * @param id
   * @returns {Promise<OpenQuestion>}
   */
  async findOneAndUpdate(id: string): Promise<OpenQuestion|OpenQuestionType> {
    const ObjectID = require('mongodb').ObjectID;
    const openQuestion = OpenQuestionRepository.findOneAndUpdate({_id: new ObjectID(id)}, {new: true});
    return openQuestion;
  }

  /**
   * @description Fetches single question service by name and sets active flag
   * @param name
   * @returns {Promise<OpenQuestion>}
   */
  async findOneByNameAndUpdate(openQ: OpenQuestion): Promise<OpenQuestion|OpenQuestionType> {
    const openQuestion = await OpenQuestionRepository.findOneAndUpdate({name: openQ.name}, {question: openQ.question}, { new: true});
    return openQuestion;
  }

  /**
   * @description Fetches all question services from the storage
   * @returns {Promise<OpenQuestion[]>}
   */
  async findAll(): Promise<OpenQuestion[]|OpenQuestionType[]> {
    return OpenQuestionRepository.find();
  }
}

export default new OpenQuestionService();
