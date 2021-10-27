# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node
WORKDIR /app/frontend
RUN mkdir -p  /app/node_modules
COPY package.json /app/node_modules
RUN npm install --prefix=/app/node_modules
ENV NPM_CONFIG_PREFIX=/app/node_modules
RUN npm config set prefix "/app/node_modules"
EXPOSE 3000