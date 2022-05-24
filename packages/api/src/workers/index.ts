
import * as ms from 'ms';

import CreatePopulationWorker from './individual/create-population';
import EditPopulationWorker from './individual/edit-population';
import EvaluationWorker from './individual/check-start-end-dates';
import EvaluationEmailsWorker from './individual/send-emails';

export default () => {
  setInterval(() => { console.log('Updated at 2022-05-11 14:00'); }, 300000);
  const quarter = '15m';
  const minutes = '5m';

  setInterval(() => {
    CreatePopulationWorker.checkCreatePopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('StartCreatePopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('CreatePopulation error:', error);
    });
    EditPopulationWorker.checkEditPopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('StartEditingPopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('EditingPopulation error:', error);
    });
  }, ms(minutes));

  setInterval(() => {
    CreatePopulationWorker.runCreatePopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('RunCreatePopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('RunCreatePopulation error:', error);
    });
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
  }, ms(minutes));
};
