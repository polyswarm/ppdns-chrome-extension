FROM 005789955001.dkr.ecr.us-east-2.amazonaws.com/public/docker/library/node:18.18-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# REACT_* variables need to be available at build time
ENV REACT_APP_URL=http://portal-frontend-e2e:8080 \
  REACT_APP_API_URL=http://portal-backend-e2e:3000/api \
  REACT_APP_AUTH0_URL=https://auth0-e2e:8081 \
  REACT_APP_AUTH0_CLIENT_ID=ZefKD4c7JGZaxAHMFKjqgjaUG9tI3Glv \
  REACT_APP_AUTH0_AUDIENCE=https://portal-api \
  REACT_APP_GA_ID=UA-142135442-2 \
  CHROMIUM_BIN=/usr/bin/chromium-browser

RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.17/main" >> /etc/apk/repositories \
  && apk upgrade -U -a \
  && apk add --no-cache chromium ffmpeg curl \
  && apk add --no-cache build-base bash \
  && apk add --no-cache python3 py3-pip

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

RUN mkdir -p test-results

# Build
COPY tsconfig.json ./
COPY ./src ./src

# Copy files
COPY . .

# Run
EXPOSE 8080

RUN make browser-extensions

CMD ["./docker/run.sh"]
