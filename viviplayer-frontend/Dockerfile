FROM node
WORKDIR /app
RUN mkdir -p  /app
COPY package.json /app
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app/frontend
EXPOSE 3000
CMD next dev