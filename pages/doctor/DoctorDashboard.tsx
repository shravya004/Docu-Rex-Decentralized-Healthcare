
import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

const ActionCard: React.FC<{ to: string, title: string, description: string, color: string }> = ({ to, title, description, color }) => (
    <Link to={to} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block">
        <h4 className={`text-xl font-bold ${color}`}>{title}</h4>
        <p className="mt-2 text-[#4B5563]">{description}</p>
        <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-800">
            Go to section &rarr;
        </div>
    </Link>
);

const WalletConnectCard: React.FC = () => {
    const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col justify-between">
             <div>
                <h4 className={`text-xl font-bold text-gray-700`}>{isConnected ? 'Wallet Connected' : 'Connect Wallet'}</h4>
                <p className="mt-2 text-[#4B5563] h-10">{isConnected ? `Address: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` : 'Connect your Thirdweb wallet for blockchain interactions.'}</p>
             </div>
             <button
                onClick={isConnected ? disconnectWallet : connectWallet}
                className={`mt-4 w-full text-sm font-medium py-2 px-4 rounded-lg transition-colors ${isConnected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-800 hover:bg-black text-white'}`}
             >
                {isConnected ? 'Disconnect Wallet' : 'Connect Thirdweb Wallet'}
             </button>
        </div>
    )
}

const DoctorDashboard: React.FC = () => {
    return (
        <div>
            <h3 className="text-3xl font-bold text-[#111827]">Doctor's Dashboard</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard 
                    to="/documents" 
                    title="View Patient Records" 
                    description="Access and review all patient documents and medical history."
                    color="text-[#2563EB]"
                />
                <ActionCard 
                    to="/upload" 
                    title="Upload New Report" 
                    description="Add a new medical report to a patient's file. The document will be hashed and added to the blockchain."
                    color="text-[#10B981]"
                />
                <ActionCard 
                    to="/ai-assistant" 
                    title="AI Assistant" 
                    description="Summarize complex reports or get insights from medical data using our Gemini-powered AI."
                    color="text-indigo-600"
                />
                 <ActionCard 
                    to="/create-patient"
                    title="Create New Patient"
                    description="Onboard a new patient to the Docu-Rex system and create their secure digital record."
                    color="text-orange-500"
                />
                <WalletConnectCard />
            </div>
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-[#111827]">Recent Activity</h4>
                <ul className="mt-4 space-y-3 text-[#4B5563] list-disc list-inside">
                   <li>Uploaded "Blood Test Results" for Bob Patient.</li>
                   <li>Viewed "X-Ray Scan" for Bob Patient.</li>
                   <li>Consulted AI Assistant on recent lab findings.</li>
                </ul>
            </div>
        </div>
    );
};

export default DoctorDashboard;