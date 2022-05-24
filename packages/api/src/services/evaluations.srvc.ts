
import { ObjectID } from 'mongodb';
import { Evaluation } from '../models/evaluation';
import EvaluationRepository, { EvaluationsType } from '../schemas/evaluation.schema';

import ProductServiceService from './product-service.srvc';
import RunHttpRequest from '../utils/run-http-request';

/**
 * @class QuestionnaireService
 */
class EvaluationsService {

  /**
   * @description Fetches all questionnaires
   * @returns {Promise<Questionnaire[]>}
   */
  async listAll(filters: object = {}, select?: undefined|any): Promise<Evaluation[]> {
    return EvaluationRepository.find(filters, select || undefined).sort({'createdAt': -1});
  }

  async listByEnterprise(enterpriseId: number, filters: object = {}, select?: undefined|any): Promise<Evaluation[]> {
    return EvaluationRepository.find({ enterpriseId: enterpriseId, ...filters }, select || undefined).sort({'createdAt': -1});
  }

  async create(evaluation: Evaluation): Promise<Evaluation> {
    return (await new EvaluationRepository(evaluation).save()).toObject({ virtuals: true });
  }

  async findOneBySlug(slug: string, select?: string): Promise<Evaluation> {
    return EvaluationRepository.findOne({ slug }, select || undefined);
  }

  async findById(id: string, select?: undefined|any): Promise<Evaluation> {
    return EvaluationRepository.findOne({_id: new ObjectID(id)}, select || undefined);
  }

  async updateBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation> {
    return EvaluationRepository.updateOne({ slug: slug }, {...evaluation});
  }

  async updateCustomEmailReleaseBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation> {
    return EvaluationRepository.updateOne({ slug: slug }, { customEmailRelease: evaluation.customEmailRelease });
  }

  async updateCustomEmailReminderBySlug(slug: string, evaluation: Evaluation): Promise<Evaluation> {
    return EvaluationRepository.updateOne({ slug: slug }, {
      customEmailReminder: evaluation.customEmailReminder,
      reminders: evaluation.reminders
    });
  }

  async updateEvaluationStatus(tokenId: string, type: string, index?: string, evaluatedIndex?: string): Promise<Evaluation> {
    const setCompleted = (res: any) => {
      let completed = true;
      res.evaluated.forEach((elem: any) => {
        if (!elem.employee.completed) {
          completed = false;
        }
        elem.leadersEvaluators.forEach((elemLeader: any) => {
          if (!elemLeader.completed) {
            completed = false;
          }
        });
        elem.dependentsEvaluators.forEach((elemDependent: any) => {
          if (!elemDependent.completed) {
            completed = false;
          }
        });
        elem.pairsEvaluators.forEach((elemPair: any) => {
          if (!elemPair.completed) {
            completed = false;
          }
        });
      });
      if (completed) {
        return this.closeEvaluation(res.slug);
      }
      return res;
    };
    if (type === 'autoevaluation') {
      return EvaluationRepository.findOneAndUpdate(
        {'evaluated.employee.token': tokenId},
        { '$set': { 'evaluated.$.employee.completed': true }},
        { new: true}
      ).then((res) => setCompleted(res));
    } else {
      const query = 'evaluated.' + evaluatedIndex + '.' + type + '.' + index + '.completed';
      const $set = {};
      $set[query] = true;

      return EvaluationRepository.findOneAndUpdate(
        {$or: [{'evaluated': {'$elemMatch': {'leadersEvaluators': {'$elemMatch': {'token': tokenId}}}}},
          {'evaluated': {'$elemMatch': {'dependentsEvaluators': {'$elemMatch': {'token': tokenId}}}}},
          {'evaluated': {'$elemMatch': {'pairsEvaluators': {'$elemMatch': {'token': tokenId}}}}}]},
        { '$set': $set },
        { new: true}
      ).then((res) => setCompleted(res));
    }
  }

  async filterByStatus(status: string) {
    return EvaluationRepository.find({ status });
  }

  async updateReminders(id: string, reminders: any): Promise<Evaluation> {
    return EvaluationRepository.findByIdAndUpdate(new ObjectID(id), {
      reminders: reminders
    });
  }

  async updateStatus(status: string, data: any): Promise<Evaluation[]> {
    return EvaluationRepository.updateMany(
      { _id: { $in: data } },
      { status: status });
  }

  async closeEvaluation(slug: string): Promise<Evaluation> {
    return EvaluationRepository.findOneAndUpdate({ slug }, { status: 'completed' });
  }

  async closeEvaluationById(id: any): Promise<Evaluation> {
    return EvaluationRepository.findOneAndUpdate({ _id: new ObjectID(id) }, { status: 'completed' });
  }

  async findManyById(ids: Array<string>): Promise<Evaluation[]> {
    return EvaluationRepository.find({_id: {$in: ids}});
  }

  async listByStartDate(): Promise<Evaluation[]> {
    return EvaluationRepository.find({}, 'slug displayName name deliveredAt validUntil status enterprise.name enterprise.customer.name populationCount').sort({ deliveredAt: 'desc' }).limit(10);
  }

  async listByEnterpriseOrderByStartDate(enterpriseId: number): Promise<Evaluation[]> {
    return EvaluationRepository.find({ enterpriseId: enterpriseId }, 'slug name status');
  }

  async getPreviousByIdAndEnterprise(id: string, enterpriseId: number, deliveredAt: any, select?: undefined|any): Promise<Evaluation[]> {
    return EvaluationRepository.find({
        $and: [{
          _id: {$ne: new ObjectID(id)} },
          {enterpriseId: enterpriseId},
          {status: 'completed'},
          {deliveredAt: {$lt: deliveredAt}}
        ]
      }, select || undefined)
    .sort({'deliveredAt': -1});
  }

  /**
   * @description Update a evaluation's answered polls count
   * @returns {Promise<void>}
   */
  async updateAnsweredCount(id: string, populationCompletedCount: number): Promise<Evaluation> {
    return EvaluationRepository.findByIdAndUpdate(new ObjectID(id), {
      populationCompletedCount
    });
  }

  /**
   * @description Updates Suite Activity for a given Evaluation
   * @returns {Promise<Evaluation[]>}
   */
  async updateSuiteActivity(evaluation: Evaluation, status: string) {
    let resp;
    try {
      const productService = await ProductServiceService.findByName('OCC ENERGY COMPASS INDIVIDUAL');
      resp = await RunHttpRequest.suitePost(undefined, 'activities/energy-compass-individual/update-status', {
        evaluation: {
          enterpriseId: evaluation.enterpriseId,
          status: status,
          _id: evaluation._id
        },
        productService
      });
    } catch (error) {
      console.log('activities/energy-compass-individual/update-status', error);
      resp = error;
    }

    return resp;
  }
}

export default new EvaluationsService();
