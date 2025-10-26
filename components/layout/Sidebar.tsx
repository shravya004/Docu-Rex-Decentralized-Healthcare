import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

// FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isOpen: boolean }> = ({ to, icon, label, isOpen }) => {
    const baseClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-[#1D4ED8] rounded-xl transition-all duration-300";
    const activeClasses = "bg-[#1E40AF]";

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}
        >
            {icon}
            <span className={`ml-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>{label}</span>
        </NavLink>
    );
};


const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { user } = useAuth();

    const icons = {
        dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        documents: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        audit: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.162-4.162m6.276 4.162L13 16m-1.414-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>,
        upload: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
        ai: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        verify: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    }

    const adminLinks = (
        <>
            <NavItem to="/admin-dashboard" icon={icons.dashboard} label="Dashboard" isOpen={isOpen} />
            <NavItem to="/documents" icon={icons.documents} label="All Documents" isOpen={isOpen} />
            <NavItem to="/audit-log" icon={icons.audit} label="Audit Log" isOpen={isOpen} />
        </>
    );

    const doctorLinks = (
        <>
            <NavItem to="/doctor-dashboard" icon={icons.dashboard} label="Dashboard" isOpen={isOpen} />
            <NavItem to="/documents" icon={icons.documents} label="Patient Records" isOpen={isOpen} />
            <NavItem to="/upload" icon={icons.upload} label="Upload Report" isOpen={isOpen} />
            <NavItem to="/ai-assistant" icon={icons.ai} label="AI Assistant" isOpen={isOpen} />
        </>
    );

    const patientLinks = (
        <>
            <NavItem to="/patient-dashboard" icon={icons.dashboard} label="Dashboard" isOpen={isOpen} />
            <NavItem to="/documents" icon={icons.documents} label="My Documents" isOpen={isOpen} />
            <NavItem to="/verify" icon={icons.verify} label="Verify Document" isOpen={isOpen} />
            <NavItem to="/ai-assistant" icon={icons.ai} label="Ask Docu-Rex AI" isOpen={isOpen} />
        </>
    );

    return (
        <div className={`bg-[#2563EB] text-white flex-col p-4 transition-all duration-300 ease-in-out hidden lg:flex ${isOpen ? 'w-64' : 'w-24'}`}>
            <div className={`font-bold mb-10 px-4 transition-all duration-300 ${isOpen ? 'text-2xl' : 'text-xl text-center'}`}>
                {isOpen ? "Docu-Rex" : "D-R"}
            </div>
            <nav className="flex flex-col space-y-2">
                {user?.role === UserRole.Admin && adminLinks}
                {user?.role === UserRole.Doctor && doctorLinks}
                {user?.role === UserRole.Patient && patientLinks}
            </nav>
        </div>
    );
};

export default Sidebar;
