import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

export default function (app: Application): void {
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
}
