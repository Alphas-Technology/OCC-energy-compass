
import { Config } from './config';

let config: Config;

export function loadConfig(): Config {
  if (!config) {
    // const server = require(`./config/server/config`);
    // config = { ...server.default };
    config = {
      host: '0.0.0.0',
      port: 3000,
      uploads: {
        imgDest: process.env.APP_ENERGY_COMPASS_UPLOADS_IMGDEST,
        filesDest: process.env.APP_ENERGY_COMPASS_UPLOADS_FILESDEST,
        videoDest: process.env.APP_ENERGY_COMPASS_UPLOADS_VIDEODEST,
        azureAccount: process.env.APP_ENERGY_COMPASS_UPLOADS_AZUREACCOUNT,
        azureKey: process.env.APP_ENERGY_COMPASS_UPLOADS_AZUREKEY,
        azureConnection: process.env.APP_ENERGY_COMPASS_UPLOADS_AZURECONNECTION,
      },
      publicUrl: process.env.APP_ENERGY_COMPASS_PUBLIC_URL,
    };
  }

  return config;
}
