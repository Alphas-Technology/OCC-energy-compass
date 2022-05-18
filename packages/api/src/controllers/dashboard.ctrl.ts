
import { Request, Response } from 'express';


import { default as ProductServiceService } from '../services/product-service.srvc';
import { default as EvaluationsService } from '../services/evaluations.srvc';
import { default as EvaluatedService } from '../services/evaluated.srvc';

import IRequest from './contracts/request';

class DashboardController {

  async getEmployeeInfo(req: Request, res: Response) {
    const response = [];
    let evaluationsEmployee = undefined;
    const populationFields = 'status employee.enterpriseId token evaluationRef answersDimention';
    if (req.body.employeeId) {
      evaluationsEmployee = await EvaluatedService.findManyByEmployeeId(req.body.employeeId, populationFields);
    } else {
      evaluationsEmployee = await EvaluatedService.findManyByEmployeeEnterpriseId(req.body.employeeEnterpriseId, populationFields);
    }
    const productService = await ProductServiceService.findByName('OCC POR REPORTE INDIVIDUAL');

    const getProgress = (answersDimention) => {
      let questionCount = 0;
      let counterAnsweredQuestionsAuto = 0;
      let counterAnsweredQuestionsTeam = 0;

      for (const dimention in answersDimention) {
        if (Object.prototype.hasOwnProperty.call(answersDimention, dimention)) {
          const attributes = answersDimention[dimention];
          for (const behaviors in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, behaviors)) {
              const questions = attributes[behaviors];
              for (const question in questions) {
                if (Object.prototype.hasOwnProperty.call(questions, question)) {
                  const element = questions[question];
                  questionCount++;
                  if (element.auto >= 1 && element.auto <= 6) counterAnsweredQuestionsAuto++;
                  if (element.team >= 1 && element.team <= 6) counterAnsweredQuestionsTeam++;
                }
              }
            }
          }
        }
      }

      return ((counterAnsweredQuestionsAuto + counterAnsweredQuestionsTeam) / (questionCount * 2)) * 100;
    };

    for (const employee of evaluationsEmployee) {
      const evaluation = await EvaluationsService.findById(employee.evaluationRef, 'name displayName status');
      if (evaluation.status !== 'in_progress') {
        continue;
      }


      response.push({
        productService,
        token: employee.token,
        evaluation: {
          _id: evaluation._id,
          name: evaluation.name,
          displayName: evaluation.displayName,
          population: [employee]
        },
        score: employee.answersDimention ? getProgress(employee.answersDimention) : 0
      });
    }
    res.send(response);
  }

  async getEnterpriseInfo(req: IRequest, res: Response) {
    const evaluations: any = await EvaluationsService.listByEnterpriseOrderByStartDate(req.user.enterprise.id);
    const evaluationsResponse = [];
    for (const eva of evaluations) {
      const item = JSON.parse(JSON.stringify(eva));
      const members = await EvaluatedService.getByEvaluationRef(eva._id, 'status');
      item.team = members.length;
      item.answers = members.filter(m => m.status === 'completed').length;
      evaluationsResponse.push(item);
    }
    res.send({
      evaluations: evaluationsResponse
    });
  }

  async getAdminInfo(req: IRequest, res: Response) {
    const evaluations: any = await EvaluationsService.listByStartDate();
    const response = [];
    for (const eva of evaluations) {
      const item = JSON.parse(JSON.stringify(eva));
      item.team = await EvaluatedService.countByEvaluationRef(eva._id);
      response.push(item);
    }
    res.send({
      evaluations: response
    });
  }
}

export default new DashboardController();