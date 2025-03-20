# Sử dụng Node.js phiên bản LTS
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json
COPY package.json ./

# Cài đặt thư viện Together SDK chính thức thay vì thư viện không tồn tại
RUN npm install @together-ai/sdk --save

# Sao chép tất cả file trong dự án
COPY . .

# Thêm file adapter để map thư viện together cũ sang thư viện mới
RUN echo 'const { TogetherAI } = require("@together-ai/sdk");\n\nclass Together {\n  constructor(apiKey) {\n    this.client = new TogetherAI({ apiKey });\n    this.chat = {\n      completions: {\n        create: async (options) => {\n          try {\n            const response = await this.client.chat.completions.create(options);\n            return response;\n          } catch (error) {\n            console.error("Together API error:", error);\n            throw error;\n          }\n        }\n      }\n    };\n  }\n}\n\nmodule.exports = { Together };' > together-adapter.js

# Sửa file route.js để sử dụng adapter
RUN sed -i "s/import { Together } from 'together';/const { Together } = require('..\/..\/..\/together-adapter.js');/" app/api/ai/route.js

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Xây dựng ứng dụng
RUN npm run build

# Expose cổng
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]