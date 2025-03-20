import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata = {
  title: 'Trợ lý Sức khỏe Tâm thần',
  description: 'Chatbot sàng lọc sức khỏe tâm thần sử dụng các bộ câu hỏi chuẩn',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}