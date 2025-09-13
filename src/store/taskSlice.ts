import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentTask } from '@/types/agent';

const initialState: { tasks: AgentTask[] } = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<AgentTask[]>) {
      state.tasks = action.payload;
    },
    updateTask(state, action: PayloadAction<Partial<AgentTask> & { id: string }>) {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
  },
});

export const { setTasks, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
