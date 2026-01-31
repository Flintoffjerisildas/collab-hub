import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Facebook, Twitter, Instagram, Linkedin, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;

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

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };

            dispatch(register(userData));
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-4">
            <div className="w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col md:flex-row min-h-[700px]">

                {/* Left Panel - Artistic Background (Reversed for Register maybe? No, keep consistent) */}
                <div className="relative hidden md:flex w-1/2 flex-col justify-between p-12 text-white bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

                    {/* Content overlay */}
                    <div className="relative z-10 flex justify-between items-center">
                        <span className="text-lg font-medium tracking-wide">CollabHub</span>
                        <Link to="/login" className="px-6 py-2 rounded-full border border-white/40 hover:bg-white hover:text-black transition-all text-sm font-medium backdrop-blur-md">
                            Login
                        </Link>
                    </div>

                    <div className="relative z-10 mb-12">
                        <h2 className="text-5xl font-bold leading-tight mb-4">Join the Future</h2>
                        <p className="text-white/80 max-w-sm">Start your journey with CollabHub and transform the way you work.</p>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-0.5">
                                <span className="flex h-full w-full items-center justify-center bg-black/50 rounded-full text-xs">CH</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Community</p>
                                <p className="text-xs text-white/70">10k+ Members</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Register Form */}
                <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center relative bg-white h-[calc(100vh-64px)]">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">English (UK)</span>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                            <p className="text-slate-500">Join our community today</p>
                        </div>

                        <form className="space-y-6" onSubmit={onSubmit}>
                            <div className="space-y-5">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    className="h-14 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                                />
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
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    required
                                    className="h-14 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-xl text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Register'}
                            </Button>

                            <div className="mt-8 text-center text-sm">
                                <span className="text-gray-500">
                                    Already have an account?{' '}
                                </span>
                                <Link
                                    to="/login"
                                    className="font-medium text-red-500 hover:text-red-600 hover:underline"
                                >
                                    Log in
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

export default Register;
