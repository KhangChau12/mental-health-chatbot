// components/Header.jsx (phiên bản cải tiến)
'use client';

import React from 'react';
import { HeartPulse, Menu, Info, Shield, HelpCircle } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-purple-100 p-1.5 rounded-lg mr-2">
              <HeartPulse className="h-7 w-7 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Trợ lý Sức khỏe Tâm thần
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#about"
              className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50 flex items-center"
            >
              <Info size={16} className="mr-1" />
              Giới thiệu
            </a>
            <a
              href="#resources"
              className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50 flex items-center"
            >
              <Shield size={16} className="mr-1" />
              Tài nguyên
            </a>
            <a
              href="#privacy"
              className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50 flex items-center"
            >
              <HelpCircle size={16} className="mr-1" />
              Hỗ trợ
            </a>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;