# Sử dụng Node.js phiên bản LTS (Long Term Support)
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json
COPY package.json ./

# Cài đặt các dependencies
# Sử dụng --only=production để không cài đặt devDependencies (tiết kiệm không gian)
RUN npm install --only=production

# Sao chép tất cả các file trong dự án
COPY . .

# Thiết lập biến môi trường cho production
ENV NODE_ENV=production

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]