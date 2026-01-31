import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chat.service';

const initialState = {
    messages: [],
    isLoading: false,
    isError: false,
    message: '',
};

// Get project messages
export const getProjectMessages = createAsyncThunk(
    'chat/getMessages',
    async (projectId, thunkAPI) => {
        try {
            return await chatService.getProjectMessages(projectId);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Send message (API call - optional if relying purely on sockets, but good for persistence confirmation)
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (messageData, thunkAPI) => {
        try {
            return await chatService.sendMessage(messageData);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        resetChat: (state) => {
            state.messages = [];
            state.isLoading = false;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjectMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload;
            })
            .addCase(getProjectMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                // If we use optimistic updates or socket listening, we might not need this push
                // but checking if the message ID already exists prevents duplicates
                const exists = state.messages.find(m => m._id === action.payload._id);
                if (!exists) {
                    state.messages.push(action.payload);
                }
            });
    },
});

export const { addMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
