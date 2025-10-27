
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadDocument, getPatients } from '../../services/mockApi';
import { User } from '../../types';
import { useWallet } from '../../hooks/useWallet';

const UploadDocument: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [patientId, setPatientId] = useState('');
    const [patients, setPatients] = useState<User[]>([]);
    const [storageLocation, setStorageLocation] = useState<'On-Premises' | 'Cloud'>('On-Premises');
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const { addTransaction } = useWallet();

    useEffect(() => {
        getPatients().then(setPatients);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user || !patientId) {
            setMessage('Please select a file and a patient.');
            return;
        }

        setIsUploading(true);
        setMessage('');
        try {
            const uploadedDoc = await uploadDocument(file, user, patientId, storageLocation);
            setMessage(`Successfully uploaded "${uploadedDoc.name}" to ${storageLocation}. Document hash: ${uploadedDoc.hash.substring(0, 12)}...`);
            
            addTransaction(`Uploaded: ${uploadedDoc.name}`);

            setFile(null);
            setPatientId('');
            setStorageLocation('On-Premises');
            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if(fileInput) fileInput.value = '';

        } catch (error) {
            setMessage('An error occurred during upload.');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#111827] mb-6">Upload New Medical Document</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="patient-select" className="block text-sm font-medium text-[#4B5563]">Select Patient</label>
                    <select
                        id="patient-select"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-[#2563EB] sm:text-sm rounded-lg"
                        required
                    >
                        <option value="" disabled>-- Choose a patient --</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#4B5563]">Document File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#D1D5DB] border-dashed rounded-xl">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-[#4B5563]">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#2563EB] hover:text-[#1D4ED8] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#60A5FA]">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                    {file && <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#4B5563]">Storage Option</label>
                    <fieldset className="mt-2">
                        <legend className="sr-only">Storage location</legend>
                        <div className="space-y-2">
                            <label className={`relative flex items-center p-3 border rounded-lg cursor-pointer ${storageLocation === 'On-Premises' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}>
                                <input type="radio" name="storage-location" value="On-Premises" checked={storageLocation === 'On-Premises'} onChange={() => setStorageLocation('On-Premises')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="ml-3 flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">On-Premises Server</span>
                                    <span className="text-xs text-gray-500">Recommended for highly sensitive new records.</span>
                                </span>
                            </label>
                             <label className={`relative flex items-center p-3 border rounded-lg cursor-pointer ${storageLocation === 'Cloud' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}>
                                <input type="radio" name="storage-location" value="Cloud" checked={storageLocation === 'Cloud'} onChange={() => setStorageLocation('Cloud')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="ml-3 flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">Cloud Archive</span>
                                    <span className="text-xs text-gray-500">Cost-effective for long-term storage of non-critical files.</span>
                                </span>
                            </label>
                        </div>
                    </fieldset>
                </div>


                <button
                    type="submit"
                    disabled={isUploading || !file || !patientId}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60A5FA] disabled:bg-[#93C5FD] transition-colors"
                >
                    {isUploading ? 'Uploading...' : 'Upload and Add to Ledger'}
                </button>
                {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
            </form>
        </div>
    );
};

export default UploadDocument;