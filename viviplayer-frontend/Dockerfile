# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node as buildapp
WORKDIR /app
RUN mkdir -p  /app
COPY package.json /app
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app/frontend
COPY ./ .
RUN rm -r .next
RUN next build

FROM node
WORKDIR /app
RUN mkdir -p  /app
COPY package.json /app
RUN npm install
COPY --from=buildapp /app/frontend/.next ./.next
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app/frontend
EXPOSE 3000
CMD next start