
import * as ms from 'ms';

import CreatePopulationWorker from './evaluation/create-population';
import EditPopulationWorker from './evaluation/edit-population';
import EvaluationWorker from './evaluation/check-start-end-dates';
import EvaluationEmailsWorker from './evaluation/send-emails';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default () => {
  setInterval(() => { console.log('Updated at 2022-05-11 14:00'); }, 300000);
  const quarter = '15m';
  const minutes = '5m';

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

  setInterval(async () => {
    EvaluationWorker.checkStartEndDates().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('EvaluationStartCheckStartEndDates exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Evaluation error:', error);
    });
  }, ms(quarter));

  setInterval(async () => {
    EvaluationEmailsWorker.sendEmails().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('Send Evaluation Email:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('Send Evaluation Email error:', error);
    });
  }, ms('4m'));
};
