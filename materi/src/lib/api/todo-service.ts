/** @module todoService */

import * as config from '../config';
import { Task } from '../todo/reducer';
import { httpClient as client } from './client';

/**
 * mengambil daftar pekerjaan
 * @returns {Promise<Task[]>} daftar pekerjaan
 */
export async function fetchTasksApi(): Promise<Task[]> {
  return await client.get(`${config.TODO_SERVICE_BASEURL}/list`);
}

/**
 * menambahkan pekerjaan baru ke daftar entar
 *
 * @param {string} task data pekerjaan
 * @returns {Promise<Task>} detail pekerjaan yang sudah disimpan
 *
 * @example
 * const addTaskAsync = (task) => async (dispatch) => {
 *   const taskData = await addTaskApi(task);
 *   dispatch(addAction(taskData));
 * };
 */
export async function addTaskApi(task: string): Promise<Task> {
  return await client.post<Task>(`${config.TODO_SERVICE_BASEURL}/add`, { task });
}

/**
 * menandakan pekerjaan telah selesai
 * @param {number} id id dari pekerjaan
 * @returns {Promise<Task>} detail pekerjaan yang sudah disimpan
 */
export async function doneTaskApi(id: number): Promise<Task> {
  return await client.put(`${config.TODO_SERVICE_BASEURL}/done?id=${id}`);
}

/**
 * menandakan pekerjaan belum selesai
 * @deprecated jangan pake undone pake `done()`
 * @param {number} id id dari pekerjaan
 * @returns {Promise<Task>} detail pekerjaan yang sudah disimpan
 */
export async function undoneTaskApi(id: number): Promise<Task> {
  return await client.put(`${config.TODO_SERVICE_BASEURL}/undone?id=${id}`);
}
