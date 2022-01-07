# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node as buildapp
WORKDIR /app
RUN mkdir -p  /app
COPY package.json /app
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app/frontend
COPY ./ .
RUN next build && next export


FROM nginx:alpine
COPY .nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=buildapp /app/frontend/out /usr/share/nginx/html
RUN mkdir /usr/share/nginx/media
CMD ls /usr/share/nginx && nginx -g "daemon off;"