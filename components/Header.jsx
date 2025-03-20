'use client';

import React from 'react';
import { HeartPulse } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <HeartPulse className="h-8 w-8 text-purple-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Trợ lý Sức khỏe Tâm thần</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              Giới thiệu
            </a>
            <a
              href="#resources"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              Tài nguyên
            </a>
            <a
              href="#privacy"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              Quyền riêng tư
            </a>
          </div>
          
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;