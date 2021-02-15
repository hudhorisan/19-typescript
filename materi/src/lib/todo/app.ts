import './app.css';
import { store$ } from './store';
import {
  addTaskAsync,
  loadTasksAsync,
  doneTaskAsync,
  undoneTaskAsync,
} from './todo-client';

// view
const input = document.getElementById('todo');
const form = document.getElementById('todo-form');
const list = document.getElementById('todo-list');

if (form && input) {
  form.onsubmit = (event) => {
    event.preventDefault();
    const task = input.nodeValue;
    if (!task?.length) {
      return;
    }
    // dispatch action add
    store$.dispatch<any>(addTaskAsync(task));
    input.nodeValue = '';
  };
} else {
  // handle error
}

// presentation layer
store$.subscribe(() => {
  const state = store$.getState();
  render(state);
});
const state = store$.getState();
render(state);

store$.dispatch<any>(loadTasksAsync);

/**
 * render application
 * @param {Todo[]} state state of application
 */
function render(state) {
  if (!list) {
    // handle error
    return;
  }
  list.innerHTML = '';
  for (let i = 0; i < state.length; i++) {
    const todo = state[i];
    const li = document.createElement('li');
    li.textContent = todo.task;
    if (todo.done) {
      li.className = 'todo-done';
      li.onclick = function () {
        // dispatch action done
        store$.dispatch<any>(undoneTaskAsync(todo.id));
      };
    } else {
      li.className = '';
      li.onclick = function () {
        // dispatch action done
        store$.dispatch<any>(doneTaskAsync(todo.id));
      };
    }
    list.append(li);
  }
}
