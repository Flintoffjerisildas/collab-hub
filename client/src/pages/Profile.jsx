import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Label from '../components/common/Label';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Direct API call for now or create generic update service

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
    }, [user]);

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const updateData = { name, email };
            if (password) updateData.password = password;

            const res = await api.put('/users/profile', updateData);
            toast.success('Profile updated successfully');
            // Update local user state? Should dispatch an action to update auth state.
            // For now, reload or specific action would be better.
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        }
    };

    return (
        <div className="container mx-auto p-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">User Profile</h1>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={onChange}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit">Update Profile</Button>
                        <Button type="button" onClick={() => navigate('/')}>Back</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
