#!/bin/bash

# Exit on error
set -e

# Check if API_URL is set
if [ -z "$API_URL" ]; then
    echo "ERROR: API_URL is not set"
    exit 1
fi

# Function to check endpoint health
check_endpoint() {
    local endpoint=$1
    local max_retries=5
    local retry_count=0
    local wait_time=10

    while [ $retry_count -lt $max_retries ]; do
        if curl -s -f "${API_URL}${endpoint}"; then
            echo "✅ ${endpoint} is healthy"
            return 0
        else
            echo "⚠️  ${endpoint} is not healthy, retrying in ${wait_time} seconds..."
            sleep $wait_time
            retry_count=$((retry_count + 1))
        fi
    done

    echo "❌ ${endpoint} health check failed after ${max_retries} attempts"
    return 1
}

# Check main endpoints
echo "Checking API health..."
check_endpoint "/health" || exit 1

echo "All health checks passed!"
