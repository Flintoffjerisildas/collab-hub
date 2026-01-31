import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';

import taskReducer from './slices/taskSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        project: projectReducer,
        task: taskReducer,
        chat: chatReducer,
        notification: notificationReducer,
    },
});
