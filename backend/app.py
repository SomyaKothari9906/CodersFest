"""
E-Commerce Platform Backend
Main Flask Application for handling API requests
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Use absolute path for database to avoid instance/ confusion
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'ecommerce.db')

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import db and models
from models.database import db, User, Product, Order, Review, Payment
db.init_app(app)

# Import routes
from routes import auth, products, orders, payments, users, recommendations, search, wishlist

# Register blueprints
app.register_blueprint(auth.bp)
app.register_blueprint(products.bp)
app.register_blueprint(orders.bp)
app.register_blueprint(payments.bp)
app.register_blueprint(users.bp)
app.register_blueprint(recommendations.bp)
app.register_blueprint(search.bp)
app.register_blueprint(wishlist.bp)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'version': '1.0.0'
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    logger.error(f'Internal Server Error: {str(error)}')
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({'error': 'Unauthorized access'}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({'error': 'Access forbidden'}), 403

# Database initialization
def init_db():
    with app.app_context():
        db.create_all()
        logger.info('Database tables created')

        # Auto-seed sample data if database is empty
        product_count = Product.query.count()
        if product_count == 0:
            logger.info('Database is empty — seeding sample data...')
            from sample_data import init_sample_products, init_sample_users
            init_sample_products()
            init_sample_users()
            logger.info('Sample data seeded successfully')
        else:
            logger.info(f'Database already has {product_count} products — skipping seed')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
