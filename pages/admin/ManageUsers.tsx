import React, { useState, useEffect } from 'react';
import { getAllUsers, registerUser } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';

const ManageUsers: React.FC = () => {
    const { user: adminUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.Patient });

    const fetchUsers = async () => {
        setIsLoading(true);
        const userList = await getAllUsers();
        setUsers(userList);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email || !newUser.role || !adminUser) return;
        
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const result = await registerUser(newUser.name, newUser.email, newUser.role, adminUser);
        
        if (result.success) {
            setSuccess(result.message);
            setNewUser({ name: '', email: '', role: UserRole.Patient });
            fetchUsers(); // Refresh the list
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    const roleOptions = Object.values(UserRole).map(role => (
        <option key={role} value={role}>{role}</option>
    ));

    const roleColors: { [key in UserRole]: string } = {
        [UserRole.Admin]: 'bg-red-100 text-red-800',
        [UserRole.Doctor]: 'bg-blue-100 text-blue-800',
        [UserRole.Patient]: 'bg-green-100 text-green-800',
        [UserRole.Researcher]: 'bg-purple-100 text-purple-800',
        [UserRole.Auditor]: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-[#111827] mb-6">Create New User</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#4B5563]">Full Name</label>
                            <input type="text" name="name" id="name" value={newUser.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#4B5563]">Email Address</label>
                            <input type="email" name="email" id="email" value={newUser.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-[#4B5563]">Assign Role</label>
                            <select id="role" name="role" value={newUser.role} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {roleOptions}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500">A temporary password will be sent to the user's email. (This is a demo, any password will work for login).</p>
                        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-green-600">{success}</p>}
                    </form>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-[#111827] mb-6">Existing Users</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
