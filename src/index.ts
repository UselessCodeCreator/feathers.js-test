import cluster from 'cluster';
import os from 'os';
import logger from './logger';
import app from './app';

const CPU_COUNT = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork();
  }
} else {
  const port = app.get('port');
  const server = app.listen(port);

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d : [WORKER_ID] %d', app.get('host'), port, cluster.worker.id)
  );
}

