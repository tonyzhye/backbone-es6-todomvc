/*global $*/
import TodoRouter from './routers/router';
import AppView from './views/app-view';
import Backbone from 'backbone';

class Application {
  constructor() {
    new TodoRouter(); // eslint-disable-line
    Backbone.history.start();
    new AppView(); // eslint-disable-line
  }
}

$(() => {
  new Application(); // eslint-disable-line
});
