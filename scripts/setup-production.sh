#!/bin/bash

# MIZHAR Production Setup Script
# This script helps configure your production environment

set -e

echo "🚀 MIZHAR Production Setup"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f .env.local ]; then
  echo -e "${YELLOW}ℹ️  .env.local already exists${NC}"
  read -p "Do you want to reconfigure? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Using existing .env.local"
    exit 0
  fi
fi

echo "📋 Configuration Steps"
echo "1. Supabase Credentials"
echo "2. API Keys"
echo "3. Payment Setup"
echo ""

# Step 1: Supabase Setup
echo -e "${GREEN}[1/3] Supabase Configuration${NC}"
echo "Go to: https://app.supabase.com → Select your project → Settings → API"
echo ""

read -p "Enter your Supabase Project URL (https://[id].supabase.co): " SUPABASE_URL
read -p "Enter your Anon Key: " SUPABASE_ANON_KEY
read -p "Enter your Service Role Key: " SUPABASE_SERVICE_ROLE_KEY

# Step 2: API Keys
echo ""
echo -e "${GREEN}[2/3] API Keys Configuration${NC}"

read -p "Enter your Anthropic API Key (from api.anthropic.com): " ANTHROPIC_API_KEY
read -p "Enter your FRED API Key (from fred.stlouisfed.org): " FRED_API_KEY
read -p "Enter your Crunchbase API Key: " CRUNCHBASE_API_KEY
read -p "Enter your NewsAPI Key (from newsapi.org): " NEWS_API_KEY

# Step 3: Payment Setup
echo ""
echo -e "${GREEN}[3/3] Payment Configuration${NC}"

read -p "Enter your PayPal Client ID: " PAYPAL_CLIENT_ID
read -p "Enter your PayPal Secret: " PAYPAL_SECRET

# Get app URL
echo ""
read -p "Enter your Render app URL (e.g., https://mizhar-platform.onrender.com): " APP_URL

# Create .env.local
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# AI & Data APIs
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
FRED_API_KEY=$FRED_API_KEY
CRUNCHBASE_API_KEY=$CRUNCHBASE_API_KEY
NEWS_API_KEY=$NEWS_API_KEY

# Payment
PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID
PAYPAL_SECRET=$PAYPAL_SECRET

# App
NEXT_PUBLIC_APP_URL=$APP_URL
NODE_ENV=production
EOF

echo ""
echo -e "${GREEN}✓ Configuration saved to .env.local${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "1. .env.local contains secrets - NEVER commit to git"
echo "2. Add API credentials to Render dashboard for production"
echo "3. Restart dev server: npm run dev"
echo ""

# Verify build
echo -e "${GREEN}Verifying build...${NC}"
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Build successful!${NC}"
  echo ""
  echo -e "${GREEN}Next steps:${NC}"
  echo "1. Start dev server: npm run dev"
  echo "2. Visit: http://localhost:3000"
  echo "3. Test signup and features"
  echo "4. When ready, push to GitHub and Render will auto-deploy"
else
  echo -e "${RED}✗ Build failed. Check errors above.${NC}"
  exit 1
fi
