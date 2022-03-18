# Stage 2: nginx web server to host the built site
FROM nginx:latest
COPY ./dist/ /usr/share/nginx/html/

EXPOSE 80