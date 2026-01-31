import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/project.service';

const initialState = {
    projects: [],
    currentProject: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new project
export const createProject = createAsyncThunk(
    'projects/create',
    async (projectData, thunkAPI) => {
        try {
            return await projectService.createProject(projectData);
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

// Get workspace projects
export const getWorkspaceProjects = createAsyncThunk(
    'projects/getWorkspaceProjects',
    async (workspaceId, thunkAPI) => {
        try {
            return await projectService.getWorkspaceProjects(workspaceId);
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

// Get project by ID
export const getProjectById = createAsyncThunk(
    'projects/getById',
    async (id, thunkAPI) => {
        try {
            return await projectService.getProjectById(id);
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

// Add member to project
export const addMember = createAsyncThunk(
    'projects/addMember',
    async ({ projectId, email }, thunkAPI) => {
        try {
            return await projectService.addMember(projectId, email);
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

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetProjects: (state) => {
            state.projects = [];
            state.currentProject = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getWorkspaceProjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getWorkspaceProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projects = action.payload;
            })
            .addCase(getWorkspaceProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProjectById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.currentProject = action.payload;
            })
            .addCase(getProjectById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                state.currentProject = action.payload;
            });
    },
});

export const { reset, resetProjects } = projectSlice.actions;
export default projectSlice.reducer;
