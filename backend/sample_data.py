"""
Sample Data for E-Commerce Platform
This file contains functions to populate the database with sample products and users
"""

import re
from models.database import db, Product, User, Review


def generate_slug(name):
    """Generate a URL-friendly slug from a product name"""
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug

def init_sample_products():
    """Initialize database with sample products"""
    
    sample_products = [
        {
            'name': 'Sony WH-1000XM5 Headphones',
            'category': 'Electronics',
            'subcategory': 'Headphones & Audio',
            'description': 'Industry-leading noise cancellation with 30-hour battery life',
            'price': 18999,
            'original_price': 29999,
            'discount_percentage': 37,
            'stock': 45,
            'sku': 'SONY-WH1000XM5-001',
            'average_rating': 4.8,
            'total_reviews': 2450
        },
        {
            'name': 'Apple Watch Series 8',
            'category': 'Electronics',
            'subcategory': 'Wearables',
            'description': 'Advanced health monitoring and fitness tracking',
            'price': 34999,
            'original_price': 41999,
            'discount_percentage': 17,
            'stock': 28,
            'sku': 'APPLE-WATCH-S8-001',
            'average_rating': 4.6,
            'total_reviews': 5200
        },
        {
            'name': 'Samsung 65" 4K Smart TV',
            'category': 'Electronics',
            'subcategory': 'Televisions',
            'description': '4K UHD with HDR and Smart TV features',
            'price': 49999,
            'original_price': 79999,
            'discount_percentage': 37,
            'stock': 12,
            'sku': 'SAMSUNG-65TV-001',
            'average_rating': 4.6,
            'total_reviews': 890
        },
        {
            'name': 'Premium Cotton T-Shirt',
            'category': 'Fashion',
            'subcategory': 'Tops',
            'description': '100% organic cotton comfortable everyday wear',
            'price': 799,
            'original_price': 1799,
            'discount_percentage': 55,
            'stock': 120,
            'sku': 'FASHION-TSHIRT-001',
            'average_rating': 4.5,
            'total_reviews': 1856
        },
        {
            'name': 'Ray-Ban Aviator Sunglasses',
            'category': 'Fashion',
            'subcategory': 'Eyewear',
            'description': 'Classic style with UV protection',
            'price': 5999,
            'original_price': 11999,
            'discount_percentage': 50,
            'stock': 35,
            'sku': 'RAYBAN-AVIATOR-001',
            'average_rating': 4.7,
            'total_reviews': 1945
        },
        {
            'name': 'Nike Running Shoes',
            'category': 'Fashion',
            'subcategory': 'Footwear',
            'description': 'Latest running shoes with advanced cushioning',
            'price': 7999,
            'original_price': 13999,
            'discount_percentage': 43,
            'stock': 89,
            'sku': 'NIKE-RUNNING-001',
            'average_rating': 4.7,
            'total_reviews': 4200
        },
        {
            'name': 'Denim Jeans - Premium Fit',
            'category': 'Fashion',
            'subcategory': 'Bottoms',
            'description': 'Comfortable premium denim with perfect fit',
            'price': 1999,
            'original_price': 3999,
            'discount_percentage': 50,
            'stock': 75,
            'sku': 'FASHION-JEANS-001',
            'average_rating': 4.5,
            'total_reviews': 2100
        },
        {
            'name': 'Arabica Coffee Beans 500g',
            'category': 'Groceries',
            'subcategory': 'Beverages',
            'description': 'Premium arabica coffee from Ethiopian highlands',
            'price': 399,
            'original_price': 699,
            'discount_percentage': 43,
            'stock': 156,
            'sku': 'GROCERY-COFFEE-001',
            'average_rating': 4.9,
            'total_reviews': 3200
        },
        {
            'name': 'Organic Honey 500ml',
            'category': 'Groceries',
            'subcategory': 'Condiments',
            'description': 'Pure raw organic honey with no additives',
            'price': 349,
            'original_price': 599,
            'discount_percentage': 42,
            'stock': 134,
            'sku': 'GROCERY-HONEY-001',
            'average_rating': 4.9,
            'total_reviews': 2800
        },
        {
            'name': 'Premium Yoga Mat 6mm',
            'category': 'Lifestyle',
            'subcategory': 'Fitness',
            'description': 'Non-slip yoga mat with extra cushioning',
            'price': 2499,
            'original_price': 4499,
            'discount_percentage': 44,
            'stock': 91,
            'sku': 'LIFESTYLE-YOGAMAT-001',
            'average_rating': 4.8,
            'total_reviews': 2800
        },
        {
            'name': 'Meditation Cushion',
            'category': 'Lifestyle',
            'subcategory': 'Wellness',
            'description': 'Comfortable meditation cushion for daily practice',
            'price': 1799,
            'original_price': 3299,
            'discount_percentage': 45,
            'stock': 56,
            'sku': 'LIFESTYLE-CUSHION-001',
            'average_rating': 4.7,
            'total_reviews': 1545
        },
        {
            'name': 'Fitness Tracker Band',
            'category': 'Electronics',
            'subcategory': 'Wearables',
            'description': 'Track steps, calories, heart rate, and sleep',
            'price': 3499,
            'original_price': 6999,
            'discount_percentage': 50,
            'stock': 67,
            'sku': 'ELECTRONICS-TRACKER-001',
            'average_rating': 4.4,
            'total_reviews': 1500
        },
        {
            'name': 'JBL Flip 6 Speaker',
            'category': 'Electronics',
            'subcategory': 'Headphones & Audio',
            'description': 'Portable waterproof Bluetooth speaker',
            'price': 8999,
            'original_price': 12999,
            'discount_percentage': 30,
            'stock': 52,
            'sku': 'JBL-FLIP6-001',
            'average_rating': 4.5,
            'total_reviews': 3100
        },
        {
            'name': 'Almond Butter 250g',
            'category': 'Groceries',
            'subcategory': 'Nuts & Seeds',
            'description': 'Creamy organic almond butter rich in protein',
            'price': 599,
            'original_price': 999,
            'discount_percentage': 40,
            'stock': 78,
            'sku': 'GROCERY-ALMOND-001',
            'average_rating': 4.8,
            'total_reviews': 1902
        },
        {
            'name': 'Essential Oil Set 12pc',
            'category': 'Lifestyle',
            'subcategory': 'Beauty & Wellness',
            'description': 'Pure essential oils for aromatherapy and wellness',
            'price': 1299,
            'original_price': 2499,
            'discount_percentage': 48,
            'stock': 102,
            'sku': 'LIFESTYLE-OILS-001',
            'average_rating': 4.6,
            'total_reviews': 2012
        }
    ]
    
    for product_data in sample_products:
        # Check if product already exists
        existing = Product.query.filter_by(sku=product_data['sku']).first()
        if not existing:
            product = Product(
                name=product_data['name'],
                slug=generate_slug(product_data['name']),
                category=product_data['category'],
                subcategory=product_data['subcategory'],
                description=product_data['description'],
                price=product_data['price'],
                original_price=product_data['original_price'],
                discount_percentage=product_data['discount_percentage'],
                stock=product_data['stock'],
                sku=product_data['sku'],
                average_rating=product_data.get('average_rating', 0.0),
                total_reviews=product_data.get('total_reviews', 0)
            )
            db.session.add(product)
    
    db.session.commit()
    print("[OK] Sample products initialized successfully!")


def init_sample_users():
    """Initialize database with sample users"""
    
    sample_users = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'SecurePass@123',
            'phone': '+91-9876543210',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'SecurePass@456',
            'phone': '+91-9123456789',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'country': 'India'
        },
        {
            'username': 'demo_user',
            'email': 'demo@shopHub.com',
            'password': 'Demo@12345',
            'phone': '+91-8888888888',
            'city': 'Delhi',
            'state': 'Delhi',
            'country': 'India'
        }
    ]
    
    for user_data in sample_users:
        # Check if user already exists
        existing = User.query.filter_by(email=user_data['email']).first()
        if not existing:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                phone=user_data['phone'],
                city=user_data['city'],
                state=user_data['state'],
                country=user_data['country'],
                is_verified=True,
                loyalty_tier='Silver',
                loyalty_points=500
            )
            user.set_password(user_data['password'])
            db.session.add(user)
    
    db.session.commit()
    print("[OK] Sample users initialized successfully!")


def initialize_all_data():
    """Initialize all sample data"""
    try:
        init_sample_products()
        init_sample_users()
        print("\n[OK] All sample data initialized successfully!")
    except Exception as e:
        print(f"\n[ERROR] Error initializing sample data: {str(e)}")
        db.session.rollback()
