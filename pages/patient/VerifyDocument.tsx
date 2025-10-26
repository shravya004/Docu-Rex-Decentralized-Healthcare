import React, { useState } from 'react';
import { verifyDocumentOnChain } from '../../services/mockApi';
import { BlockchainEntry } from '../../types';

const VerifyDocument: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{
        status: 'idle' | 'success' | 'fail';
        entry: BlockchainEntry | null;
    }>({ status: 'idle', entry: null });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setVerificationResult({ status: 'idle', entry: null });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsVerifying(true);
        const { success, entry } = await verifyDocumentOnChain(file);
        setVerificationResult({ status: success ? 'success' : 'fail', entry });
        setIsVerifying(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#111827] mb-4">Verify Document Integrity</h3>
                <p className="text-[#4B5563] mb-6">Upload a document from your computer to verify its authenticity against the blockchain ledger. This process generates a hash of the file and checks if a matching record exists.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="file-verify" className="block text-sm font-medium text-[#4B5563]">Document to Verify</label>
                        <input
                            id="file-verify"
                            type="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E0F2FE] file:text-[#2563EB] hover:file:bg-[#BFDBFE]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isVerifying || !file}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#10B981] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Document'}
                    </button>
                </form>
            </div>

            {verificationResult.status !== 'idle' && (
                <div className={`mt-6 p-6 rounded-2xl shadow-lg ${verificationResult.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {verificationResult.status === 'success' && verificationResult.entry && (
                        <div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#10B981] mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                <h4 className="text-xl font-bold text-green-800">Verification Successful</h4>
                            </div>
                            <p className="mt-2 text-green-700">A matching record was found on the blockchain ledger. The document is authentic.</p>
                            <div className="mt-4 bg-white p-4 rounded-xl text-sm text-[#4B5563] space-y-2 border border-green-200">
                                <p><strong>Document Hash:</strong> <span className="font-mono break-all text-xs">{verificationResult.entry.documentHash}</span></p>
                                <p><strong>Uploaded By:</strong> {verificationResult.entry.uploader}</p>
                                <p><strong>Timestamp:</strong> {new Date(verificationResult.entry.timestamp).toLocaleString()}</p>
                                <p><strong>Admin Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${verificationResult.entry.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{verificationResult.entry.verificationStatus}</span></p>
                            </div>
                        </div>
                    )}
                    {verificationResult.status === 'fail' && (
                        <div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EF4444] mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                <h4 className="text-xl font-bold text-red-800">Verification Failed</h4>
                            </div>
                            <p className="mt-2 text-red-700">No matching record was found on the ledger. The document may have been altered or is not registered in the system.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifyDocument;
