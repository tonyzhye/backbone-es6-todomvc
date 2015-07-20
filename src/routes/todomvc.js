'use strict';

import _ from 'lodash';

let todos = [
  {
    id: 1,
    title: 'Todo item 1',
    completed: false
  },
  {
    id: 2,
    title: 'Todo item 2',
    completed: true
  }
];
let todoId = 3;

let routes = [];

routes.push({
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    reply.view('todomvc/index', {
      title: 'TodoMVC'
    });
  }
});

routes.push({
  method: 'GET',
  path: '/api/todomvc',
  handler: (req, reply) => {
    reply(todos).code(200);
  }
});

routes.push({
  method: 'POST',
  path: '/api/todomvc',
  handler: (req, reply) => {
    var todo = {
      id: todoId++,
      title: req.payload.title,
      completed: req.payload.completed
    };
    todos.push(todo);
    reply(todo).code(201);
  }
});

routes.push({
  method: 'PUT',
  path: '/api/todomvc/{id}',
  handler: (req, reply) => {
    let id = _.parseInt(req.params.id);
    let todoIndex = _.findIndex(todos, (todo) => { return todo.id === id; });

    if (todoIndex !== -1) {
      let newtodo = {
        id: id,
        title: req.payload.title,
        completed: req.payload.completed
      };
      todos[todoIndex] = newtodo;
      reply().code(200);
    } else {
      reply('No todo found.').code(400);
    }
  }
});

routes.push({
  method: 'DELETE',
  path: '/api/todomvc/{id}',
  handler: (req, reply) => {
    let id = _.parseInt(req.params.id);
    _.remove(todos, (todo) => { return todo.id === id; });
    reply().code(200);
  }
});

export default routes;
