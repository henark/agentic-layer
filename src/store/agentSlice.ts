import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentState, AgentMessage } from '@/types/agent';

const initialState: AgentState = {
  messages: [],
  tasks: [],
  config: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  },
  isRunning: false,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<AgentMessage>) {
      state.messages.push(action.payload);
    },
    setRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setRunning, setError } = agentSlice.actions;
export default agentSlice.reducer;
