import { Layout, CheckSquare, FolderGit2 } from 'lucide-react';

const StatsCard = ({ title, count, icon: Icon, color }) => (
    <div className="glass-panel rounded-2xl p-5 flex items-center gap-5 transition-transform hover:scale-105 duration-200">
        <div className={`p-4 rounded-full ${color} shadow-lg shadow-${color.split('-')[1]}-500/30`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold">{count}</h3>
        </div>
    </div>
);

const StatsWidget = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
                title="Workspaces"
                count={stats.workspaceCount}
                icon={Layout}
                color="bg-purple-500"
            />
            <StatsCard
                title="Active Projects"
                count={stats.projectCount}
                icon={FolderGit2}
                color="bg-blue-500"
            />
            <StatsCard
                title="Pending Tasks"
                count={stats.pendingTaskCount}
                icon={CheckSquare}
                color="bg-orange-500"
            />
        </div>
    );
};

export default StatsWidget;
