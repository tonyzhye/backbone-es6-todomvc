/*global _*/
import { Router } from 'backbone';
import Common from 'js/todomvc/common';
import Todos from 'js/todomvc/collections/todos';

// Todo Router
class TodoRouter extends Router {
  constructor(options = {}) {
    _.defaults(options, {
      '*filter': 'setFilter'
    });
    super({ routes: options });
    this.routes = options;
  }

  setFilter(param) {
    // Set the current filter to be used
    Common.TodoFilter = param || '';
    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    Todos.trigger('filter');
  }
}

export default TodoRouter;
