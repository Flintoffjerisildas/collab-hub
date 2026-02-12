import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from './redux/slices/notificationSlice';
import socketService from './services/socket.service';

import SocketStatus from './components/common/SocketStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Workspace from './pages/Workspace';
import Project from './pages/Project';
import GitHubCallback from './pages/GitHubCallback';
import Home from './pages/Home'; // Placeholder
import NotFound from './pages/NotFound'; // Placeholder

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Connect to socket with userId for personal notifications
      const socket = socketService.connect({ query: { userId: user._id || user.id } });

      // Listen for notifications
      socketService.onNotification((notification) => {
        dispatch(addNotification(notification));
        // Optional: Show toast
        // toast.info(notification.message);
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [user, dispatch]);

  return (
    <>
      <Router>
        <div
          className="min-h-screen font-sans antialiased text-foreground bg-center bg-cover bg-fixed"
          style={{ backgroundImage: `url('/glass-bg.png')` }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/github/callback" element={<GitHubCallback />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {user && <SocketStatus />}
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
