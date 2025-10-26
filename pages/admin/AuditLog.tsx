import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/mockApi';
import { AuditLog as AuditLogType } from '../../types';

const ActionIcon = ({ action }: { action: string }) => {
    const baseClass = "h-6 w-6 text-white";
    switch (action) {
        case 'Login':
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;
        case 'Document Upload':
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
        case 'Document Verification':
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
};

const getActionColor = (action: string) => {
    switch (action) {
        case 'Login': return 'bg-blue-500';
        case 'Document Upload': return 'bg-green-500';
        case 'Document Verification': return 'bg-indigo-500';
        default: return 'bg-gray-500';
    }
}

const AuditLog: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(data);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading audit logs...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-[#111827] mb-6">System Audit Log</h3>
            <div className="relative pl-8">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#D1D5DB]"></div>
                {logs.map((log) => (
                    <div key={log.id} className="mb-8 relative">
                         <div className={`absolute -left-3.5 top-1.5 w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                            <ActionIcon action={log.action} />
                        </div>
                        <div className="ml-10">
                            <div className="flex items-center space-x-4">
                               <p className="font-bold text-[#111827]">{log.action}</p>
                               <span className="text-xs text-white font-semibold px-2 py-1 rounded-full bg-gray-400">{log.userRole}</span>
                               <p className="text-sm text-[#4B5563]">{log.userName}</p>
                            </div>
                            <p className="text-sm text-[#4B5563] mt-1">{log.details}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditLog;
