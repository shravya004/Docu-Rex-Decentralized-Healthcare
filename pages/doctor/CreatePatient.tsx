
import React, { useState } from 'react';
import { registerUser } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const CreatePatient: React.FC = () => {
    const { user: doctorUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newPatient, setNewPatient] = useState({ name: '', email: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPatient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPatient.name || !newPatient.email || !doctorUser) return;
        
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const result = await registerUser(newPatient.name, newPatient.email, UserRole.Patient, doctorUser);
        
        if (result.success) {
            setSuccess(result.message + " The patient can now log in using their email.");
            setNewPatient({ name: '', email: '' });
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#111827] mb-6">Create New Patient Record</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#4B5563]">Patient's Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={newPatient.name} 
                        onChange={handleInputChange} 
                        required 
                        className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB] sm:text-sm" 
                        placeholder="e.g., Jane Doe"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#4B5563]">Patient's Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={newPatient.email} 
                        onChange={handleInputChange} 
                        required 
                        className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB] sm:text-sm"
                        placeholder="e.g., jane.doe@email.com"
                    />
                </div>
                 <p className="text-xs text-gray-500 pt-2">An invitation and temporary password will be sent to the patient's email. (This is a demo, any password will work for login).</p>
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60A5FA] disabled:bg-[#93C5FD] transition-colors"
                >
                    {isSubmitting ? 'Creating Patient...' : 'Create Patient'}
                </button>
                {error && <p className="text-sm text-center text-red-600 mt-4">{error}</p>}
                {success && <p className="text-sm text-center text-green-600 mt-4">{success}</p>}
            </form>
        </div>
    );
};

export default CreatePatient;
