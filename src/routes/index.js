'use strict';

import path from 'path';

var routes = [];

routes.push({
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    directory: {
      path: path.join(process.cwd(), 'public'),
      index: false,
      redirectToSlash: false
    }
  }
});

routes.push({
  method: 'GET',
  path: '/favicon.ico',
  handler: {
    file: 'public/favicon.ico'
  }
});

// merge routes from other route js files
routes = routes.concat(
  require('./todomvc')
);

export default routes;
