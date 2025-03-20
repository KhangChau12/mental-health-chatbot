'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Phần chat */}
        <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col h-[calc(100vh-64px-56px)]">
          <Chat />
        </div>
        
        {/* Thông tin bên phải (chỉ hiển thị trên màn hình lớn) */}
        <div className="hidden md:block md:w-2/5 lg:w-1/3 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Về Trợ lý Sức khỏe Tâm thần</h2>
            <p className="text-gray-700 mb-3">
              Trợ lý Sức khỏe Tâm thần là một chatbot giúp sàng lọc sơ bộ các vấn đề sức khỏe tâm thần 
              phổ biến như trầm cảm, lo âu và căng thẳng dựa trên các bộ câu hỏi chuẩn được sử dụng rộng rãi.
            </p>
            <p className="text-gray-700 mb-3">
              Công cụ này sử dụng các bộ câu hỏi tiêu chuẩn như PHQ-9 cho trầm cảm, GAD-7 cho lo âu, 
              và DASS-21 cho căng thẳng để cung cấp một đánh giá sơ bộ về sức khỏe tâm thần của bạn.
            </p>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Đây không phải là công cụ chẩn đoán. Kết quả chỉ mang tính chất 
                tham khảo và không thay thế cho việc tham vấn với chuyên gia sức khỏe tâm thần.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Các Nguồn Trợ giúp</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-900 font-medium">Đường dây nóng</h3>
                <p className="text-gray-700">Đường dây hỗ trợ tâm lý: 1800-8440</p>
              </div>
              
              <div>
                <h3 className="text-gray-900 font-medium">Cấp cứu</h3>
                <p className="text-gray-700">Trung tâm cấp cứu: 115</p>
              </div>
              
              <div>
                <h3 className="text-gray-900 font-medium">Trung tâm tư vấn</h3>
                <p className="text-gray-700">
                  Trung tâm sức khỏe tâm thần Bệnh viện Bạch Mai: 024.3869.3731
                </p>
                <p className="text-gray-700">
                  Bệnh viện Tâm thần Trung ương 1: 024.3825.3028
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}