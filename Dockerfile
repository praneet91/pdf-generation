FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/node @types/react @types/react-dom

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 