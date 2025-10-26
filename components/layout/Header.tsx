import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[#D1D5DB] sticky top-0 z-10">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onToggleSidebar} className="text-gray-500 focus:outline-none lg:hidden mr-4">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              className="w-full max-w-xs pl-10 pr-4 py-2 border border-transparent rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="relative ml-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold">
                    {user?.name.charAt(0)}
                </div>
                <div className="ml-3 hidden md:block text-left">
                    <p className="text-sm font-medium text-[#111827]">{user?.name}</p>
                    <p className="text-xs text-[#4B5563]">{user?.role}</p>
                </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-20">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-gray-100 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
