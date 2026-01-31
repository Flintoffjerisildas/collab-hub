import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '../../services/workspace.service';

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new workspace
export const createWorkspace = createAsyncThunk(
    'workspaces/create',
    async (workspaceData, thunkAPI) => {
        try {
            return await workspaceService.createWorkspace(workspaceData);
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

// Get user workspaces
export const getWorkspaces = createAsyncThunk(
    'workspaces/getAll',
    async (_, thunkAPI) => {
        try {
            return await workspaceService.getWorkspaces();
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

// Delete workspace
export const deleteWorkspace = createAsyncThunk(
    'workspaces/delete',
    async (id, thunkAPI) => {
        try {
            return await workspaceService.deleteWorkspace(id);
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

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        resetWorkspaces: (state) => {
            state.workspaces = [];
            state.currentWorkspace = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWorkspace.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.workspaces.push(action.payload);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getWorkspaces.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getWorkspaces.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.workspaces = action.payload;
            })
            .addCase(getWorkspaces.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.workspaces = state.workspaces.filter(
                    (workspace) => workspace._id !== action.payload.id
                );
            });
    },
});

export const { reset, resetWorkspaces } = workspaceSlice.actions;
export default workspaceSlice.reducer;
