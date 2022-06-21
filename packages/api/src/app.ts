
if (Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_ACTIVE)) {
  const appInsights = require('applicationinsights');
  appInsights.setup(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_KEY)
    .setAutoDependencyCorrelation(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoDependencyCorrelation))
    .setAutoCollectRequests(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoCollectRequests))
    .setAutoCollectPerformance(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoCollectPerformance))
    .setAutoCollectExceptions(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoCollectExceptions))
    .setAutoCollectDependencies(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoCollectDependencies))
    .setAutoCollectConsole(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setAutoCollectConsole))
    .setUseDiskRetryCaching(Boolean(process.env.APP_ENERGY_COMPASS_APPLICATION_INSIGHTS_setUseDiskRetryCaching));
  appInsights.start();
}

import * as express from 'express';
import * as cors from 'cors';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as bluebird from 'bluebird';
import { loadConfig } from './config/loader';
import { errorHandler } from './error';
import initializeAuth from './auth';
import RoutersFactory from './routes/';
import Uploads from './uploads';
import AzureStorage from './uploads/azure-storage';
import ValidatorFactory from './validator';
import registerWorkers from './workers';

const config = loadConfig();

const uploads = Uploads(loadConfig().uploads);
const azureStorage = new AzureStorage(config.uploads);
const validator = ValidatorFactory();
dotenv.config({ path: '.env' || '.env.example' });

// Create Express server
const app = express();

// Cors use
app.use(cors());

if (!Boolean(process.env.APP_ENERGY_COMPASS_COSMOSDB)) {
  // Connect to MongoDB
  const mongoUrl = process.env.APP_ENERGY_COMPASS_MONGODB_URI;
  const MongoStore = mongo(session);
  (<any>mongoose).Promise = bluebird;
  mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    },
  ).catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    // process.exit();
  });

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.APP_ENERGY_COMPASS_SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true
    })
  }));
} else {
  (<any>mongoose).Promise = bluebird;
  mongoose.connect('mongodb://' + process.env.APP_ENERGY_COMPASS_COSMOSDB_HOST + ':' + process.env.APP_ENERGY_COMPASS_COSMOSDB_PORT + '/' + process.env.APP_ENERGY_COMPASS_COSMOSDB_DBNAME + '?ssl=true&retrywrites=false&replicaSet=globaldb', {
    auth: {
      user: process.env.APP_ENERGY_COMPASS_COSMOSDB_USER,
      password: process.env.APP_ENERGY_COMPASS_COSMOSDB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to CosmosDB successful'))
  .catch((err) => console.error(err));

  // Event listener
  mongoose.connection.on('error', (err) => {
    console.log('*Event Listener Error*', err);
  });
}

// Avoid -> DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`
// without the `useFindAndModify` option set to false are deprecated.
// See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(RoutersFactory(
  {
    ...initializeAuth(),
    uploads,
    validator
  },
  {
    storage: azureStorage,
  }
));

app.use(errorHandler);

registerWorkers();

module.exports = app;