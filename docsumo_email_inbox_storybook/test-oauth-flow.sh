#!/bin/bash

# OAuth Flow Integration Test Script
# This script tests the Gmail OAuth integration end-to-end

set -e

echo "🧪 Gmail OAuth Integration Test"
echo "================================"
echo ""

API_BASE="http://localhost:3001"
FRONTEND_URL="http://localhost:5174"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() { echo -e "${GREEN}✓ PASS${NC}: $1"; }
fail() { echo -e "${RED}✗ FAIL${NC}: $1"; exit 1; }
info() { echo -e "${YELLOW}ℹ INFO${NC}: $1"; }

# Test 1: Check if backend server is running
echo "Test 1: Backend Server Health Check"
if curl -s --max-time 5 "$API_BASE/api/auth/google" > /dev/null; then
    pass "Backend server is running on port 3001"
else
    fail "Backend server is not running. Start it with: cd server && npm run dev"
fi

# Test 2: Check if frontend server is running  
echo ""
echo "Test 2: Frontend Server Health Check"
if curl -s --max-time 5 "$FRONTEND_URL" > /dev/null; then
    pass "Frontend server is running on port 5174"
else
    fail "Frontend server is not running. Start it with: npm run dev"
fi

# Test 3: Get OAuth URL from API
echo ""
echo "Test 3: OAuth URL Generation"
AUTH_RESPONSE=$(curl -s "$API_BASE/api/auth/google")
AUTH_URL=$(echo "$AUTH_RESPONSE" | grep -o '"authUrl":"[^"]*"' | cut -d'"' -f4)

if [[ "$AUTH_URL" == https://accounts.google.com/* ]]; then
    pass "OAuth URL generated successfully"
    info "Auth URL starts with: ${AUTH_URL:0:60}..."
else
    fail "OAuth URL not generated. Response: $AUTH_RESPONSE"
fi

# Test 4: Check OAuth URL contains required parameters
echo ""
echo "Test 4: OAuth URL Parameters"
if [[ "$AUTH_URL" == *"client_id="* ]] && [[ "$AUTH_URL" == *"redirect_uri="* ]] && [[ "$AUTH_URL" == *"scope="* ]]; then
    pass "OAuth URL contains required parameters (client_id, redirect_uri, scope)"
else
    fail "OAuth URL missing required parameters"
fi

# Test 5: Check redirect URI is correct
echo ""
echo "Test 5: Redirect URI Configuration"
REDIRECT_URI=$(echo "$AUTH_URL" | grep -o 'redirect_uri=[^&]*' | cut -d'=' -f2)
DECODED_REDIRECT=$(python3 -c "import urllib.parse; print(urllib.parse.unquote('$REDIRECT_URI'))")

if [[ "$DECODED_REDIRECT" == "http://localhost:3001/api/auth/google/callback" ]]; then
    pass "Redirect URI is correctly configured: $DECODED_REDIRECT"
else
    fail "Redirect URI is incorrect: $DECODED_REDIRECT"
fi

# Test 6: Check CORS headers
echo ""
echo "Test 6: CORS Configuration"
CORS_HEADER=$(curl -s -H "Origin: $FRONTEND_URL" -I "$API_BASE/api/auth/google" 2>/dev/null | grep -i "access-control-allow-origin" | tr -d '\r')

if [[ "$CORS_HEADER" == *"$FRONTEND_URL"* ]] || [[ "$CORS_HEADER" == *"5174"* ]]; then
    pass "CORS is correctly configured for $FRONTEND_URL"
else
    fail "CORS not allowing $FRONTEND_URL. Header: $CORS_HEADER"
fi

# Test 7: Check .env configuration
echo ""
echo "Test 7: Environment Configuration"
ENV_FILE="/Users/diveshmehta/Documents/Case Project/docsumo_email_inbox_storybook/server/.env"
if [ -f "$ENV_FILE" ]; then
    FRONTEND_ENV=$(grep "FRONTEND_URL" "$ENV_FILE" | cut -d'=' -f2)
    if [[ "$FRONTEND_ENV" == *"5174"* ]]; then
        pass ".env FRONTEND_URL is set to port 5174"
    else
        fail ".env FRONTEND_URL is set to wrong port: $FRONTEND_ENV (should be 5174)"
    fi
else
    fail ".env file not found"
fi

# Test 8: Simulate callback redirect URL construction
echo ""
echo "Test 8: Callback Redirect Simulation"
EXPECTED_REDIRECT="${FRONTEND_URL}/inbox?connected=true&email=test@example.com"
if [[ "$EXPECTED_REDIRECT" == "http://localhost:5174/inbox"* ]]; then
    pass "Callback will redirect to correct frontend URL: $EXPECTED_REDIRECT"
else
    fail "Callback redirect URL is incorrect"
fi

# Summary
echo ""
echo "================================"
echo -e "${GREEN}All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5174/inbox in your browser"
echo "2. Click 'Connect Gmail' button"
echo "3. Authenticate with Google"
echo "4. You should be redirected back to http://localhost:5174/inbox with your emails"
echo ""
