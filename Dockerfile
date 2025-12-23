# 使用 Puppeteer 官方镜像，内置了 Chrome 环境
FROM ghcr.io/puppeteer/puppeteer:latest

# 1. 切换到 root 用户安装环境
USER root


# 2. 拷贝 Chromium（二进制）
COPY chrome/chrome-linux /opt/chrome/chrome-linux

# 3. 给执行权限（双保险）
RUN chmod +x /opt/chrome/chrome-linux/chrome

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 2. 先拷贝依赖文件（利用缓存）
# 确保你的服务器上有 pnpm-lock.yaml，如果没有，就把这行删掉
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
# --frozen-lockfile 确保环境一致性
RUN pnpm install

# 3. 拷贝所有源代码
# 这步会把你的 app/ 目录、public/ 目录等拷贝到 /app
COPY . .

# 4. 关键：确保权限正确
# Puppeteer 镜像默认有个 pptruser 用户，我们需要让它能读写代码目录
# RUN chown -R pptruser:pptruser /app


# 6. 切换回低权限用户运行（安全推荐）
USER pptruser

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["pnpm", "start"]