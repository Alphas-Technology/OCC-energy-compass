
import { ObjectID } from 'mongodb';
import { Evaluator } from '../models/evaluator';
import EvaluatedRepository, { EvaluatorType } from '../schemas/evaluators.schema';

class EvaluatedService {

  async create(evaluator: Evaluator): Promise<Evaluator> {
    return (await new EvaluatedRepository(evaluator).save());
  }

  async save(populations: Array<Evaluator>): Promise<Evaluator[]> {
    return EvaluatedRepository.insertMany(populations);
  }

  async excludeOne(evaluationRef: any, ref: any) {
    return EvaluatedRepository.updateOne(
      { evaluationRef: new ObjectID(evaluationRef), _id: new ObjectID(ref) },
      { $set: { status: 'excluded', employee: undefined } },
      (err) => {}
    );
  }

  async excludeBatch(evaluationRef: any, populationIds: Array<any>) {
    return EvaluatedRepository.updateMany({
      evaluationRef: new ObjectID(evaluationRef),
      _id: { $in: populationIds }
    }, {
      $set: { status: 'excluded', employee: undefined }
    });
  }

  async deleteMany(evaluationRef: any, populations: Array<any>) {
    return EvaluatedRepository.findOneAndDelete({ evaluationRef: new ObjectID(evaluationRef), _id: { $in: populations.map(p => new ObjectID(p._id))} });
  }

  async deleteOne(evaluationRef: any, populations: any) {
    return EvaluatedRepository.deleteOne({ evaluationRef: new ObjectID(evaluationRef), _id: new ObjectID(populations) }, (err) => {});
  }

  async deleteBatch(evaluationRef: any, populationIds: Array<any>) {
    return EvaluatedRepository.deleteMany({
      evaluationRef: new ObjectID(evaluationRef),
      _id: { $in: populationIds }
    });
  }

  async countByEvaluationRef(evaluationRef: any): Promise<number> {
    return EvaluatedRepository.countDocuments({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'}  }, (err, result) => result);
  }

  async countActivesByEvaluationRef(evaluationRef: any): Promise<number> {
    return EvaluatedRepository.countDocuments({ evaluationRef: new ObjectID(evaluationRef), status: { $nin : ['excluded', 'completed']}  }, (err, result) => result);
  }

  async countCompletedByEvaluationRef(evaluationRef: any): Promise<number> {
    return EvaluatedRepository.countDocuments({ evaluationRef: new ObjectID(evaluationRef), status: 'completed' }, (err, result) => result);
  }

  async getByEvaluationRef(evaluationRef: any, select?: string|undefined): Promise<EvaluatorType[]> {
    return EvaluatedRepository.find({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'} }, select);
  }

  async getLotByEvaluationRef(evaluationRef: any, skip: number, qty: number, select?: string|undefined): Promise<EvaluatorType[]> {
    return EvaluatedRepository.find({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'} }, select, { skip: Number(skip * qty), limit: Number(qty) });
  }

  async getOneByToken(token: string, select?: string|undefined): Promise<EvaluatorType> {
    return EvaluatedRepository.findOne({ token }, select);
  }

  async findManyByEmployeeId(employeeId: number, select?: undefined|any): Promise<EvaluatorType[]> {
    return EvaluatedRepository.find({'employee.id': employeeId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findManyByEmployeeEnterpriseId(employeeEnterpriseId: number, select?: undefined|any): Promise<EvaluatorType[]> {
    return EvaluatedRepository.find({'indEmpEntId': employeeEnterpriseId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findOneByEmployeeEnterpriseIdAndEvaluationRef(evaluationRef: any, employeeId: number, select?: undefined|any): Promise<EvaluatorType> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      'employee.id': employeeId,
      'status': 'completed'
    }, select || undefined);
  }

  async findBatchByEvaluationRefAndEmployeeEnterpriseIds(evaluationRef: any, employeeEnterpriseIds: Array<number>, select?: undefined|any): Promise<EvaluatorType[]> {
    return EvaluatedRepository.find({
      evaluationRef: new ObjectID(evaluationRef),
      'indEmpEntId': { $in: employeeEnterpriseIds },
      'status': { $nin: ['completed', 'excluded']}
    }, select || undefined);
  }

  async getEvaluationBaseToken(evaluationRef: any): Promise<EvaluatorType> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      'status': { $nin: ['excluded']}
    }, 'baseToken');
  }

  async setAnswersDimention(tokenId: string, answersDimention: any): Promise<EvaluatorType> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'answersDimention': answersDimention, 'status': 'in_progress' }},
      { new: true}
    );
  }

  async updateAnswersDimention(tokenId: string, path: string, score: number): Promise<EvaluatorType> {
    const data: any = {
      $set : {
        status: 'in_progress'
      }
    };
    data.$set[`answersDimention.${path}`] = score;
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      data,
      { new: true}
    );
  }

  async completeAnswersDimention(tokenId: string, answersDimention: any): Promise<EvaluatorType> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'answersDimention': answersDimention, 'status': 'completed' }},
      { new: true}
    );
  }

}

export default new EvaluatedService();