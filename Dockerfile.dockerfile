# Sử dụng Node.js phiên bản LTS (Long Term Support)
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép tất cả file từ dự án vào container
COPY . .

# Tạo một package.json tạm thời với các dependencies chính xác
RUN echo '{\
  "name": "mental-health-chatbot",\
  "version": "1.0.0",\
  "description": "Chatbot sàng lọc sức khỏe tâm thần",\
  "dependencies": {\
    "ai": "^2.2.35",\
    "lucide-react": "^0.263.1",\
    "next": "14.0.4",\
    "react": "^18",\
    "react-dom": "^18",\
    "react-markdown": "^8.0.7",\
    "together-ai": "^0.13.0"\
  },\
  "scripts": {\
    "dev": "next dev",\
    "build": "next build",\
    "start": "next start",\
    "lint": "next lint"\
  }\
}' > new-package.json && \
    mv new-package.json package.json

# Cài đặt dependencies từ package.json mới tạo
RUN npm install

# Thiết lập biến môi trường cho production
ENV NODE_ENV=production
ENV PORT=3000

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]