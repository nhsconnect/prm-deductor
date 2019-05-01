FROM node:8.16.0-stretch-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y unzip

EXPOSE 4444

ADD deploy.zip .

RUN unzip deploy.zip

ENTRYPOINT [ "node", "main.js" ]