/*global _*/
import { Collection } from 'backbone';
//import Store from 'backbonelocalstorage';
import Todo from 'js/todomvc/models/todo';

class TodosCollection extends Collection {
  constructor(models, options = {}) {
    _.defaults(options, {
      // Reference to this collection's model.
      model: Todo,
      //localStorage: new Store('todos-backbone'),
      url: '/api/todomvc',
      // Todos are sorted by their original insertion order.
      comparator: 'order'
    });
    super(models, options);
    _.defaults(this, options);
  }

  // Filter down the list of all todo items that are finished.
  completed() {
    return this.where({ completed: true });
  }

  // Filter down the list to only todo items that are still not finished.
  remaining() {
    return this.where({ completed: false });
  }

  // We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder() {
    return this.length ? this.last().get('order') + 1 : 1;
  }
}

export default new TodosCollection();
