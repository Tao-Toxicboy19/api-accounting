# -------------------------------
# STAGE 1: Build NestJS App
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# -------------------------------
# STAGE 2: Run App
# -------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy dist (NestJS build)
COPY --from=builder /app/dist ./dist

# Copy client folder
COPY --from=builder /app/client ./client

# Copy production deps only
COPY package*.json ./
RUN npm install --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
