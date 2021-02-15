/**
 * Todo type definition
 * @typedef {Object} Todo
 * @property {number} id id of a task
 * @property {string} task task description
 * @property {boolean} done true when task are finished
 */
export interface Todo {
  id: number;
  task: string;
  done: boolean;
}

/**
 * Task type definition
 * @typedef {Object} Task
 * @property {number} id id of a task
 * @property {string} task task description
 * @property {boolean} done true when task are finished
 */
export interface Task {
  id: number;
  task: string;
  done: boolean;
}

/**
 * TaskData type definition
 * @typedef {Object} TaskData
 * @property {string} task task description
 */
export interface TaskData {
  task: string;
}
