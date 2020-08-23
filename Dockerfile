#stage 0 transpilation
FROM node:current-alpine
WORKDIR /usr/transpile
COPY package*.json ./
COPY tsconfig.json .
RUN npm install
COPY ./src ./src
RUN npx tsc

#stage 1 js image
FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
# Copy transpiled source
COPY --from=0 /usr/transpile/build ./code
# Prevent redownloading of phantomjs by copying from the transpilation image
COPY --from=0 ./node_modules/phantomjs-prebuilt ./node_modules/phantomjs-prebuilt
# Install dependencies
RUN npm install --production
# Add static resources
COPY ./res ./res
# Set up production envrionment variables
ENV TYPE=production
ENV PORT=80
EXPOSE 80
# Start the run-prod script for the project
CMD [ "npm", "run-script", "run-prod" ]