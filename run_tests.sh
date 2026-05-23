#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
    echo "✅ Environment variables loaded from .env.local"
else
    echo "❌ .env.local not found"
    exit 1
fi

# Verify critical variables are set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not set"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set"
    exit 1
fi

if [ -z "$FRED_API_KEY" ]; then
    echo "❌ FRED_API_KEY not set"
    exit 1
fi

echo "✅ All required API keys configured"
echo ""

# Run tests
/usr/bin/python3 test_sprint_0.py
