FROM node:current-alpine as transpilation
WORKDIR /usr/transpile
COPY package*.json ./
COPY tsconfig.json .
RUN npm install
COPY ./src ./src
RUN npx tsc

FROM node:current-alpine as frontend_compile
COPY ./frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run-script build

FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
# Copy transpiled source
COPY --from=transpilation /usr/transpile/build ./code
# Prevent redownloading of phantomjs by copying from the transpilation image
COPY --from=transpilation /usr/transpile/node_modules/phantomjs-prebuilt ./node_modules/phantomjs-prebuilt
# Install dependencies
RUN npm install --production
# Add static resources
COPY --from=frontend_compile /frontend/build ./res
# Set up production envrionment variables
ENV TYPE=production
ENV PORT=80
EXPOSE 80
# Start the run-prod script for the project
CMD [ "npm", "run-script", "run-prod" ]