#!/bin/bash
echo "🚀 Checking Node.js version..."
node -v || (echo "Node.js not found!" && exit 1)

echo "🔧 Installing dependencies..."
npm install

echo "✅ Setup complete! Run 'npm start' to begin."