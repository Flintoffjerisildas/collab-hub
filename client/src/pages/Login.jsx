import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Facebook, Twitter, Instagram, Linkedin, ArrowLeft, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-4">
            <div className="w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col md:flex-row min-h-[700px]">

                {/* Left Panel - Artistic Background */}
                <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

                    {/* Content overlay */}
                    <div className="relative z-10 flex justify-between items-center">
                        <span className="text-lg font-medium tracking-wide">CollabHub</span>
                        <Link to="/register" className="px-6 py-2 rounded-full border border-white/40 hover:bg-white hover:text-black transition-all text-sm font-medium backdrop-blur-md">
                            Join Us
                        </Link>
                    </div>

                    <div className="relative z-10 mb-12">
                        <h2 className="text-5xl font-bold leading-tight mb-4">Selected Works</h2>
                        <p className="text-white/80 max-w-sm">Determine your own pace and rhythm with our collaborative tools.</p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5">
                                <img src="https://ui-avatars.com/api/?name=JX&background=random" alt="User" className="h-full w-full rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">JeN RoG</p>
                                <p className="text-xs text-white/70">Dev Designer</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <ArrowLeft size={16} />
                            </button>
                            <button className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center relative bg-white h-[calc(100vh-64px)]">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">English (UK)</span>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Hi Designer</h1>
                            <p className="text-slate-500">Welcome to CollabHub</p>
                        </div>

                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="space-y-5">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className="h-14 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                                />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className="h-14 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <a href="#" className="text-sm font-medium text-red-500 hover:text-red-600">Forgot password?</a>
                            </div>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-400">or</span>
                                </div>
                            </div>

                            <button type="button" className="w-full h-14 rounded-xl border border-gray-200 flex items-center justify-center font-medium text-slate-600 hover:bg-gray-50 transition-colors gap-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.47c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.46H2.18C.8 10.08 0 12.97 0 16c0 3.03.8 5.92 2.18 8.54l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 4.8c1.6 0 3.04.55 4.15 1.61l3.14-3.14C17.45 1.5 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.46l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Login with Google
                            </button>

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-xl text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Login'}
                            </Button>

                            <div className="mt-8 text-center text-sm">
                                <span className="text-gray-500">
                                    Don't have an account?{' '}
                                </span>
                                <Link
                                    to="/register"
                                    className="font-medium text-red-500 hover:text-red-600 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>

                            <div className="mt-12 flex justify-center gap-6 text-gray-400">
                                <a href="#" className="hover:text-slate-600 transition-colors"><Facebook size={20} /></a>
                                <a href="#" className="hover:text-slate-600 transition-colors"><Twitter size={20} /></a>
                                <a href="#" className="hover:text-slate-600 transition-colors"><Linkedin size={20} /></a>
                                <a href="#" className="hover:text-slate-600 transition-colors"><Instagram size={20} /></a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
