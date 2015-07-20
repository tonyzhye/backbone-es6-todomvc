'use strict';

import hapi from 'hapi';
import config from 'getconfig';
import path from 'path';
import uuid from 'node-uuid';
import swig from 'swig';
import good from 'good';
import goodConsole from 'good-console';
import hapiLocals from 'hapi-locals';

import routes from './routes';

var isProduction = (config.getconfig.env === 'production');
console.log(`node_env is production: ${ isProduction }`);

var server = new hapi.Server();
server.connection({
  host: config.host,
  port: config.port
});

server.views({
  engines: {
    html: swig
  },
  path: path.join(process.cwd(), 'views'),
  isCached: isProduction
});

server.ext('onPreResponse', (request, reply) => {
  if (!request.response.isBoom) {
    return reply.continue();
  }
  reply.view('error', request.response)
    .code(request.response.output.statusCode);
});

server.route(routes);

var plugins = [];

plugins.push({
  register: good,
  options: {
    opsInterval: 1000,
    reporters: [{
      reporter: goodConsole,
      events: { log: '*', response: '*' }
    }]
  }
});

plugins.push({
  register: hapiLocals
});

server.register(plugins, (err) => {
  if (err) {
    throw err;
  }
});

var cacheVersion = uuid.v4().slice(0, 8);
server.methods.locals('cacheVer', cacheVersion);

server.start(() => {
  console.log(`Server running at: ${ server.info.uri }`);
});

export default server;
