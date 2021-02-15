/** @module todoSchema */

import { EntitySchema } from 'typeorm';

export interface Task {
  id: number;
  task: string;
  done: boolean;
}

/**
 * todo model
 */
export class Todo {
  public id: number;
  /**
   * create new instance of todo model
   * @param {string} id id of a todo
   * @param {string} task task description
   * @param {boolean} done true when task are done
   */
  constructor(
    id: number,
    public task: string,
    public done: boolean
  ) {
    this.id = id;
    this.task = task;
    this.done = done;
  }
}

/**
 * enty schema of todo model
 */
export const TodoSchema = new EntitySchema<Task>({
  name: 'Todo',
  target: Todo,
  tableName: 'todos',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    task: {
      type: 'varchar',
      length: 255,
    },
    done: {
      type: 'boolean',
      default: false,
    },
  },
});