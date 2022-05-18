
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import slugify from 'slugify';
import * as xlsx from 'xlsx';

import { default as EvaluationsService } from '../services/evaluations.srvc';
import { default as EvaluatedService } from '../services/evaluated.srvc';
import { default as ProductServiceService } from '../services/product-service.srvc';
import { default as QuestionnairesService } from '../services/questionnaires.srvc';
import { default as OperationThreadsService } from '../services/operation-threads.srvc';

import { UnauthorizedException, BadRequestException } from '../error';

import IRequest from './contracts/request';

import TokenUtils from '../utils/token-utils';
import HttpSuperagentRequest from '../utils/http-superagent-request';
import RunHttpRequest from '../utils/run-http-request';
import SpendRequest from '../utils/spend-request';

const promisify = require('util.promisify');

class EvaluationsController {

  private services: any;

  async useServices(services): Promise<any> {
    this.services = services;
    return Promise.resolve();
  }

  async list(req: IRequest, res: Response) {
    let evaluations = undefined;
    const selectFields = 'displayName name questionnaire.name  status deliveredAt validUntil slug _id';
    const filter = req.query.filter ? { status: req.query.filter } : {};
    if (req.user.role === 'admin') {
      evaluations = await EvaluationsService.listAll(filter, selectFields);
    } else {
      evaluations = await EvaluationsService.listByEnterprise(req.user.enterprise.id, filter, selectFields);
    }
    res.send({ items: evaluations });
  }

  async setAnswersDimention(req: Request, resp: Response) {
    try {
      await EvaluatedService.setAnswersDimention(req.body.tokenId, req.body.data);
      resp.send();
    } catch (error) {
      resp.send({
        msg: 'Not found',
        er: error,
        status: 404
      });
    }
  }

  async updateAnswersDimention(req: Request, resp: Response) {
    try {
      await EvaluatedService.updateAnswersDimention(req.body.tokenId, req.body.path, req.body.score);
      resp.send({success: true});
    } catch (error) {
      resp.send({
        msg: 'Not found',
        er: error,
        status: 404
      });
    }
  }

  async updateEvaluator(req: IRequest, resp: Response) {
    try {
      const eva = await EvaluatedService.completeAnswersDimention(req.body.tokenId, req.body.data);
      const num = await EvaluatedService.countActivesByEvaluationRef(eva.evaluationRef);
      if (!num) {
        await EvaluationsService.closeEvaluationById(eva.evaluationRef);
        const productService = await ProductServiceService.findByName('OCC POR REPORTE INDIVIDUAL');
        await RunHttpRequest.suitePost(req, 'activities/create-activity', {
          service: {
            enterpriseId: req.user.enterprise.id,
            _id: eva.evaluationRef,
            productService: productService.code,
            status: 'completed'
          }
        });
      }
      resp.send();
    } catch (error) {
      resp.send({
        msg: 'Not found',
        er: error,
        status: 404
      });
    }
  }

  async updateEvaluationStatus(req: Request, resp: Response) {
    try {
      const response = await EvaluationsService.updateEvaluationStatus(req.body.tokenId, req.body.type, req.body.index, req.body.evaluatedIndex);
      resp.send(response);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        er: error,
        status: 404
      });
    }
  }

  async updateActivityStatus(evaluationsIds: any[]) {
    const evaluations = await EvaluationsService.findManyById(evaluationsIds);
    evaluations.forEach(async evaluation => {
      try {
        await HttpSuperagentRequest.sendRequest({
          product: 'suite',
          path: 'activities/evaluation-dml/update-status',
          method: 'POST',
          data: {
            evaluation: evaluation,
            productId: 3,
            serviceId: 6
          }
        });
      } catch (error) {
        console.log('activities/evaluation-dml/update-status', error);
      }
    });
  }

  async create(req: IRequest, res: Response) {
    const name = req.body.evaluation.name;
    const slug = slugify(name, { lower: true }) + `-${new Date().getTime()}`;
    try {
      const reminders = [];
      for (const reminder of req.body.evaluation.reminders) {
        if (!reminder.value) {
          continue;
        }
        reminders.push({
          dateTime: new Date(reminder.value + 'T' + reminder.hour + ':00Z'),
          status: 'pending',
          customEmail: {
            subject: req.body.evaluation.reminderMail.subject,
            body: req.body.evaluation.reminderMail.body
          }
        });
      }

      const employeesRequest = await RunHttpRequest.suitePost(req, 'employees/all-participants-by-ids', {
        enterpriseId: req.user.enterprise.id,
        ids: req.body.evaluation.evaluated,
        lang: req.body.lang || 'es'
      });
      if (!employeesRequest.success) {
        throw new BadRequestException('suite-fail/employee-list');
      }
      const questionnaire = await QuestionnairesService.findOneBySlug(req.body.evaluation.questionnaire);
      if (!questionnaire) {
        throw new BadRequestException('por-fail/questionnaire-not-found');
      }

      const spend = await SpendRequest(req, 'OCC POR REPORTE INDIVIDUAL', req.body.evaluation.evaluated.length);
      if (typeof spend === 'string') {
        throw new BadRequestException('suite-fail/create-por/spend-fail');
      }

      const evaluation = {
        name,
        displayName: req.body.evaluation.displayName ? req.body.evaluation.displayName : '',
        slug,
        enterpriseId: req.user.enterprise.id,
        enterprise: req.body.evaluation.enterprise,
        questionnaire,
        status: 'pending',
        timeZone: req.body.evaluation.timeZone,
        deliveredAt: new Date(`${req.body.evaluation.deliveredAt.value} ${req.body.evaluation.deliveredAt.hour}`),
        validUntil: new Date(`${req.body.evaluation.validUntil.value} ${req.body.evaluation.validUntil.hour}`),
        customEmailRelease: {
          subject: req.body.evaluation.pollInvitation.subject,
          body: req.body.evaluation.pollInvitation.body
        },
        customEmailDeadline: {
          body: req.body.evaluation.thankMessage
        },
        customEmailReminder: {
          subject: req.body.evaluation.reminderMail.subject,
          body: req.body.evaluation.reminderMail.body
        },
        reminders,
        operations: spend,
      };
      const response = await EvaluationsService.create(evaluation);

      let generatedToken = await TokenUtils.hash(`evaluated${slug}${new Date().toDateString()}`);
      generatedToken = TokenUtils.sanitize(generatedToken);
      let increases = 1;
      let decreases = employeesRequest.res.length;
      const evaluated = [];
      for (const employee of employeesRequest.res) {
        if (employee.active) {
          const token: string = generatedToken.concat(String(increases++))
            .concat(String(employee.enterpriseId))
            .concat(String(employee.id))
            .concat(String(decreases--));
          evaluated.push({
            baseToken: generatedToken,
            token,
            employee,
            answersDimention: undefined,
            status: 'pending',
            evaluationRef: response._id
          });
        }
      }
      await EvaluatedService.save(evaluated);

      const productService = await ProductServiceService.findByName('OCC POR REPORTE INDIVIDUAL');
      await RunHttpRequest.suitePost(req, 'activities/create-activity', {
        service: {
          enterpriseId: req.user.enterprise.id,
          _id: response._id
        },
        productService: productService.code
      });

      res.send(response);
    } catch (error) {
      res.send({
        msg: error,
        status: 400
      });
    }
  }

  async update (req: IRequest, res: Response) {
    const oldEvaluation = await EvaluationsService.findOneBySlug(req.params.slug, 'reminders status enterpriseId operations');
    if (!oldEvaluation) {
      throw new BadRequestException('por-fail/not-found');
    }
    if (oldEvaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('por-fail/user-enterprise-not-found');
    }

    const input = req.body.evaluation;
    if (oldEvaluation.customEmailRelease.attachment) {
      if (input.invitationFileFlag === false) { // Si es falso, el usuario borró el archivo adjunto.
        input.customEmailRelease = {
          subject: input.pollInvitation.subject,
          body: input.pollInvitation.body
        };
      } else {
        if (input.pollInvitation.file === undefined) {
          input.customEmailRelease = {
            subject: input.pollInvitation.subject,
            body: input.pollInvitation.body,
            attachment: oldEvaluation.customEmailRelease.attachment
          };
        } else {
          input.customEmailRelease = {
            subject: input.pollInvitation.subject,
            body: input.pollInvitation.body
          };
        }
      }
    } else {
      input.customEmailRelease = {
        subject: input.pollInvitation.subject,
        body: input.pollInvitation.body
      };
    }

    if (oldEvaluation.customEmailReminder.attachment) {
      if (input.reminderFileFlag === false) { // Si es falso, el usuario borró el archivo adjunto.
        input.customEmailReminder = {
          subject: input.reminderMail.subject,
          body: input.reminderMail.body
        };
      } else {
        if (input.reminderMail.file === undefined) {
          input.customEmailReminder = {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body,
            attachment: oldEvaluation.customEmailReminder.attachment
          };
        } else {
          input.customEmailReminder = {
            subject: input.reminderMail.subject,
            body: input.reminderMail.body
          };
        }
      }
    } else {
      input.customEmailReminder = {
        subject: input.reminderMail.subject,
        body: input.reminderMail.body
      };
    }

    const evaluation: any = {
      name: input.name,
      displayName: req.body.evaluation.displayName ? req.body.evaluation.displayName : '',
      customEmailReminder: input.customEmailReminder,
      customEmailDeadline: {
        body: input.thankMessage
      },
      reminders: []
    };

    const employeesRequest = await RunHttpRequest.suitePost(req, 'employees/all-participants-by-ids', {
      enterpriseId: req.user.enterprise.id,
      ids: req.body.evaluation.evaluated,
      lang: req.body.lang || 'es'
    });
    if (!employeesRequest.success) {
      throw new BadRequestException('suite-fail/employee-list');
    }

    if (oldEvaluation.status === 'pending') {
      const questionnaire = await QuestionnairesService.findOneBySlug(req.body.evaluation.questionnaire);
      if (!questionnaire) {
        throw new BadRequestException('por-fail/questionnaire-not-found');
      }
      evaluation.timeZone = req.body.evaluation.timeZone;
      evaluation.deliveredAt = new Date(`${req.body.evaluation.deliveredAt.value} ${req.body.evaluation.deliveredAt.hour}`);
      evaluation.customEmailRelease = input.customEmailRelease;
    }
    evaluation.validUntil = new Date(`${req.body.evaluation.validUntil.value} ${req.body.evaluation.validUntil.hour}`);

    const evaluatedCount = await EvaluatedService.countByEvaluationRef(oldEvaluation._id);
    let spend = [];
    if (req.body.evaluation.evaluated.length - evaluatedCount > 0) {
      spend = await SpendRequest(req, 'OCC POR REPORTE INDIVIDUAL', req.body.evaluation.evaluated.length - evaluatedCount);
      if (typeof spend === 'string') {
        throw new BadRequestException('suite-fail/edit-por/spend-fail');
      }
    }
    spend.unshift(...oldEvaluation.operations);
    evaluation.operations = spend;

    if (req.body.evaluation.reminders) {
      for (const reminder of req.body.evaluation.reminders) {
        const rem = {
          dateTime: undefined,
          status: '',
          customEmail: {
            subject: '',
            body: ''
          }
        };

        if (reminder.value !== '') {
          rem.dateTime = new Date(reminder.value + 'T' + reminder.hour + ':00Z');
          rem.status = 'pending';
          rem.customEmail = {
            subject: req.body.evaluation.reminderMail.subject,
            body: req.body.evaluation.reminderMail.body
          };

          evaluation.reminders.push(rem);
        }
      }
    }

    await EvaluationsService.updateBySlug(req.params.slug, evaluation);

    let generatedToken = await TokenUtils.hash(`evaluated${req.params.slug}${new Date().toDateString()}`);
    generatedToken = TokenUtils.sanitize(generatedToken);
    let increases = 1;
    let decreases = employeesRequest.res.length;
    const evaluated = [];
    const status = oldEvaluation.status === 'pending' ? 'pending' : 'include';
    const oldEvaluated = await EvaluatedService.getByEvaluationRef(oldEvaluation._id, 'employee.id');
    for (const employee of employeesRequest.res) {
      if (employee.active) {
        const exist = oldEvaluated.find(eva => eva.employee.id === employee.id);
        if (!exist) {
          const token: string = generatedToken.concat(String(increases++))
            .concat(String(employee.enterpriseId))
            .concat(String(employee.id))
            .concat(String(decreases--));
          evaluated.push({
            baseToken: generatedToken,
            token,
            employee,
            answersDimention: undefined,
            status,
            evaluationRef: oldEvaluation._id
          });
        } else {
          const idx = oldEvaluated.indexOf(exist);
          oldEvaluated.splice(idx, 1);
        }
      }
    }
    if (evaluated.length) {
      await EvaluatedService.save(evaluated);
    }
    if (oldEvaluated.length) {
      if (oldEvaluation.status === 'pending') {
        for (let i = 0; i < oldEvaluated.length; i++) {
          await EvaluatedService.deleteOne(oldEvaluation._id, oldEvaluated[i]._id);
        }
      } else {
        for (let i = 0; i < oldEvaluated.length; i++) {
          await EvaluatedService.exclude(oldEvaluation._id, oldEvaluated[i]._id);
        }
      }
    }
    res.send(oldEvaluation);
  }

  async getCountEvaluatedsByTeam(req: IRequest, res: Response) {
    const evaluation = await EvaluationsService.findOneBySlug(req.params.slug, '_id enterpriseId');
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    res.send({ count: await EvaluatedService.countActivesByEvaluationRef(evaluation._id) });
  }

  async getOneToEdit(req: IRequest, res: Response) {
    const evaluation = await EvaluationsService.findOneBySlug(req.params.slug);
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    evaluation.evaluated = await EvaluatedService.getByEvaluationRef(evaluation._id, 'employee');
    res.send(evaluation);
  }

  async getOneToShow(req: IRequest, res: Response) {
    const evaluation = await EvaluationsService.findOneBySlug(req.params.slug, 'name displayName slug status timeZone deliveredAt validUntil reminders enterpriseId');
    if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
      throw new BadRequestException('evaluation-not-found');
    }
    evaluation.evaluated = await EvaluatedService.getByEvaluationRef(evaluation._id, 'status employee');
    res.send(evaluation);
  }

  async getOne(req: Request, res: Response) {
    res.send(await EvaluationsService.findOneBySlug(req.params.slug));
  }

  async findByTokenId(req: Request, resp: Response) {
    try {
      const evaluated = await EvaluatedService.getOneByToken(req.params.tokenId);
      if (!evaluated) {
        resp.send({
          executed: false,
          msg: 'Evaluation not found'
        });
      } else {
        const evaluation = await EvaluationsService.findById(evaluated.evaluationRef as any);
        if (!evaluation) {
          resp.send({
            executed: false,
            msg: 'Evaluation not found'
          });
        } else {
        // if (evaluation.enterprise.logo) {
        //   evaluation.enterprise.logo = await this.services.storage.getImgUrl(evaluation.enterprise.logo);
        // }
          resp.send({
            executed: true,
            data: evaluation,
            evaluated: evaluated,
            team: await EvaluatedService.getByEvaluationRef(evaluated.evaluationRef, 'employee.firstName employee.lastName')
          });
        }
      }
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async findById(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.params.id);
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      resp.status(200).send(evaluation);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async findByIdToReport(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.params.id, 'name displayName slug status enterpriseId');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      evaluation.evaluated = await EvaluatedService.getByEvaluationRef(evaluation._id, 'status employee');
      resp.send(evaluation);
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async openReport(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.params.id, 'name displayName questionnaire status enterpriseId enterprise deliveredAt validUntil');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      const spend = await SpendRequest(req, 'REPORTE ORGANIZACIONAL OCC POR', 1);
      if (typeof spend === 'string') {
        throw new BadRequestException('suite-fail/evaluation/spend-fail');
      }
      const productService = await ProductServiceService.findByName('REPORTE ORGANIZACIONAL OCC POR');
      await RunHttpRequest.suitePost(req, 'activities/create-activity', {
        service: {
          enterpriseId: req.user.enterprise.id,
          _id: evaluation._id
        },
        productService: productService.code
      });

      await OperationThreadsService.save({
        operation: 'DownloadReport',
        status: 'pending',
        createdAt: new Date(),
        data: {
          _id: evaluation._id,
          evaluation: {
            enterpriseId: evaluation.enterpriseId,
            questionnaire: evaluation.questionnaire,
            name: evaluation.name,
            displayName: evaluation.displayName,
            deliveredAt: evaluation.deliveredAt,
            validUntil: evaluation.validUntil,
            status: evaluation.status
          },
          evaluated: await EvaluatedService.countByEvaluationRef(evaluation._id),
          step: 0,
          progress: 0,
          type: 'organizational',
          individualReference: undefined,
          lang: req.user.lang
        }
      });

      resp.send({ _id: evaluation._id});
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async openReportIndividual(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.params.id, 'name displayName questionnaire status enterpriseId enterprise deliveredAt validUntil');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }

      await OperationThreadsService.save({
        operation: 'DownloadReport',
        status: 'pending',
        createdAt: new Date(),
        data: {
          _id: evaluation._id,
          evaluation: {
            enterpriseId: evaluation.enterpriseId,
            questionnaire: evaluation.questionnaire,
            name: evaluation.name,
            displayName: evaluation.displayName,
            deliveredAt: evaluation.deliveredAt,
            validUntil: evaluation.validUntil,
            status: evaluation.status
          },
          evaluated: await EvaluatedService.countByEvaluationRef(evaluation._id),
          step: 0,
          progress: 0,
          type: 'individual',
          individualReference: req.body.evaluatedId,
          lang: req.user.lang
        }
      });

      resp.send({ _id: evaluation._id});
    } catch (error) {
      resp.send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async currentThreads(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.params.id, 'name displayName questionnaire status enterpriseId enterprise');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      }
      resp.send(await OperationThreadsService.findDownloadReportsByPollId(evaluation._id, '_id status data.type data.progress data.individualReference'));
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async openThreadReport(req: IRequest, resp: Response) {
    try {
      const evaluation = await EvaluationsService.findById(req.body.id, 'status enterpriseId');
      if (!evaluation || evaluation.enterpriseId !== req.user.enterprise.id) {
        throw new BadRequestException('evaluation-not-found');
      } else if (evaluation.status !== 'completed') {
        throw new BadRequestException('evaluation-status-not-found');
      }

      const thread = await OperationThreadsService.findOneDownloadReportById(req.params.id);
      if (!thread) {
        throw new BadRequestException('evaluation-thread-not-found');
      }

      resp.send(thread);
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async checkBalance(req: IRequest, resp: Response) {
    try {
      const balance = await RunHttpRequest.suiteGet(req, 'token-account-detail/balance');
      if (!balance.success) {
        throw new BadRequestException(`suite-fail/${balance.error.msg}`);
      }
      const product = req.params.key === 'roop' ? 'REPORTE ORGANIZACIONAL OCC POR' : 'OCC POR REPORTE INDIVIDUAL';
      const productService = await ProductServiceService.findByName(product);
      const productServiceSuite = await RunHttpRequest.suiteGet(req, `product-services/c/${productService.code}`);
      if (!productServiceSuite.success) {
        throw new BadRequestException(`suite-fail/${productServiceSuite.error.msg}`);
      }

      resp.send({
        balance: balance.res.balance,
        productService: productServiceSuite.res.tokenPrice
      });
    } catch (error) {
      resp.status(404).send({
        msg: 'Not found',
        status: 404
      });
    }
  }

  async generateTemplate(req: Request, res: Response) {
    const headers = ['email'];

    const employeesRequest = await RunHttpRequest.suiteGet(req, 'employees/participants-list');
    if (!employeesRequest.success) {
      throw new BadRequestException('suite-fail/generateTemplate/employee-list');
    }

    const examples = [];
    for (const enterpriseEmployee of employeesRequest.res.items) {
      if (enterpriseEmployee.employee.email) {
        examples.push([enterpriseEmployee.employee.email]);
      }
    }
    const unparsed = Papa.unparse({ fields: headers, data: examples});
    res.send({ template: unparsed });
  }

  async massiveUpload(req: IRequest, res: Response) {
    const employeesRequest = await RunHttpRequest.suiteGet(req, 'employees/participants-list');
    if (!employeesRequest.success) {
      throw new BadRequestException('suite-fail/generateTemplate/employee-list');
    }

    const file = req.file;
    const employees = employeesRequest.res.items;

    let parsed;
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (extension !== 'csv') {
      const workbook = xlsx.readFile(file.path);
      const sheetNameList = workbook.SheetNames;
      const auxFile = { data: xlsx.utils.sheet_to_csv(workbook.Sheets[sheetNameList[0]]) };
      parsed = Papa.parse( auxFile.data, { header: true });
    } else {
      const asyncReadFile = promisify(fs.readFile);
      const csvFile = await asyncReadFile(file.path, 'utf8');
      parsed = Papa.parse( csvFile, { header: true });
    }

    fs.unlink(file.path, (err) => {
      if (err) { throw err; }
    });

    const employeesUploaded = parsed.data;
    const evaluated = [];
    const errors = {
      evaluatedNotFound: [], // evaluado si no está recorrer hasta el siguiente evaluado y dar advertencia de que ese evaluado no existe (listo)
      evaluatedDuplicated: [], // Evaluador: ignorar y recorrer hasta el siguiente evaluador, solo se toma una vez y dar advertencia (listo)
    };

    for (const employeeUploaded of employeesUploaded) { // Recorre Empleados cargados en csv
      if (employeeUploaded.email) { // Si el empleado cargado no posee tipo entonces es un evaluado
        const employee = employees.find((emp) => { // Se busca los datos generales del empledo en base al correo
          return emp.employee.email === employeeUploaded.email;
        });
        if (!employee) { // Si no se consigue se agrega el email a los evaluados no conseguidos se enciende la bandera para continuar hasta el siguiente evaluado
          errors.evaluatedNotFound.push(employeeUploaded.email);
          continue;
        } else { // Se buscan los datos del nuevo evaluado
          const alreadyEmployee = evaluated.find((emp) => { // Se verifica que el evaluado no exista anteriormente como otro evaluado
            return emp.id === employee.id;
          });
          if (alreadyEmployee) { // Si el evaluado existe como otro evaluado se salta el proceso de llenado y se activa la bandera para continuar al siguiente evaluado
            errors.evaluatedDuplicated.push(employee);
            continue;
          }
          evaluated.push(employee);
        }
      }
    }

    res.send({ evaluated, errors });
  }

  async sendRemineders (req: IRequest, res: Response) {
    try {
      const evaluation = await EvaluationsService.findOneBySlug(req.body.slug);
      const getTokenAndPopulation = (evaluated): { population: Array<number>, tokens: {[key: string]: string}} => {
        const response: { population: Array<number>, tokens: {[key: string]: string}} = {
          population: [],
          tokens: {}
        };
        for (const eva of evaluated) {
          if (eva.status !== 'completed') {
            response.population.push(eva.employee.id);
            response.tokens[String(eva.employee.id)] = eva.token;
          }
        }
        return response;
      };

      const evaluated = getTokenAndPopulation(await EvaluatedService.getByEvaluationRef(evaluation._id, 'status token employee.id'));
      await RunHttpRequest.suitePost(undefined, 'emails/create-por-evaluation-email', {
        enterpriseId: evaluation.enterpriseId,
        population: evaluated.population,
        tokens: evaluated.tokens,
        reminder: true,
        customEmailRelease: evaluation.customEmailReminder,
        file: evaluation.customEmailReminder.attachment ? evaluation.customEmailReminder.attachment : ''
      });

      res.send();
    } catch (error) {
      res.status(400);
      res.send({ error });
    }
  }

  async close (req: IRequest, res: Response) {
    try {
      const evaluation = await EvaluationsService.closeEvaluation(req.params.slug);
      // await HttpSuperagentRequest.sendRequest({
      //   product: 'suite',
      //   path: 'activities/evaluation-dml/update-status',
      //   method: 'POST',
      //   data: {
      //     evaluation: evaluation,
      //     productId: 3,
      //     serviceId: 6
      //   }
      // });
      res.send(evaluation);
    } catch (error) {
      res.status(400);
      res.send({ error });
    }
  }
}

export default new EvaluationsController();