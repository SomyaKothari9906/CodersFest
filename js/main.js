// Main Application Logic
class ECommerceApp {
    constructor() {
        this.cart = [];
        this.wishlist = [];
        this.products = [];
        this.loadProducts();
        this.loadWishlist();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderFeaturedProducts();
        this.renderTrendingDeals();
        this.renderCampaigns();
        this.renderCustomerReviews();
        this.renderExpertPicks();
        this.renderWinnerFeatures();
        this.startLiveNotifications();
        this.updateCartCount();
    }
    
    // WINNING FEATURES
    loadWishlist() {
        const saved = localStorage.getItem('wishlist');
        this.wishlist = saved ? JSON.parse(saved) : [];
    }
    
    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
    
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification('❤️ Removed from Wishlist', 'info');
        } else {
            this.wishlist.push(productId);
            this.showNotification('💚 Added to Wishlist', 'success');
        }
        this.saveWishlist();
        this.updateWishlistCount();
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const prodId = parseInt(btn.dataset.productId);
            if (this.wishlist.includes(prodId)) {
                btn.classList.add('active');
                btn.innerHTML = '❤️ Saved';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '🤍 Save';
            }
        });
    }
    
    updateWishlistCount() {
        const badge = document.getElementById('wishlist-count');
        if (badge) {
            badge.textContent = this.wishlist.length;
            badge.style.display = this.wishlist.length > 0 ? 'inline-block' : 'none';
        }
    }
    
    renderExpertPicks() {
        const container = document.getElementById('expert-picks');
        if (!container) return;
        
        // Products marked as expert picks
        const expertPicks = this.products.filter(p => [1, 5, 12, 23, 35].includes(p.id));
        
        container.innerHTML = expertPicks.map(p => `
            <div class="expert-pick-card" style="background: white; border: 2px solid #f39c12; border-radius: 8px; padding: 1rem; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: bold; border-radius: 0 0 0 8px;">
                    ⭐ EDITOR'S CHOICE
                </div>
                <div style="font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; margin-top: 1rem;">${p.image}</div>
                <h3 style="margin: 0.5rem 0; font-size: 0.95rem; font-weight: 600;">${p.name}</h3>
                <p style="font-size: 0.85rem; color: #666; margin: 0.5rem 0;">${p.description}</p>
                <div style="display: flex; gap: 0.5rem; margin: 0.8rem 0;">
                    <span style="color: #f39c12; font-weight: bold; font-size: 0.85rem;">✓ Most Popular</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem;">
                    <span style="color: #27ae60; font-weight: bold;">₹${p.price}</span>
                    <button class="wishlist-btn" data-product-id="${p.id}" onclick="app.toggleWishlist(${p.id})" style="background: white; border: 2px solid #e74c3c; color: #e74c3c; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: 600;">🤍 Save</button>
                </div>
            </div>
        `).join('');
    }
    
    renderWinnerFeatures() {
        const container = document.getElementById('winner-features');
        if (!container) return;
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; padding: 2rem 1rem;">
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆</div>
                    <h3 style="margin: 0.5rem 0;">#1 Rated Platform</h3>
                    <p style="font-size: 0.9rem; margin: 0;">4.8★ Average Rating</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
                    <h3 style="margin: 0.5rem 0;">Best Prices</h3>
                    <p style="font-size: 0.9rem; margin: 0;">Save up to 55%</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡</div>
                    <h3 style="margin: 0.5rem 0;">Fast Shipping</h3>
                    <p style="font-size: 0.9rem; margin: 0;">Delivery in 1-2 Days</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border-radius: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎁</div>
                    <h3 style="margin: 0.5rem 0;">Loyalty Rewards</h3>
                    <p style="font-size: 0.9rem; margin: 0;">Earn Points on Every Buy</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛡️</div>
                    <h3 style="margin: 0.5rem 0;">100% Secure</h3>
                    <p style="font-size: 0.9rem; margin: 0;">SSL Encrypted Payments</p>
                </div>
                <div style="text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">😊</div>
                    <h3 style="margin: 0.5rem 0;">Happy Customers</h3>
                    <p style="font-size: 0.9rem; margin: 0;">80,000+ Reviews</p>
                </div>
            </div>
        `;
    }
    
    startLiveNotifications() {
        // Simulate live purchase notifications
        const notifications = [
            '📦 Ravi bought Sony Headphones - 2 minutes ago',
            '📦 Priya ordered Nike Shoes - 5 minutes ago',
            '📦 Arjun purchased Apple Watch - 8 minutes ago',
            '📦 Anjali bought Yoga Mat - 11 minutes ago',
            '📦 Vikram ordered Samsung TV - 14 minutes ago',
            '🔥 30 people viewing Samsung TV right now!',
            '⚡ Flash Sale: 50% off on Nike Shoes!',
            '💚 100+ people added Coffee Beans to wishlist!',
            '📦 Neha bought Premium T-Shirt - Just now',
            '🎁 You could win ₹5,000 voucher - Limited spots left!'
        ];
        
        let index = 0;
        setInterval(() => {
            const notification = notifications[index % notifications.length];
            const badge = document.getElementById('live-notification-badge');
            if (badge) {
                badge.innerHTML = `<span style="animation: pulse 1s infinite;">●</span> ${notification}`;
            }
            index++;
        }, 5000);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        mobileToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', 
                mobileToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });

        // Chat button
        document.getElementById('chat-btn')?.addEventListener('click', () => {
            this.openChat();
        });

        // CTA Button
        document.querySelector('.cta-button')?.addEventListener('click', () => {
            window.location.href = 'products.html';
        });

        // Language selector
        document.getElementById('language-selector')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        // Membership button
        document.querySelector('.membership-btn')?.addEventListener('click', () => {
            this.showMembershipInfo();
        });
    }

    loadProducts() {
        // Fetch products from backend API
        const API_URL = 'http://localhost:5000/api';
        
        fetch(`${API_URL}/products?page=1&per_page=50`)
            .then(response => response.json())
            .then(data => {
                // Convert backend products to frontend format
                this.products = data.products.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    original_price: p.original_price,
                    rating: p.average_rating || 4.5,
                    reviews: p.total_reviews || 0,
                    image: '📦',  // Default emoji
                    inStock: p.stock > 0,
                    stock: p.stock,
                    discount: p.discount_percentage,
                    description: p.description || '',
                    specs: []
                }));
                
                // Re-render sections with loaded data
                this.renderFeaturedProducts();
                this.renderTrendingDeals();
                this.renderExpertPicks();
            })
            .catch(error => {
                console.error('Error loading products:', error);
                // Fall back to demo data if API fails
                this.loadDemoProducts();
            });
    }
    
    loadDemoProducts() {
        // Fallback demo data if API is not available
        this.products = [
            {
                id: '1',
                name: 'Sony WH-1000XM5 Headphones',
                category: 'Electronics',
                price: 18999,
                original_price: 29999,
                rating: 4.8,
                reviews: 2450,
                image: '🎧',
                inStock: true,
                stock: 45,
                discount: 37,
                description: 'Industry-leading noise cancellation with 30-hour battery life',
                specs: []
            },
            {
                id: '2',
                name: 'Apple Watch Series 8',
                category: 'Electronics',
                price: 34999,
                original_price: 41999,
                rating: 4.6,
                reviews: 5200,
                image: '⌚',
                inStock: true,
                stock: 28,
                discount: 17,
                description: 'Advanced health monitoring and fitness tracking',
                specs: []
            },
            {
                id: '3',
                name: 'Premium Cotton T-Shirt',
                category: 'Fashion',
                price: 799,
                original_price: 1799,
                rating: 4.5,
                reviews: 1856,
                image: '👕',
                inStock: true,
                stock: 120,
                discount: 55,
                description: 'Comfortable organic cotton everyday wear',
                specs: []
            }
        ];
        this.renderFeaturedProducts();
        this.renderTrendingDeals();
    }


    renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;

        const featured = this.products.slice(0, 4);
        container.innerHTML = featured.map(product => this.createProductCard(product)).join('');
        this.attachProductCardListeners();
    }

    renderTrendingDeals() {
        const container = document.getElementById('trending-deals');
        if (!container) return;

        const deals = this.products.filter(p => p.discount > 40);
        container.innerHTML = deals.map(product => `
            <div class="deal-card" role="listitem">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${product.image}</div>
                <h3>${product.name}</h3>
                <p>Save ${product.discount}%</p>
                <p class="deal-timer">Limited Time Offer ⏰</p>
                <button onclick="app.addToCart(${product.id})" aria-label="Add ${product.name} to cart">
                    View Deal
                </button>
            </div>
        `).join('');
    }

    renderCampaigns() {
        const container = document.getElementById('campaigns');
        if (!container) return;

        container.innerHTML = `
            <div class="campaign-banner">
                <h3>🎉 Big Summer Sale</h3>
                <p>Get up to 50% off on all categories</p>
                <button aria-label="Shop summer sale">Shop Now</button>
            </div>
            <div class="campaign-banner" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <h3>💝 Flash Deals</h3>
                <p>Daily surprises every 6 hours</p>
                <button aria-label="View flash deals">View Deals</button>
            </div>
            <div class="campaign-banner" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <h3>🚀 New Arrivals</h3>
                <p>Latest trends just landed</p>
                <button aria-label="Browse new arrivals">Explore</button>
            </div>
        `;
    }

    renderCustomerReviews() {
        const container = document.getElementById('customer-reviews');
        if (!container) return;

        const reviews = [
            {
                name: 'Rajesh Kumar',
                rating: 5,
                text: 'Excellent service! Fast delivery and great product quality. Highly recommended!',
                verified: true
            },
            {
                name: 'Priya Singh',
                rating: 4.5,
                text: 'Amazing shopping experience. Easy returns and very responsive customer support.',
                verified: true
            },
            {
                name: 'Amit Patel',
                rating: 5,
                text: 'Best online shopping platform. Authentic products and best prices guaranteed!',
                verified: true
            },
            {
                name: 'Neha Sharma',
                rating: 4,
                text: 'Great variety of products. The website is very user-friendly and secure.',
                verified: true
            }
        ];

        container.innerHTML = reviews.map(review => `
            <div class="review-card" role="listitem">
                <div class="review-header">
                    <div class="reviewer-name">${review.name}</div>
                    <div class="review-rating">${'⭐'.repeat(Math.floor(review.rating))} ${review.rating}</div>
                </div>
                <p class="review-text">"${review.text}"</p>
                ${review.verified ? '<div class="review-verified">✓ Verified Buyer</div>' : ''}
            </div>
        `).join('');
    }

    createProductCard(product) {
        return `
            <div class="product-card" role="listitem" tabindex="0">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-rating">
                        ${'⭐'.repeat(Math.floor(product.rating))}
                        <span aria-label="${product.rating} out of 5 stars, ${product.reviews} reviews">
                            (${product.reviews})
                        </span>
                    </div>
                    <div class="product-price">
                        <span class="original-price">₹${product.originalPrice}</span>
                        <span class="current-price">₹${product.price}</span>
                        <span class="discount-badge">${product.discount}% OFF</span>
                    </div>
                    <button 
                        class="add-to-cart-btn" 
                        onclick="app.addToCart(${product.id})"
                        aria-label="Add ${product.name} to shopping cart"
                    >
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    attachProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const button = card.querySelector('.add-to-cart-btn');
                    button?.click();
                }
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const existingItem = this.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.updateCartCount();
            this.showNotification(`${product.name} added to cart!`, 'success');
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
    }

    updateCartCount() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = count;
            badge.setAttribute('aria-label', `${count} items in cart`);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.setAttribute('role', 'alert');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    openChat() {
        alert('Chat Support Feature:\n\n💬 Chat with our AI assistant or human agents 24/7\n\nThis would open a real-time chat interface in production.');
    }

    changeLanguage(lang) {
        const languages = {
            en: 'English',
            hi: 'हिंदी',
            es: 'Español'
        };
        this.showNotification(`Language changed to ${languages[lang]}`, 'info');
        // In production, this would load translated content
    }

    showMembershipInfo() {
        alert('Premium Membership Benefits:\n\n' +
            '✨ Free shipping on all orders\n' +
            '🎁 Exclusive early access to sales\n' +
            '💰 Loyalty points on every purchase\n' +
            '🏆 VIP customer support\n' +
            '🎯 Personalized product recommendations\n\n' +
            'Join now for just ₹299/year!');
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ECommerceApp();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        app.cart = JSON.parse(savedCart);
        app.updateCartCount();
    }
});
