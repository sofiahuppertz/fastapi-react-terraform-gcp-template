import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../menu/Sidebar.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { background, text } from '@/theme/irisGarden';

const Layout: React.FC = () => {
  return (
    <div 
      className="min-h-screen font-satoshi"
      style={{
        background: 'white'
      }}
    >
      <Sidebar />
      
      <div className="ml-24 overflow-y-auto min-h-screen">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 py-1 bg-white/80 backdrop-blur-sm border-t border-gray-100" style={{
        background: background.grey + '80'
      }}>
          <div className="max-w-[95%] 2xl:max-w-[90%] mx-auto px-6">
            <div className="flex items-center justify-center text-gray-400 text-xs" style={{
              color: text.subtle
            }}>
              <FontAwesomeIcon icon={faCopyright} className="mr-2" />
              <span>{new Date().getFullYear()} Parfums+AI. All rights reserved.</span>
            </div>
          </div>
      </footer>
    </div>
  );
};

export default Layout;