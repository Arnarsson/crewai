#!/bin/bash

# Exit on error
set -e

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "ERROR: AWS credentials are not set"
    exit 1
fi

# Create backup directory if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.sql.gz"

# Create database backup
echo "Creating database backup..."
pg_dump $DATABASE_URL | gzip > $BACKUP_FILE

# Upload to S3
echo "Uploading backup to S3..."
aws s3 cp $BACKUP_FILE s3://${BACKUP_S3_BUCKET:-crewai-backups}/daily/

# Clean up old backups (keep last 7 days)
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +7 -delete

echo "Backup completed successfully!"
