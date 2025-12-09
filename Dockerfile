# 使用官方 Node 镜像
FROM node:22-alpine AS builder

WORKDIR /app

# 只拷贝依赖文件
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# 安装依赖
RUN pnpm install

# 拷贝所有项目文件
COPY . .

# 构建 Next.js
RUN pnpm run build

# 生产环境镜像
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]