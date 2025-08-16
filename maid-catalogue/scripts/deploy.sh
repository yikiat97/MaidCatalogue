#!/bin/bash

# Frontend Deployment Script
echo "🚀 Starting Maid Agency Frontend Deployment..."

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

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Frontend is now live at: http://52.74.200.108"
