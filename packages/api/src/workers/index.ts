
import * as ms from 'ms';

import CreatePopulationWorker from './evaluation/create-population';
import EditPopulationWorker from './evaluation/edit-population';
import EvaluationWorker from './evaluation/check-start-end-dates';
import EvaluationEmailsWorker from './evaluation/send-emails';
import TempAnswersWorker from './evaluation/temp-answers';
import ReportCheck from './reports/check-pending-reports';
import ProcessReportOrganizational from './reports/organizational';
import ProcessReportByPopulation from './reports/by-population';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default () => {
  setInterval(() => { console.log('Updated at 2022-07-22 16:00'); }, ms('5m'));
  const quarter = '15m';
  const minutes = '5m';
  const seconds = '30s';

  setInterval(() => {
    ReportCheck.checkReportRequests().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Check Report Request:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Check Report Request error:', error);
    });
  }, ms('2m'));

  setInterval(() => {
    ProcessReportOrganizational.processReportResults().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Processed Report:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Processing Report error:', error);
    });
    ProcessReportByPopulation.processReportResults().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Processed Segmented Report:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Processing Segmented Report error:', error);
    });
  }, ms(seconds));

  setInterval(async () => {
    CreatePopulationWorker.checkCreatePopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('StartCreatePopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('CreatePopulation error:', error);
    });

    await sleep(ms('1m'));

    EditPopulationWorker.checkEditPopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('StartEditingPopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('EditingPopulation error:', error);
    });
  }, ms(minutes));

  setInterval(async () => {
    CreatePopulationWorker.runCreatePopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('RunCreatePopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('RunCreatePopulation error:', error);
    });

    await sleep(ms('1m'));

    EditPopulationWorker.runEditPopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('RunEditingPopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('RunEditingPopulation error:', error);
    });
  }, ms('2m'));

  setInterval(() => {
    EvaluationWorker.checkStartEndDates().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('EvaluationStartCheckStartEndDates exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Evaluation error:', error);
    });
  }, ms(quarter));

  setInterval(() => {
    EvaluationEmailsWorker.sendEmails().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Send Evaluation Email:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Send Evaluation Email error:', error);
    });
  }, ms('4m'));

  setInterval(() => {
    TempAnswersWorker.processAnswers().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Saved TempAnswers:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Save TempAnswers error:', error);
    });
  }, ms('1m'));
};
