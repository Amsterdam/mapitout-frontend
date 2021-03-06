# build image
FROM node:11.15 as build-deps
MAINTAINER datapunt.ois@amsterdam.nl

RUN npm i -g yarn
COPY . /build/
COPY /deploy /deploy
WORKDIR /build
RUN yarn && yarn run build

# webserver image.
FROM nginx:latest
MAINTAINER datapunt.ois@amsterdam.nl

ENV BASE_URL=https://api.data.amsterdam.nl/
COPY cmd.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/cmd.sh

COPY --from=build-deps /build/dist/ /usr/share/nginx/html/
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
CMD cmd.sh
