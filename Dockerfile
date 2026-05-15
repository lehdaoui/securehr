FROM node:22-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./backend/
RUN cd backend && npm install --build-from-source sqlite3

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY . .

EXPOSE 5000
EXPOSE 3000