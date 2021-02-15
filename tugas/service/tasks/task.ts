import {  getConnection  } from 'typeorm';
import * as workerClient from './worker.client';
import * as bus from '../lib/bus';
import {TaskInterface,Task} from './task.model'

export const ERROR_TASK_DATA_INVALID:string = 'data pekerjaan baru tidak lengkap';
export const ERROR_TASK_NOT_FOUND:string = 'pekerjaan tidak ditemukan';
export const ERROR_TASK_ALREADY_DONE:string = 'pekerjaan sudah selesai';
export interface DataTask{
  job:string;
  assigneeId:number;
  attachment:string;
}

export async function add(data:DataTask):Promise<TaskInterface> {
  if (!data.job || !data.assigneeId) {
    throw ERROR_TASK_DATA_INVALID;
  }
  await workerClient.info(data.assigneeId);
  const taskRepo = getConnection().getRepository<Task>('Task');
  const newTask = await taskRepo.save({
    job: data.job,
    assignee: { id: data.assigneeId },
    attachment: data.attachment,
  });
  const task = await taskRepo.findOne(newTask.id, { relations: ['assignee'] });
  if (!task) {
    throw ERROR_TASK_NOT_FOUND;
  }
  bus.publish('task.added', task);
  return task;
}

export async function done(id:number) {
  const taskRepo = getConnection().getRepository<Task>('Task');
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  if (task.done) {
    throw ERROR_TASK_ALREADY_DONE;
  }
  task.done = true;
  await taskRepo.save(task);
  bus.publish('task.done', task);
  return task;
}

export async function cancel(id:number) {
  const taskRepo = getConnection().getRepository<Task>('Task');
  const task = await taskRepo.findOne(id, { relations: ['assignee'] });
  if (!task || task?.cancelled) {
    throw ERROR_TASK_NOT_FOUND;
  }
  task.cancelled = true;
  await taskRepo.save(task);
  bus.publish('task.cancelled', task);
  return task;
}

export function list() {
  const taskRepo = getConnection().getRepository<Task>('Task');
  return taskRepo.find({ relations: ['assignee'] });
}

