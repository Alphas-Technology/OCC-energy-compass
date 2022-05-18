
import * as ms from 'ms';

export default () => {
  setInterval(() => { console.log('Updated at 2022-05-11 14:00'); }, 300000);
  const exampleInterval = '5m';

  setInterval(() => {
    console.log('Run interval - exampleInterval:', exampleInterval);
  }, ms(exampleInterval));
};
