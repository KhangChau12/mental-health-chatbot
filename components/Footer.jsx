// components/Footer.jsx (phiên bản cải tiến)
'use client';

import React from 'react';
import { AlertCircle, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3 flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Miễn trừ trách nhiệm:</strong> Đây chỉ là công cụ sàng lọc sơ bộ và không phải 
            công cụ chẩn đoán chính thức. Thông tin cung cấp chỉ có tính chất tham khảo. Nếu bạn 
            đang gặp khó khăn về sức khỏe tâm thần, vui lòng tham khảo ý kiến của chuyên gia y tế.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-2 md:mb-0 flex items-center">
            <p className="text-gray-500">© 2025 Trợ lý Sức khỏe Tâm thần. Mọi quyền được bảo lưu.</p>
            <span className="ml-2 flex items-center text-xs text-gray-400">
              Phát triển với <Heart className="h-3 w-3 mx-1 text-red-500" fill="currentColor" /> bởi cộng đồng
            </span>
          </div>
          
          <div className="flex space-x-4">
            <a href="#terms" className="text-gray-500 hover:text-purple-600">Điều khoản sử dụng</a>
            <a href="#privacy" className="text-gray-500 hover:text-purple-600">Chính sách bảo mật</a>
            <a href="#contact" className="text-gray-500 hover:text-purple-600">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;