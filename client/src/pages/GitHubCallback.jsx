import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import githubService from '../services/github.service';
import { updateUser } from '../redux/slices/authSlice';

const GitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const code = searchParams.get('code');

    useEffect(() => {
        const handleGithubCallback = async () => {
            if (!code) {
                toast.error('GitHub authentication failed: No code received');
                navigate('/profile');
                return;
            }

            try {
                const data = await githubService.handleCallback(code);

                // Update user in redux
                if (data.githubUsername) {
                    dispatch(updateUser({ githubUsername: data.githubUsername }));
                }

                toast.success(data.message || 'GitHub connected successfully!');
                navigate('/profile');
            } catch (error) {
                console.error('GitHub Callback Error:', error);
                toast.error(error.response?.data?.message || 'Failed to connect GitHub');
                navigate('/profile');
            }
        };

        handleGithubCallback();
    }, [code, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Connecting to GitHub...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        </div>
    );
};

export default GitHubCallback;
