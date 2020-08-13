FROM node
ADD package.json /app/
ADD package-lock.json /app/
ADD ./build /app
ADD ./res /app/res
WORKDIR /app
RUN npm install
ENV TYPE=production
CMD [ "npm", "run-script", "run-prod" ]