/** @module todo */

import { getConnection } from 'typeorm';
import { Todo, Task } from './todo.model';

export const ERROR_ADD_DATA_INVALID = 'data pekerjaan tidak valid';
export const ERROR_ID_INVALID = 'task id tidak valid';
export const ERROR_TODO_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * add new todo
 * @param {TodoData} data todo detail
 * @returns {Promise<Todo>} new todo detail with id
 * @throws {string} when data not contain task property
 */
export async function add(data: Task): Promise<Task> {
  if (!data.task) {
    throw ERROR_ADD_DATA_INVALID;
  }
  const todoRepo = getConnection().getRepository<Todo>('Todo');
  const todo = new Todo(null, data.task, data.done);
  await todoRepo.save(todo);
  return todo;
}

/**
 * remove a todo by an id
 * @param {string} id todo id
 * @returns {Promise<Todo>} removed todo
 * @throws {string} when todo not found in database
 */
export async function remove(id: number): Promise<Todo> {
  const todoRepo = getConnection().getRepository<Todo>('Todo');
  const todo = await todoRepo.findOne(id);
  if (!todo) {
    throw ERROR_TODO_NOT_FOUND;
  }
  await todoRepo.delete(id);
  return todo;
}

/**
 * set todo task to done
 * @param {string} id todo task id
 * @returns {Promise<Todo>} set todo task to done with id
 * @throws {string} when id are invalid
 * @throws {string} when todo not found in database
 */
export async function done(id: number): Promise<Todo> {
  if (!id) {
    throw ERROR_ID_INVALID;
  }
  const todoRepo = getConnection().getRepository<Todo>('Todo');
  let todo = await todoRepo.findOne(id);
  if (!todo) {
    throw ERROR_TODO_NOT_FOUND;
  }
  todo.done = true;
  await todoRepo.save(todo);
  return todo;
}

/**
 * set todo task to undone
 * @param {string} id todo task id
 * @returns {Promise<Todo>} set todo task to undone with id
 * @throws {string} when id are invalid
 * @throws {string} when todo not found in database
 */
export async function undone(id: number): Promise<Todo> {
  if (!id) {
    throw ERROR_ID_INVALID;
  }
  const todoRepo = getConnection().getRepository<Todo>('Todo');
  let todo = await todoRepo.findOne(id);
  if (!todo) {
    throw ERROR_TODO_NOT_FOUND;
  }
  todo.done = false;
  await todoRepo.save(todo);
  return todo;
}

/**
 * get list of todo
 * @returns {Promise<Todo[]>} list of task to do
 */
export async function list(): Promise<Todo[]> {
  const todoRepo = getConnection().getRepository<Todo>('Todo');
  return todoRepo.find();
}
