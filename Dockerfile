#
# Docker NodeJS Typescript Starter
# Example Dockerfile
#
FROM node:20.6.0-alpine3.17 AS build

## Install build toolchain, install node deps and compile native add-ons
## https://stackoverflow.com/questions/70852805/bcrypt-error-in-docker-container-error-path-to-local-module-node-modules-bcry
RUN apk add --no-cache make gcc g++ && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++

# Create App dir
RUN mkdir -p /app

# Set working directory to App dir
WORKDIR /app

# Copy project files
COPY . .

# Create environment file
RUN cp .env.example .env

# Install dependencies
RUN npm install

FROM node:20.6.0-alpine3.17 as app

## Copy built node modules and binaries without including the toolchain
COPY --from=build /app .

WORKDIR /app

CMD [ "/app/scripts/run.sh" ]
