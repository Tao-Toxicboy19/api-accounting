# -------------------------------
# STAGE 1: Build NestJS App
# -------------------------------
    FROM node:20-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy source files
    COPY . .
    
    # Build the app (Nest compiles TS → JS)
    RUN npm run build
    
    # -------------------------------
    # STAGE 2: Run App
    # -------------------------------
    FROM node:20-alpine AS runner
    
    # Set working directory
    WORKDIR /app
    
    # Copy only the compiled dist from builder
    COPY --from=builder /app/dist ./dist
    
    # Copy production deps only
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Optional: Set NODE_ENV
    ENV NODE_ENV=production
    
    # Expose the port your app runs on
    EXPOSE 3000
    
    # Start the app
    CMD ["node", "dist/main"]
    