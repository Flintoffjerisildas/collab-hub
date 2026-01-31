import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Layout, Calendar, Plus, } from 'lucide-react';
import Button from '../common/Button';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md max-w-7xl mx-auto w-full">
                <div className="text-xl font-bold tracking-tight">CollabHub</div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="hover:text-black transition-colors">Home</a>
                    <a href="#features" className="hover:text-black transition-colors">Features</a>
                    <a href="#" className="hover:text-black transition-colors">Pricing</a>
                    <a href="#" className="hover:text-black transition-colors">Blog</a>
                </div>
                <Button
                    onClick={() => navigate('/login')}
                    className="rounded-full px-6 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:shadow-none shadow-sm"
                >
                    Try it for Free <ArrowRight size={16} className="ml-2" />
                </Button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Gradient Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-orange-200 via-pink-200 to-purple-200 rounded-full blur-[100px] opacity-60 -z-10 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center px-6">
                    <p className="font-serif italic text-xl text-slate-600 mb-4">CollabHub - Your Team, in Perfect Sync.</p>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-6 leading-[0.9]">
                        Collaborate Smarter,
                        <br />
                        Not Harder
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Take control of your team's workflow with our all-in-one collaborative workspace. Manage projects, communicate in real-time, and keep everyone aligned—without the chaos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => navigate('/register')}
                            className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
                        >
                            Start for free <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Hero Graphic Placeholder (Phone/Interface) */}
                <div className="mt-20 max-w-5xl mx-auto px-6 relative">
                    <div className="relative rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl mx-auto max-w-[320px] border-4 border-slate-800">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-slate-800 rounded-b-2xl z-20"></div>
                        <div className="rounded-[2rem] overflow-hidden bg-white h-[650px] w-full relative">
                            {/* Abstract UI content inside phone */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex flex-col">
                                <div className="h-8 w-8 rounded-full bg-slate-200 mb-8 mt-4"></div>
                                <div className="h-8 w-3/4 rounded-full bg-slate-100 mb-4"></div>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Zap size={20} /></div>
                                        <div>
                                            <div className="h-2 w-24 bg-slate-100 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Layout size={20} /></div>
                                        <div>
                                            <div className="h-2 w-20 bg-slate-100 rounded mb-1"></div>
                                            <div className="h-2 w-12 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Calendar size={20} /></div>
                                        <div>
                                            <div className="h-2 w-28 bg-slate-100 rounded mb-1"></div>
                                            <div className="h-2 w-20 bg-slate-50 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto p-4 rounded-2xl bg-slate-900 text-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs opacity-70">Team Progress</span>
                                        <span className="text-xs font-bold">87%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full w-[87%] bg-gradient-to-r from-red-400 to-green-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative floating elements */}
                    <div className="absolute top-1/3 left-10 md:left-20 bg-white p-4 rounded-2xl shadow-xl shadow-purple-500/10 animate-bounce delay-100 hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={20} /></div>
                            <div>
                                <div className="text-xs font-bold text-slate-800">Task Completed</div>
                                <div className="text-[10px] text-slate-500">Just now</div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative floating elements */}
                    <div className="absolute top-2/3 right-10 md:right-20 bg-white p-4 rounded-2xl shadow-xl shadow-purple-500/10 animate-bounce delay-200 hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-yellow-600"><Plus size={20} /></div>
                            <div>
                                <div className="text-xs font-bold text-slate-800">New Task</div>
                                <div className="text-[10px] text-slate-500">Due today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Designed to Help Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-slate-900">
                            Built for Teams
                            <br />
                            That Move
                            <br />
                            Fast <span className="font-serif italic font-normal text-slate-600">With Less</span>
                            <br />
                            <span className="font-serif italic font-normal text-slate-600">Stress</span>
                        </h2>
                    </div>
                    <div>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            CollabHub is designed for modern teams who need to stay organized,
                            connected, and productive. We've combined the essential tools you need
                            into one seamless platform, no more app-switching chaos.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Real-Time Collaboration</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Work together seamlessly with live updates, instant messaging, and synchronized task boards. See changes as they happen and keep everyone on the same page.
                        </p>
                    </div>
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Visual Task Management</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Organize work with intuitive Kanban boards. Drag, drop, and prioritize tasks effortlessly. Track progress across projects and never lose sight of what matters.
                        </p>
                    </div>
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Smart Communication</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Chat with your team in project channels, direct messages, or workspace-wide discussions. Share files, mention teammates, and keep conversations contextual.
                        </p>
                    </div>
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Progress Tracking & Analytics</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Understand team productivity with visual dashboards. See what's moving forward, identify bottlenecks, and make data-driven decisions to keep projects on track.
                        </p>
                    </div>
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Unified Workspace</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Bring all your projects under one roof. Organize by teams, departments, or clients. Give everyone the right access with role-based permissions.
                        </p>
                    </div>
                    <div className="space-y-4 hover:border p-6 hover:border-slate-300 transition-all">
                        <h3 className="text-xl font-bold text-slate-900">Stay Notified, Never Surprised</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Get intelligent notifications about task assignments, mentions, deadlines, and updates. Control what you see and stay focused on your priorities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer gradient fade */}
            <div className="footer-container">
                <div className="h-40 bg-gradient-to-t from-green-300/50 to-transparent pointer-events-none" />
                <div className="footer-content container mx-auto px-6 py-12">
                    <div className="footer-logo flex items-center gap-2">
                        <img src="" alt="company logo" />
                        <p>CollabHub</p>
                    </div>
                    <div className="footer-copyright text-center">
                        <p>© 2025 CollabHub. All rights reserved.</p>
                    </div>
                    <div className="footer-social flex items-center gap-4 justify-center">
                        <ul className="flex items-center gap-4">
                            <li><a href="#"><FaFacebook /></a></li>
                            <li><a href="#"><FaTwitter /></a></li>
                            <li><a href="#"><FaInstagram /></a></li>
                            <li><a href="#"><FaLinkedin /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;