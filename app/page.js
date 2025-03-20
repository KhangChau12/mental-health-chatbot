// app/page.js (phiên bản cải tiến)
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat';
import { HeartPulse, Shield, BookOpen, Users, Menu, X } from 'lucide-react';

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50 to-white">
      <Header toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Phần chat */}
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col h-[calc(100vh-64px-56px)]">
          <Chat />
        </div>
        
        {/* Overlay cho mobile khi sidebar mở */}
        {showSidebar && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Thông tin bên phải */}
        <div className={`
          fixed md:static top-0 right-0 h-full md:h-auto z-30
          w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          bg-white md:bg-transparent md:border-l border-gray-200 
          overflow-y-auto
        `}>
          {/* Nút đóng sidebar trên mobile */}
          <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Thông tin hỗ trợ</h2>
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Giới thiệu */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <HeartPulse className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Về Trợ lý Sức khỏe Tâm thần</h2>
                  <p className="text-gray-700 mb-3">
                    Trợ lý Sức khỏe Tâm thần là một chatbot giúp sàng lọc sơ bộ các vấn đề sức khỏe tâm thần 
                    phổ biến như trầm cảm, lo âu và căng thẳng dựa trên các bộ câu hỏi chuẩn.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Đây không phải là công cụ chẩn đoán. Kết quả chỉ mang tính chất 
                    tham khảo và không thay thế cho việc tham vấn với chuyên gia.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Phương pháp đánh giá */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Phương pháp đánh giá</h2>
                  <p className="text-gray-700 mb-2">
                    Công cụ này sử dụng các bộ câu hỏi tiêu chuẩn được công nhận toàn cầu:
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 ml-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-800 font-semibold text-xs mr-2 mt-0.5">PHQ-9</span>
                  <span className="text-gray-700">Đánh giá mức độ trầm cảm</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs mr-2 mt-0.5">GAD-7</span>
                  <span className="text-gray-700">Đánh giá mức độ lo âu</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 font-semibold text-xs mr-2 mt-0.5">DASS-21</span>
                  <span className="text-gray-700">Đánh giá mức độ căng thẳng</span>
                </li>
              </ul>
            </div>
            
            {/* Nguồn trợ giúp */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="p-2 bg-rose-100 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Các Nguồn Trợ giúp</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-gray-900 font-medium">Đường dây nóng</h3>
                  <p className="text-gray-700 mt-1">Đường dây hỗ trợ tâm lý: <span className="font-medium text-purple-600">1800-8440</span></p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-gray-900 font-medium">Cấp cứu</h3>
                  <p className="text-gray-700 mt-1">Trung tâm cấp cứu: <span className="font-medium text-purple-600">115</span></p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-gray-900 font-medium">Trung tâm tư vấn</h3>
                  <p className="text-gray-700 mt-1">
                    Trung tâm sức khỏe tâm thần Bệnh viện Bạch Mai: <span className="font-medium text-purple-600">024.3869.3731</span>
                  </p>
                  <p className="text-gray-700 mt-1">
                    Bệnh viện Tâm thần Trung ương 1: <span className="font-medium text-purple-600">024.3825.3028</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}