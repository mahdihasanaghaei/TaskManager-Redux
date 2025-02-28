
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: TaskPriority;
  dueDate: string | null;
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// Load tasks from localStorage
const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return [];
};

const initialState: TaskState = {
  tasks: loadTasks(),
  filter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const priorityWeight = {
  low: 1,
  medium: 2,
  high: 3,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    editTask: (state, action: PayloadAction<{
      id: string;
      title: string;
      description: string;
      priority: TaskPriority;
      dueDate: string | null;
    }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'dueDate' | 'priority' | 'createdAt'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  toggleTask,
  setFilter,
  setSortBy,
  setSortOrder,
} = taskSlice.actions;
export default taskSlice.reducer;
