# Stage 2: nginx web server to host the built site

FROM node:16.13.2-apline3.14@sha256:d5ff6716e21e03983f8522b6e84f15f50a56e183085553e96d2801fc45dc3c74 AS dependencies

# The Label is used to write metadata
# So in this case it will cointain information about who wrote this 
LABEL maintainer="Gustavo Tavares <gmartinez-de-oliveir@myseneca.ca>"
LABEL description="Fragments UI node.js microservice"


# Env  is used to define environment variables
# We default to use port 8080 in our service
ENV PORT=1234

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# WORKDIR set the working directory
# Use /app as our working directory
WORKDIR /app

# As David wrote:
# We use the COPY instruction to copy files and folders into our image. 
# In its most basic form, we use COPY <src> <dest>. This copies from the build context (i.e. our <src>) to a path inside the image (i.e., our <dest>).

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy our HTPASSWD file
COPY ./.env /app/

# RUN insrtuction will execute a command and cache this layer.
# Install node dependencies defined in package-lock.json
# npm ci install the exact versions from package-lock
RUN npm ci


RUN npx parcel build src/index.html

FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy
COPY --from=dependencies /app/dist /usr/share/nginx/html/

EXPOSE 80