# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node
WORKDIR /app
RUN mkdir -p  /app
COPY package.json /app
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
#ENV NPM_CONFIG_PREFIX=/app/node_modules
#RUN npm config set prefix "/app/node_modules"
# --prefix=/app/node_modules
WORKDIR /app/frontend
EXPOSE 3000