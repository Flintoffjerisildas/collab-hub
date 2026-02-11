import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import WorkspaceList from '../components/workspace/WorkspaceList';
import NotificationDropdown from '../components/common/NotificationDropdown';
import StatsWidget from '../components/dashboard/StatsWidget';
import MyTasksWidget from '../components/dashboard/MyTasksWidget';
import dashboardService from '../services/dashboard.service';
import { toast } from 'react-toastify';
import Landing from '../components/layout/Landing';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const [statsData, tasksData] = await Promise.all([
                    dashboardService.getDashboardStats(),
                    dashboardService.getMyTasks()
                ]);
                setStats(statsData);
                setMyTasks(tasksData);
            } catch (error) {
                console.error("Dashboard error:", error);
                // Don't show toast for dashboard load failure to avoid annoyance, just log
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (!user) {
        // Redirect if not logged in (or show landing page)
        // For now, redirect to login
        // In real app, maybe show a landing page
        return (
            <Landing />
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user.name}! Here's what's happening.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationDropdown />
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile')} className="bg-secondary rounded-full">
                        {user.name.charAt(0).toUpperCase() || 'U'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={onLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="mb-8">
                {!isLoading && <StatsWidget stats={stats} />}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Workspaces (2/3 width) */}
                <div className="lg:col-span-2 glass-panel rounded-3xl p-6">
                    <WorkspaceList />
                </div>

                {/* Right Column: My Tasks (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="p-4 border-b border-white/20 flex justify-between items-center">
                        <h3 className="font-semibold">My Pending Tasks</h3>
                        <button className="text-sm text-primary hover:underline" onClick={() => navigate('/tasks')}>View All</button>
                    </div>
                    <div className="glass-panel rounded-3xl p-6 h-96 overflow-y-auto">
                        {!isLoading && <MyTasksWidget tasks={myTasks} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
