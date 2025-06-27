#!/bin/bash

echo "🔧 Project Setup Started..."

# Step 1: Copy .env
if [ -f ".env" ]; then
  echo "✅ .env already exists"
else
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ .env created from .env.example"
  else
    echo "⚠️  .env.example not found. Skipping .env creation."
  fi
fi

# Step 2: Ensure database/seeds folder exists
if [ ! -d "database/seeds" ]; then
  mkdir -p database/seeds
  echo "📁 Created database/seeds directory"
else
  echo "✅ database/seeds directory already exists"
fi

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm install

