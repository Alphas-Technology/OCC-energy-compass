
import { default as EvaluationsService } from '../../services/evaluations.srvc';
import { default as EvaluatedService } from '../../services/evaluated.srvc';
import { default as OperationThreadsService } from '../../services/operation-threads.srvc';
import { Evaluated } from '../../models/evaluated';

import RunHttpRequest from '../../utils/run-http-request';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SendEvaluationsEmails {

  public async sendEmails() {
    const pendingOperationThreads = await OperationThreadsService.findByOperationAndStatus(
      'SendEvaluationEmail',
      'pending'
    );
    if (!pendingOperationThreads) {
      return;
    }
    await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThreads._id, 'in_progress');
    try {
      const evaluation = await EvaluationsService.findById(
        pendingOperationThreads.data._evaluation,
        pendingOperationThreads.data.type === 'reminder' ? 'customEmailReminder' : 'customEmailRelease'
      );

      const interval = 250;
      let population: Evaluated[];
      let round = 0;
      const select = 'employee.email status token employee.employeeEnterprise.firstName employee.employeeEnterprise.lastName';
      while (true) {
        if (pendingOperationThreads.data.type === 'reminder') {
          population = await EvaluatedService.findByBatchByEvaluationIdByItems(
            pendingOperationThreads.data._evaluation, {
              status: { $ne: 'finished' }
            }, round, interval, select);
        } else {
          population = await EvaluatedService.findByBatchByEvaluationId(
            pendingOperationThreads.data._evaluation, round, interval, select);
        }
        const customEmail = pendingOperationThreads.data.type === 'reminder' ? evaluation.customEmailReminder : evaluation.customEmailRelease;
        const endPopulation = await this.getAndFilterpopulation(population);
        const data = {
          population: endPopulation,
          customEmailRelease: customEmail,
          file: customEmail.attachment ? customEmail.attachment : ''
        };
        const res = await RunHttpRequest.suitePost(undefined, 'emails/create-energy-compass-emails', data);
        if (res.error) {
          throw new Error(`Suite Request Failed with status: ${res.error.status} by ${res.error.msg}`);
        }

        if (population.length < interval) {
          break;
        } else {
          round++;
        }

        await sleep(10000);
      }
      await OperationThreadsService.findOneAndUpdateStatus(pendingOperationThreads._id, 'completed');
    } catch (error) {
      return await this.saveFailed(pendingOperationThreads._id, 'SendEvaluationEmail', {
        error: error.stack ? error.stack : error.toString()
      });
    }

    return pendingOperationThreads._id;
  }

  private async getAndFilterpopulation(population: Evaluated[]) {
    const endPopulation = [];
    population.forEach((employee) => {
      if (employee.employee.email && (employee.status === 'pending' || employee.status === 'in_progress')) {
        endPopulation.push({
          token: employee.token,
          email: employee.employee.email,
          name: `${employee.employee.employeeEnterprise.firstName} ${employee.employee.employeeEnterprise.lastName}`
        });
      }
    });
    return endPopulation;
  }

  private async saveFailed (_id: string, type: string, data: {[key: string]: any}) {
    await OperationThreadsService.findOneAndSaveFail(_id, { type, ...data});
    return `failed by: ${type}`;
  }
}

export default new SendEvaluationsEmails();
