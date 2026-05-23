#!/bin/bash

###############################################################################
# MIZHAR Platform - Comprehensive API Testing Script
#
# This script tests all 8 API endpoints and verifies responses
# Usage: ./scripts/test-all-endpoints.sh
#
# Prerequisites:
# - Dev server running: npm run dev
# - curl installed
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
FAILED_TESTS=0
PASSED_TESTS=0

# Test helper functions
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5

    echo -e "${YELLOW}Testing:${NC} $name"
    echo -e "${YELLOW}Endpoint:${NC} $method $endpoint"

    if [ -z "$data" ]; then
        # GET request
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        # POST request
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$status_code" == "$expected_status"* ]]; then
        echo -e "${GREEN}✓ PASSED${NC} - Status: $status_code"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ FAILED${NC} - Expected: $expected_status, Got: $status_code"
        ((FAILED_TESTS++))
    fi

    # Print response preview
    if [ ! -z "$body" ]; then
        echo -e "${YELLOW}Response:${NC}"
        echo "$body" | head -c 200
        echo "..."
    fi
    echo ""
}

###############################################################################
# START TESTING
###############################################################################

print_header "MIZHAR Platform - API Testing Suite"

echo -e "${BLUE}Starting tests at: $(date)${NC}\n"

# Test 1: Get all blog posts
test_endpoint \
    "Get All Blog Posts" \
    "GET" \
    "/api/blog?limit=10" \
    "" \
    "200"

# Test 2: Get single blog post
test_endpoint \
    "Get Single Blog Post (anthropic)" \
    "GET" \
    "/api/blog/anthropic-deep-vc-critique" \
    "" \
    "200"

# Test 3: Get blog posts with tag filter
test_endpoint \
    "Get Blog Posts - Filter by Tag" \
    "GET" \
    "/api/blog?tag=venture-analysis&limit=10" \
    "" \
    "200"

# Test 4: Get all cases
test_endpoint \
    "Get All Cases" \
    "GET" \
    "/api/cases?limit=10" \
    "" \
    "200"

# Test 5: Get single case
test_endpoint \
    "Get Single Case (ID: 1)" \
    "GET" \
    "/api/cases/1" \
    "" \
    "200"

# Test 6: Get analytics
test_endpoint \
    "Get Analytics" \
    "GET" \
    "/api/cases/analytics" \
    "" \
    "200"

# Test 7: Generate blog posts (requires analyzed cases)
test_endpoint \
    "Generate Blog Posts" \
    "POST" \
    "/api/blog/generate" \
    '{"case_ids": [1, 2], "publish": false}' \
    "200"

# Test 8: Ingest cases
test_endpoint \
    "Ingest Cases" \
    "POST" \
    "/api/cases/ingest" \
    '{"yc_limit": 2, "cb_limit": 2, "tc_limit": 2, "sec_limit": 2}' \
    "200"

# Test 9: Analyze cases
test_endpoint \
    "Analyze Cases" \
    "POST" \
    "/api/cases/analyze" \
    '{"case_ids": [1]}' \
    "200"

# Error handling tests
print_header "Error Handling Tests"

# Test 10: Invalid case ID
test_endpoint \
    "Get Invalid Case (404)" \
    "GET" \
    "/api/cases/99999" \
    "" \
    "404"

# Test 11: Invalid blog slug
test_endpoint \
    "Get Invalid Blog Post (404)" \
    "GET" \
    "/api/blog/invalid-slug-that-does-not-exist" \
    "" \
    "404"

###############################################################################
# RESULTS SUMMARY
###############################################################################

print_header "Test Results Summary"

echo -e "${GREEN}✓ Passed: $PASSED_TESTS${NC}"
echo -e "${RED}✗ Failed: $FAILED_TESTS${NC}"

TOTAL=$((PASSED_TESTS + FAILED_TESTS))
PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL))

echo -e "\n${BLUE}Success Rate: ${PERCENTAGE}% (${PASSED_TESTS}/${TOTAL})${NC}\n"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    echo -e "${GREEN}All tests PASSED! ✓${NC}"
    echo -e "${GREEN}════════════════════════════════════════${NC}\n"
    exit 0
else
    echo -e "${RED}════════════════════════════════════════${NC}"
    echo -e "${RED}Some tests FAILED! ✗${NC}"
    echo -e "${RED}════════════════════════════════════════${NC}\n"
    exit 1
fi
