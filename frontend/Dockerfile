FROM tiangolo/node-frontend
RUN apt update && apt -y install vim
COPY . /frontend
WORKDIR /frontend
RUN npm install
ENTRYPOINT npm run start 
