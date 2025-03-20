# Sử dụng Node.js phiên bản LTS (Long Term Support)
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép tất cả file từ dự án vào container
COPY . .

# Cài đặt các dependency chính xác theo tài liệu dự án
RUN npm install next@14.0.4 \
    react@18 \
    react-dom@18 \
    ai@2.2.35 \
    lucide-react@0.263.1 \
    react-markdown@8.0.7 \
    @ai-sdk/together

# Thiết lập biến môi trường cho production
ENV NODE_ENV=production
ENV PORT=3000

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]