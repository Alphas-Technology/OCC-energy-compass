
import { ObjectID } from 'mongodb';
import { Evaluated } from '../models/evaluated';
import EvaluatedRepository, { EvaluatedType } from '../schemas/evaluated.schema';

class EvaluatedService {

  async create(evaluated: Evaluated): Promise<Evaluated> {
    return (await new EvaluatedRepository(evaluated).save());
  }

  async save(populations: Array<Evaluated>): Promise<Evaluated[]> {
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

  async getByEvaluationRef(evaluationRef: any, select?: string|undefined): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'} }, select);
  }

  async getLotByEvaluationRef(evaluationRef: any, skip: number, qty: number, select?: string|undefined): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({ evaluationRef: new ObjectID(evaluationRef), status: { $ne : 'excluded'} }, select, { skip: Number(skip * qty), limit: Number(qty) });
  }

  async getOneByToken(token: string, select?: string|undefined): Promise<EvaluatedType> {
    return EvaluatedRepository.findOne({ token }, select);
  }

  async findManyByEmployeeId(employeeId: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({'employee.id': employeeId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findManyByEmployeeEnterpriseId(employeeEnterpriseId: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({'indEmpEntId': employeeEnterpriseId, 'status': { $nin: ['completed', 'excluded']} }, select || undefined);
  }

  async findOneByEmployeeEnterpriseIdAndEvaluationRef(evaluationRef: any, employeeId: number, select?: undefined|any): Promise<EvaluatedType> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      'employee.id': employeeId,
      'status': 'completed'
    }, select || undefined);
  }

  async findBatchByEvaluationRefAndEmployeeEnterpriseIds(evaluationRef: any, employeeEnterpriseIds: Array<number>, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find({
      evaluationRef: new ObjectID(evaluationRef),
      'indEmpEntId': { $in: employeeEnterpriseIds },
      'status': { $nin: ['completed', 'excluded']}
    }, select || undefined);
  }

  async getEvaluationBaseToken(evaluationRef: any): Promise<EvaluatedType> {
    return EvaluatedRepository.findOne({
      evaluationRef: new ObjectID(evaluationRef),
      'status': { $nin: ['excluded']}
    }, 'baseToken');
  }

  async findByBatchByEvaluationId(evaluationId: any, skip: number, qty: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find(
      { evaluationRef: evaluationId },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  async findByBatchByEvaluationIdByItems(evaluationId: any, filter, skip: number, qty: number, select?: undefined|any): Promise<EvaluatedType[]> {
    return EvaluatedRepository.find(
      { evaluationRef: evaluationId, ...filter },
      select || undefined,
      { skip: Number(skip * qty), limit: Number(qty) }
    );
  }

  async setPolicyAccepted(tokenId: string, url: string): Promise<EvaluatedType> {
    const data = {
      accepted: true,
      timestamp: Date.now(),
      url: url
    };
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'sensitiveDataTreatmentPolicyAccepted': data }},
      { new: true}
    );
  }

  async updateTempAnswers(tokenId: string, temp: any): Promise<EvaluatedType> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'temp': temp }},
      { new: true}
    );
  }

  async setPollCompleted(tokenId: string): Promise<EvaluatedType> {
    return EvaluatedRepository.findOneAndUpdate(
      {'token': tokenId},
      { '$set': { 'status': 'completed' }},
      { new: true}
    );
  }

}

export default new EvaluatedService();
