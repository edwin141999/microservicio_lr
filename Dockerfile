FROM node:16-alpine
WORKDIR /app

RUN apk update
RUN apk add git bash
RUN git clone http://github.com/edwin141999/microservicio_lr.git

COPY package*.json microservicio_lr/
COPY prisma microservicio_lr/prisma
COPY .env microservicio_lr/

RUN cd microservicio_lr && npm install && npx prisma generate

EXPOSE 3000

RUN apk add psmisc

CMD cd microservicio_lr && npm start