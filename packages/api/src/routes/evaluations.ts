
import { Router, Response } from 'express';
import EvaluationsController from './../controllers/evaluations.ctrl';
import IRequest from './contracts/request';
import { default as EvaluationsService } from '../services/evaluations.srvc';


export default (middlewares, services) => {

  const EvaluationsRouter = Router();

  EvaluationsRouter.get(
    '/find-by-token-id/:tokenId',
    EvaluationsController.findByTokenId
  );

  EvaluationsRouter.put(
    '/set-answersDimention',
    EvaluationsController.setAnswersDimention
  );

  EvaluationsRouter.put(
    '/update-answersDimention',
    EvaluationsController.updateAnswersDimention
  );

  EvaluationsRouter.use(middlewares.jwt);

  EvaluationsRouter.get(
    '/list',
    EvaluationsController.list
  );

  EvaluationsRouter.post(
    '/create',
    EvaluationsController.create
  );

  EvaluationsRouter.post(
    '/upload-invitation-file/:id',
    middlewares.uploads.single('pollInvitationFile'),
    async(req: IRequest, res: Response) => {
      const evaluation = await EvaluationsService.findById(req.params.id);
      const file = await services.storage.sendVideo(req.file.path, req.file.filename);
      evaluation.customEmailRelease.attachment = file.result.name;
      const resp = await EvaluationsService.updateCustomEmailReleaseBySlug(evaluation.slug, evaluation);
      res.status(200).send(resp);
    }
  );

  EvaluationsRouter.post(
    '/upload-reminder-file/:id',
    middlewares.uploads.single('reminderMailFile'),
    async(req: IRequest, res: Response) => {
      const evaluation = await EvaluationsService.findById(req.params.id);
      const file = await services.storage.sendVideo(req.file.path, req.file.filename);
      evaluation.customEmailReminder.attachment = file.result.name;
      for (const reminder of evaluation.reminders) {
        reminder.customEmail.attachment = file.result.name;
      }
      const resp = await EvaluationsService.updateCustomEmailReminderBySlug(evaluation.slug, evaluation);
      res.status(200).send(resp);
    }
  );

  EvaluationsRouter.get(
    '/generate-template',
    EvaluationsController.generateTemplate
  );

  EvaluationsRouter.get(
    '/get-count-evaluated/:slug',
    EvaluationsController.getCountEvaluatedsByTeam
  );

  EvaluationsRouter.get(
    '/get-one-to-edit/:slug',
    EvaluationsController.getOneToEdit
  );

  EvaluationsRouter.get(
    '/get-one-to-show/:slug',
    EvaluationsController.getOneToShow
  );

  EvaluationsRouter.get(
    '/get-one/:slug',
    EvaluationsController.getOne
  );

  EvaluationsRouter.get(
    '/find-by-id-to-report/:id',
    EvaluationsController.findByIdToReport
  );

  EvaluationsRouter.post(
    '/open-report/:id',
    EvaluationsController.openReport
  );

  EvaluationsRouter.post(
    '/open-report-individual/:id',
    EvaluationsController.openReportIndividual
  );

  EvaluationsRouter.get(
    '/current-threads/:id',
    EvaluationsController.currentThreads
  );

  EvaluationsRouter.post(
    '/open-thread-report/:id',
    EvaluationsController.openThreadReport
  );

  EvaluationsRouter.get(
    '/find-by-id/:id',
    EvaluationsController.findById
  );

  EvaluationsRouter.post(
    '/massive-upload',
    middlewares.uploads.single('file'),
    EvaluationsController.massiveUpload
  );

  EvaluationsRouter.get(
    '/check-balance/:key',
    EvaluationsController.checkBalance
  );

  EvaluationsRouter.post(
    '/edit/:slug',
    EvaluationsController.update
  );

  EvaluationsRouter.post(
    '/send-reminders',
    EvaluationsController.sendRemineders
  );

  EvaluationsRouter.get(
    '/close/:slug',
    EvaluationsController.close
  );

  return EvaluationsRouter;
};
