# Sử dụng Node.js phiên bản LTS
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép tất cả file từ dự án vào container
COPY . .

# Cài đặt các dependencies từ package.json
# Sau đó cài đặt thư viện Together AI từ npm với phiên bản cụ thể
RUN npm install --production --no-package-lock && \
    npm install @togetherapi/together@0.0.7

# Sửa đổi code cho phù hợp với thư viện @togetherapi/together
RUN find . -type f -name "route.js" -exec sed -i 's/import { Together } from "together";/import { Together } from "@togetherapi\/together";/g' {} \;

# Thiết lập biến môi trường cho production
ENV NODE_ENV=production
ENV PORT=3000

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE $PORT

# Khởi động ứng dụng
CMD ["npm", "start"]