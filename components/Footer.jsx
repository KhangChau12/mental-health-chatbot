'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-2 flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <strong>Miễn trừ trách nhiệm:</strong> Đây chỉ là công cụ sàng lọc sơ bộ và không phải 
            công cụ chẩn đoán chính thức. Thông tin cung cấp chỉ có tính chất tham khảo. Nếu bạn 
            đang gặp khó khăn về sức khỏe tâm thần, vui lòng tham khảo ý kiến của chuyên gia y tế 
            có trình độ.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-2 md:mb-0">
            <p>© 2025 Trợ lý Sức khỏe Tâm thần. Mọi quyền được bảo lưu.</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#terms" className="hover:text-gray-900">Điều khoản sử dụng</a>
            <a href="#privacy" className="hover:text-gray-900">Chính sách bảo mật</a>
            <a href="#contact" className="hover:text-gray-900">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;