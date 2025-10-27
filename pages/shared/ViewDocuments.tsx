
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getDocumentsForUser, verifyDocumentById, getBlockchainEntries } from '../../services/mockApi';
import { Document, UserRole, BlockchainEntry } from '../../types';
import { useWallet } from '../../hooks/useWallet';

type DocumentWithStatus = Document & { status: 'Verified' | 'Pending' };

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const isVerified = status === 'Verified';
    const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full inline-block';
    const colorClasses = isVerified 
        ? 'bg-[#10B981]/10 text-[#059669]' 
        : 'bg-[#F59E0B]/10 text-[#D97706]';
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

const StorageLocationInfo: React.FC<{ location: Document['storageLocation'] }> = ({ location }) => {
    const storage = location || 'On-Premises'; // Default for old data
    const isCloud = storage === 'Cloud';
    const icon = isCloud ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
    );
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className="text-xs text-gray-500">{storage}</span>
        </div>
    );
}

const DocumentCard: React.FC<{ doc: DocumentWithStatus; onVerify: (id: string) => void; isAdmin: boolean }> = ({ doc, onVerify, isAdmin }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div>
                <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <StatusBadge status={doc.status} />
                </div>
                <h4 className="font-bold text-[#111827] truncate mb-1">{doc.name}</h4>
                <div className="space-y-1 text-xs text-[#4B5563]">
                    <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                    <p>Size: {(doc.size / 1024).toFixed(2)} KB</p>
                    <StorageLocationInfo location={doc.storageLocation} />
                </div>
                <p className="text-xs text-gray-500 font-mono mt-3 break-all bg-gray-50 p-2 rounded">Hash: {doc.hash.substring(0, 20)}...</p>
            </div>
            <div className="mt-4">
            {isAdmin && doc.status === 'Pending' && (
                <button 
                    onClick={() => onVerify(doc.id)} 
                    className="w-full text-sm bg-[#10B981] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Verify on Ledger
                </button>
             )}
            </div>
        </div>
    );
};


const ViewDocuments: React.FC = () => {
    const { user } = useAuth();
    const { addTransaction } = useWallet();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [blockchain, setBlockchain] = useState<BlockchainEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchDocuments = async () => {
        if (!user) return;
        setLoading(true);
        const [userDocs, chainData] = await Promise.all([
            getDocumentsForUser(user),
            getBlockchainEntries()
        ]);
        setDocuments(userDocs);
        setBlockchain(chainData);
        setLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    
    const handleVerify = async (docId: string) => {
        if (!user || user.role !== UserRole.Admin) return;
        setMessage('Verifying...');
        const success = await verifyDocumentById(docId, user);
        if (success) {
            setMessage('Document verified successfully!');
            const doc = documents.find(d => d.id === docId);
            if (doc) {
                addTransaction(`Verified: ${doc.name}`);
            }
            // Refresh data to show new status
            fetchDocuments();
        } else {
            setMessage('Verification failed. Document or hash not found on ledger.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const documentsWithStatus: DocumentWithStatus[] = documents.map(doc => {
        const entry = blockchain.find(b => b.documentHash === doc.hash);
        return { ...doc, status: entry?.verificationStatus || 'Pending' };
    });

    const title = user?.role === UserRole.Patient ? "My Medical Documents" : "All Documents";

    if (loading) {
        return <div className="text-center p-8">Loading documents...</div>;
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">{title}</h3>
            {message && <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">{message}</div>}
            {documents.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4 8-4M4 12l8 4 8-4" />
                    </svg>
                    <p className="mt-4 text-[#4B5563]">No documents found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documentsWithStatus.map(doc => (
                        <DocumentCard 
                            key={doc.id} 
                            doc={doc} 
                            onVerify={handleVerify}
                            isAdmin={user?.role === UserRole.Admin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewDocuments;