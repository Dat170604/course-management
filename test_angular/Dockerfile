
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Tìm thư mục chứa index.html trong output Angular
RUN INDEX_FILE="$(find dist -name index.html -type f -print -quit)" \
    && test -n "$INDEX_FILE" \
    && mkdir -p /frontend-output \
    && cp -a "$(dirname "$INDEX_FILE")"/. /frontend-output/


FROM nginx:alpine

COPY --from=build /frontend-output/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

