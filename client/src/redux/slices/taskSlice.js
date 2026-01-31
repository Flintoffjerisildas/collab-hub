import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/task.service';

const initialState = {
    tasks: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Create new task
export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData, thunkAPI) => {
        try {
            return await taskService.createTask(taskData);
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

// Get project tasks
export const getProjectTasks = createAsyncThunk(
    'tasks/getAll',
    async (projectId, thunkAPI) => {
        try {
            return await taskService.getProjectTasks(projectId);
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

// Update task
export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, taskData }, thunkAPI) => {
        try {
            return await taskService.updateTask(id, taskData);
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

// Delete task
export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id, thunkAPI) => {
        try {
            return await taskService.deleteTask(id);
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

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        reset: (state) => initialState,
        socketUpdate: (state, action) => {
            const { type, task, taskId } = action.payload;
            if (type === 'TASK_CREATED') {
                state.tasks.push(task);
            } else if (type === 'TASK_UPDATED') {
                const index = state.tasks.findIndex((t) => t._id === task._id);
                if (index !== -1) {
                    state.tasks[index] = task;
                }
            } else if (type === 'TASK_DELETED') {
                state.tasks = state.tasks.filter((t) => t._id !== taskId);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProjectTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjectTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = action.payload;
            })
            .addCase(getProjectTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    (task) => task._id === action.payload._id
                );
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    (task) => task._id !== action.payload.id
                );
            });
    },
});

export const { reset, socketUpdate } = taskSlice.actions;
export default taskSlice.reducer;
