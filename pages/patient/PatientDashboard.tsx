import React from 'react';
import { Link } from 'react-router-dom';

const ActionCard: React.FC<{ to: string, title: string, description: string, color: string }> = ({ to, title, description, color }) => (
    <Link to={to} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block">
        <h4 className={`text-xl font-bold ${color}`}>{title}</h4>
        <p className="mt-2 text-[#4B5563]">{description}</p>
        <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-800">
            Go to section &rarr;
        </div>
    </Link>
);

const PatientDashboard: React.FC = () => {
    return (
        <div>
            <h3 className="text-3xl font-bold text-[#111827]">My Health Dashboard</h3>
            <div className="mt-8 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] p-8 rounded-2xl shadow-lg text-white">
                <h4 className="text-2xl font-bold">Welcome to Your Secure Health Portal</h4>
                <p className="mt-2 text-blue-100 max-w-3xl leading-relaxed">
                    Here, you can view your medical documents, verify their authenticity on our secure simulated blockchain ledger, and use our AI assistant to better understand your health information. Your data is secure and under your control.
                </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <ActionCard 
                    to="/documents" 
                    title="View My Documents" 
                    description="Access your complete medical history securely."
                    color="text-[#2563EB]"
                />
                <ActionCard 
                    to="/verify" 
                    title="Verify a Document" 
                    description="Ensure the integrity of a document by checking it against the blockchain ledger."
                    color="text-[#10B981]"
                />
                <ActionCard 
                    to="/ai-assistant" 
                    title="Ask Docu-Rex AI" 
                    description="Get plain-language explanations of your medical reports."
                    color="text-indigo-600"
                />
            </div>
        </div>
    );
};

export default PatientDashboard;
