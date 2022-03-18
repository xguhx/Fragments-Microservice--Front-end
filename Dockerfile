# Stage 2: nginx web server to host the built site
FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy
COPY ./dist/ /usr/share/nginx/html/

EXPOSE 80