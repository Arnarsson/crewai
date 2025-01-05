#!/usr/bin/env python3
import os
import glob
from supabase import create_client, Client

def run_migrations():
    """Run database migrations"""
    # Initialize Supabase client
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    
    # Get all SQL migration files
    migration_files = sorted(glob.glob(os.path.join(os.path.dirname(__file__), '../migrations/*.sql')))
    
    for migration_file in migration_files:
        print(f"Running migration: {os.path.basename(migration_file)}")
        with open(migration_file, 'r') as f:
            sql = f.read()
            # Execute the SQL migration
            supabase.db.execute(sql)
        print(f"Completed migration: {os.path.basename(migration_file)}")

if __name__ == "__main__":
    run_migrations()
