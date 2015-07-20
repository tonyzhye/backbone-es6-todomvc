/*global $*/
/*global _*/
import { View } from 'backbone';
import Common from 'js/todomvc/common';
import Todos from 'js/todomvc/collections/todos';
import TodoView from 'js/todomvc/views/todo-view';
import StatsTmpl from 'text!templates/todomvc/stats.html';

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
class AppView extends View {
  constructor(options = {}) {
    _.defaults(options, {
      // Instead of generating a new element, bind to the existing skeleton of
      // the App already present in the HTML.
      el: '#todoapp',

      // Our template for the line of statistics at the bottom of the app.
      statsTemplate: _.template(StatsTmpl),

      // Delegated events for creating new items, and clearing completed ones.
      events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
      }
    });
    super(options);
    _.defaults(this, options);
  }

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved in *localStorage*.
  initialize() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.$list = $('#todo-list');

    this.listenTo(Todos, 'add', this.addOne);
    this.listenTo(Todos, 'reset', this.addAll);
    this.listenTo(Todos, 'change:completed', this.filterOne);
    this.listenTo(Todos, 'filter', this.filterAll);
    this.listenTo(Todos, 'all', _.debounce(this.render, 0));

    // Suppresses 'add' events with {reset: true} and prevents the app view
    // from being re-rendered for every model. Only renders when the 'reset'
    // event is triggered at the end of the fetch.
    Todos.fetch({ reset: true });
  }

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render() {
    var completed = Todos.completed().length;
    var remaining = Todos.remaining().length;

    if (Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (Common.TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  }

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne(todo) {
    var view = new TodoView({ model: todo });
    this.$list.append(view.render().el);
  }

  // Add all items in the **Todos** collection at once.
  addAll() {
    this.$list.html('');
    Todos.each(this.addOne, this);
  }

  filterOne(todo) {
    todo.trigger('visible');
  }

  filterAll() {
    Todos.each(this.filterOne, this);
  }

  // Generate the attributes for a new Todo item.
  newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: Todos.nextOrder(),
      completed: false
    };
  }

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to *localStorage*.
  createOnEnter(e) {
    if (e.which === Common.ENTER_KEY && this.$input.val().trim()) {
      Todos.create(this.newAttributes());
      this.$input.val('');
    }
  }

  // Clear all completed todo items, destroying their models.
  clearCompleted() {
    _.invoke(Todos.completed(), 'destroy');
    return false;
  }

  toggleAllComplete() {
    var completed = this.allCheckbox.checked;

    Todos.each(function (todo) {
      todo.save({
        completed: completed
      });
    });
  }
}

export default AppView;
