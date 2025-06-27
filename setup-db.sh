#!/bin/bash

echo "🗃️  Starting database setup..."

# Step 1: Run Migrations
echo "🧱 Running migrations..."
npm run migration:run || { echo "❌ Migration failed"; exit 1; }

# Step 2: Run Seeds
echo "🌱 Running seeders..."
npm run seed:run || { echo "❌ Seeding failed"; exit 1; }

echo "✅ Database setup complete."
