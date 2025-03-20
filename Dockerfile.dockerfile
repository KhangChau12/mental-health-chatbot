# Sử dụng Node.js phiên bản LTS (Long Term Support)
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép tất cả file từ dự án vào container
COPY . .

# Cài đặt các dependency
RUN npm install

# Cài đặt phiên bản mới nhất của Together API
RUN npm install --save together@latest

# Thiết lập biến môi trường cho production
ENV NODE_ENV=production
ENV PORT=3000
ENV TOGETHER_MODEL_NAME=meta-llama/Llama-3.3-70B-Instruct-Turbo-Free

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE $PORT

# Khởi động ứng dụng
CMD ["npm", "start"]