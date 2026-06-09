#!/usr/bin/env python
"""
Populate Database with Sample Data
Run this script to add sample products and users to the database
"""

import sys
import os

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db
from sample_data import init_sample_products, init_sample_users

def populate_database():
    """Populate database with sample data"""
    with app.app_context():
        print("Initializing database...")
        
        # Create all tables
        db.create_all()
        print("[OK] Database tables created")
        
        # Add sample products
        print("\nAdding sample products...")
        init_sample_products()
        
        # Add sample users
        print("Adding sample users...")
        init_sample_users()
        
        print("\n" + "="*50)
        print("DATABASE POPULATED SUCCESSFULLY!")
        print("="*50)
        print("\nYou can now:")
        print("  1. Visit http://localhost:5000/api/products")
        print("  2. Browse products in the frontend")
        print("  3. Login with sample users:")
        print("     - john_doe / SecurePass@123")
        print("     - jane_smith / SecurePass@456")

if __name__ == '__main__':
    populate_database()
