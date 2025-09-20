#!/bin/bash

# Frontend Deployment Script
echo "🚀 Starting Maid Agency Frontend Deployment..."
echo "📅 $(date)"

# Navigate to frontend directory
cd /var/www/maid-agency/frontend/maid-catalogue

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build:prod

# Copy build files to Nginx directory
echo "📁 Copying build files..."
sudo cp -r dist/* /var/www/html/

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Health check
echo "🏥 Running health checks..."
sleep 5
if curl -f -k https://easyhiresg.com > /dev/null; then
  echo "✅ Frontend health check passed"
else
  echo "❌ Frontend health check failed"
  exit 1
fi

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Frontend: https://easyhiresg.com"
