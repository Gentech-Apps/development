FROM node:18 as builder

ADD package.json /usr/src/app/
ADD yarn.lock /usr/src/app/
WORKDIR /usr/src/app
RUN yarn install 
COPY . .
RUN yarn build

FROM nginx:1.24.0
COPY --from=builder /usr/src/app/build/ /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]