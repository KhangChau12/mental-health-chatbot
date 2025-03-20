# Sử dụng Node.js phiên bản LTS (Long Term Support)
FROM node:18-alpine

# Cài đặt các công cụ cần thiết
RUN apk add --no-cache sed

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

# Sửa code nguồn để sử dụng thư viện together-ai
RUN if [ -f app/api/ai/route.js ]; then \
      sed -i 's/import { Together } from .together./import Together from "together-ai";/g' app/api/ai/route.js; \
    fi

# Cài đặt dependencies từ package.json mới tạo
RUN npm install

# Tạo một module giả cho thư viện together cũ nếu cần
RUN mkdir -p node_modules/together && \
    echo 'const Together = require("together-ai");\n\
module.exports = { Together };' > node_modules/together/index.js

# Tạo file .env.local giả với API key tạm thời để build
RUN echo 'TOGETHER_API_KEY=dummy_key_for_build_only' > .env.local

# Thiết lập biến môi trường cho production và giả API key cho quá trình build
ENV NODE_ENV=production
ENV PORT=3000
ENV TOGETHER_API_KEY=dummy_key_for_build_only

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Xóa API key giả để đảm bảo không bị sử dụng trong runtime
ENV TOGETHER_API_KEY=""

# Khởi động ứng dụng
CMD ["npm", "start"]