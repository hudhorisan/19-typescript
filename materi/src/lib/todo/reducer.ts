export interface Task {
  id: number;
  task: string;
  done: boolean;
}

interface ActionObject {
  type: string;
}

interface ActionObjectAdd extends ActionObject {
  payload: Task;
}

interface ActionObjectDone extends ActionObject {
  payload: number;
}

type ActionObjectUndone = ActionObjectDone;

type ActionObjectLoadTask = {
  payload: Task[]
};


// setup state
export const initialState: Task[] = [
  { id: 1, task: 'main', done: false },
  { id: 2, task: 'minum', done: true },
];

// reduce function
export function add(state: Task[], action: ActionObjectAdd): Task[] {
  state.push({ id: action?.payload?.id, task: action?.payload?.task, done: false });
  return state;
}

export function done(state: Task[], action: ActionObjectDone): Task[] {
  const task = state.find((t) => t.id === action?.payload);
  if (!task) {
    // handle error
    return state;
  }
  task.done = true;
  return state;
}

export function undone(state: Task[], action: ActionObjectUndone): Task[] {
  const task = state.find((t) => t.id === action?.payload);
  if (task) {
    task.done = false;
    return state;
  }
  
  return state;
}

export function loadTasks(state: Task[], action: ActionObjectLoadTask): Task[] {
  state = action?.payload;
  return state;
}
