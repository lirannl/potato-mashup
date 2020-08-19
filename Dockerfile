FROM node
# Add node package files
ADD package*.json /app/
# Add the transpiled code into the container
ADD ./build /app/code
# Add static resources
ADD ./res /app/res
# Switch to the app's folder
WORKDIR /app
# Install dependencies
RUN npm install
# Set up production envrionment variables
ENV TYPE=production
ENV PORT=80
# Start the run-prod script for the project
CMD [ "npm", "run-script", "run-prod" ]