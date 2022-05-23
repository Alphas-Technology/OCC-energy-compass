
import * as ms from 'ms';

import CreatePopulationWorker from './individual/create-population';

export default () => {
  setInterval(() => { console.log('Updated at 2022-05-11 14:00'); }, 300000);
  const minutes = '5m';

  setInterval(() => {
    CreatePopulationWorker.checkCreatePopulation().then((res) => {
      // tslint:disable-next-line: no-console
      console.log('StartCreatePopulation exec:', res);
    }).catch((error) => {
      // tslint:disable-next-line: no-console
      console.log('CreatePopulation error:', error);
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
  }, ms('2m'));
};
