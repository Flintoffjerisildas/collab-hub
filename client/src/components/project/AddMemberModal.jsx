import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMember } from '../../redux/slices/projectSlice';
import Button from '../common/Button';
import Input from '../common/Input';
import Label from '../common/Label';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const AddMemberModal = ({ projectId, onClose }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await dispatch(addMember({ projectId, email })).unwrap();
            toast.success('Member added successfully!');
            onClose();
        } catch (error) {
            toast.error(error || 'Failed to add member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus size={20} />
                        Add Member
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4">
                        Invite a new member to join this project by their email address.
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">User Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@example.com"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Member'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
