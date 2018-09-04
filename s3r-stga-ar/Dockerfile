### Build Stage 1

FROM node:9-wheezy as builder

COPY . /src

WORKDIR /src

RUN npm install

RUN $(npm bin)/ng build --prod --build-optimizer

### Build Stage 2

FROM nginx:1.13.9-alpine

COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /src/dist/s3r-stga-ar /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
