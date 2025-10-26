import React from 'react';

const AdminDashboard: React.FC = () => {
    // In a real app, these would come from an API
    const stats = [
        { name: 'Total Users', value: '3', icon: 'users', color: 'text-blue-500' },
        { name: 'Documents Stored', value: '15', icon: 'docs', color: 'text-green-500' },
        { name: 'Pending Verifications', value: '2', icon: 'pending', color: 'text-yellow-500' },
        { name: 'Audit Log Events', value: '42', icon: 'audit', color: 'text-red-500' },
    ];

    const Icon = ({ name, color }: { name: string, color: string }) => {
        const iconClass = `h-8 w-8 ${color}`;
        switch(name) {
            case 'users': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
            case 'docs': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
            case 'pending': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'audit': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
            default: return null;
        }
    }

    return (
        <div>
            <h3 className="text-3xl font-bold text-[#111827]">Admin Dashboard</h3>
            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map(stat => (
                        <div key={stat.name} className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between transition-all hover:shadow-xl hover:-translate-y-1">
                            <div>
                                <p className="text-sm font-medium text-[#4B5563] uppercase tracking-wider">{stat.name}</p>
                                <p className="text-4xl font-bold text-[#111827] mt-2">{stat.value}</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Icon name={stat.icon} color={stat.color} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-[#111827]">System Overview</h4>
                <p className="mt-2 text-[#4B5563] leading-relaxed">
                    Welcome to the Docu-Rex administration panel. From here you can manage the system, view all stored documents, and track user activity through the audit log. The blockchain ledger ensures the integrity of all documents. Please review documents pending verification to maintain compliance.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
