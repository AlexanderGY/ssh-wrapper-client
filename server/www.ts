import * as http from 'http';
import * as debugModule from 'debug';

import app from './app';

const debug = debugModule('express-start:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: any): number | string | boolean {
  const portInt = parseInt(val, 10);

  if (isNaN(portInt)) {
    return val;
  }

  if (portInt >= 0) {
    // port number
    return portInt;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
