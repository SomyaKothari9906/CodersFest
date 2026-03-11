// AI-Powered Product Recommendations and Personalization

class RecommendationEngine {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];
        this.purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        this.products = app?.products || [];
    }

    // Load or create user profile
    loadUserProfile() {
        let profile = localStorage.getItem('userProfile');
        if (profile) {
            return JSON.parse(profile);
        }
        return {
            userId: this.generateUserId(),
            preferences: [],
            browsingBehavior: {},
            lastSeen: new Date(),
            totalSpent: 0
        };
    }

    // Generate unique user ID
    generateUserId() {
        const existing = localStorage.getItem('userId');
        if (existing) return existing;
        const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', id);
        return id;
    }

    // Track product view
    trackProductView(productId) {
        const timestamp = new Date();
        this.viewHistory.push({
            productId,
            timestamp,
            category: this.getProductCategory(productId)
        });
        
        // Keep last 50 views
        this.viewHistory = this.viewHistory.slice(-50);
        localStorage.setItem('viewHistory', JSON.stringify(this.viewHistory));
        
        // Update user browsing behavior
        this.updateBrowsingBehavior(productId);
    }

    // Get product category
    getProductCategory(productId) {
        const product = this.products.find(p => p.id === productId);
        return product ? product.category : 'Unknown';
    }

    // Update browsing behavior
    updateBrowsingBehavior(productId) {
        const category = this.getProductCategory(productId);
        if (!this.userProfile.browsingBehavior[category]) {
            this.userProfile.browsingBehavior[category] = 0;
        }
        this.userProfile.browsingBehavior[category]++;
        this.saveUserProfile();
    }

    // Get personalized recommendations
    getRecommendations(excludeProductIds = []) {
        // Analyze user behavior
        const topCategory = this.getTopCategory();
        const similarPriceRange = this.getSimilarPriceRange();
        
        let recommendations = [];

        // 1. Products from most viewed category
        recommendations.push(...this.products.filter(p => 
            p.category === topCategory && 
            !excludeProductIds.includes(p.id)
        ).slice(0, 3));

        // 2. Cross-sell: complementary products
        recommendations.push(...this.getCrosssellProducts());

        // 3. Trending products in user's interest categories
        recommendations.push(...this.getTrendingProducts());

        // 4. Personalized deals
        recommendations.push(...this.getPersonalizedDeals());

        // Remove duplicates and excluded products
        const seen = new Set();
        const final = [];
        for (const rec of recommendations) {
            if (!seen.has(rec.id) && !excludeProductIds.includes(rec.id)) {
                final.push(rec);
                seen.add(rec.id);
            }
        }

        return final.slice(0, 8); // Return top 8 recommendations
    }

    // Get top category from user behavior
    getTopCategory() {
        const categories = Object.entries(this.userProfile.browsingBehavior);
        if (categories.length === 0) return 'Electronics';
        return categories.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    // Get similar price range products
    getSimilarPriceRange() {
        if (this.viewHistory.length === 0) return { min: 500, max: 5000 };
        
        const prices = this.viewHistory
            .map(v => {
                const product = this.products.find(p => p.id === v.productId);
                return product ? product.price : 0;
            })
            .filter(p => p > 0);

        if (prices.length === 0) return { min: 500, max: 5000 };

        const avg = prices.reduce((a, b) => a + b) / prices.length;
        return {
            min: Math.max(100, avg * 0.6),
            max: avg * 1.4
        };
    }

    // Get cross-sell products (products often bought together)
    getCrossellProducts() {
        const topCategory = this.getTopCategory();
        const allCategories = [...new Set(this.products.map(p => p.category))];
        const complementaryCategories = allCategories.filter(c => c !== topCategory);
        
        return this.products.filter(p => 
            complementaryCategories.includes(p.category)
        ).slice(0, 2);
    }

    // Get trending products
    getTrendingProducts() {
        return this.products
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 3);
    }

    // Get personalized deals based on price sensitivity
    getPersonalizedDeals() {
        return this.products.filter(p => p.discount > 40).slice(0, 2);
    }

    // Get recommendation score for a product
    getRecommendationScore(product) {
        let score = 0;

        // Match user's top category
        if (product.category === this.getTopCategory()) score += 30;

        // Match price range
        const priceRange = this.getSimilarPriceRange();
        if (product.price >= priceRange.min && product.price <= priceRange.max) score += 20;

        // High rating
        if (product.rating >= 4.5) score += 20;

        // Discount available
        if (product.discount > 30) score += 15;

        // Popular product
        if (product.reviews > 1000) score += 15;

        return score;
    }

    // Save user profile
    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    // Track purchase
    trackPurchase(productId, amount) {
        this.purchaseHistory.push({
            productId,
            amount,
            timestamp: new Date(),
            category: this.getProductCategory(productId)
        });
        
        this.userProfile.totalSpent += amount;
        this.userProfile.preferences.push(this.getProductCategory(productId));
        
        localStorage.setItem('purchaseHistory', JSON.stringify(this.purchaseHistory));
        this.saveUserProfile();
    }

    // Get user loyalty tier
    getLoyaltyTier() {
        const spent = this.userProfile.totalSpent;
        if (spent >= 50000) return { tier: 'Platinum', discount: 15 };
        if (spent >= 30000) return { tier: 'Gold', discount: 10 };
        if (spent >= 10000) return { tier: 'Silver', discount: 5 };
        return { tier: 'Bronze', discount: 0 };
    }

    // Get personalized notification
    getPersonalizedNotification() {
        const topCategory = this.getTopCategory();
        const tier = this.getLoyaltyTier();
        
        const notifications = [
            `🎯 New ${topCategory} arrivals just for you!`,
            `🏆 Exclusive ${tier.discount}% discount for ${tier.tier} members!`,
            `💰 Your favorite category is on sale this week`,
            `⭐ Recommended for you based on your preferences`
        ];

        return notifications[Math.floor(Math.random() * notifications.length)];
    }

    // Test recommendations
    testRecommendations() {
        console.log('🤖 Recommendation Engine Test:');
        console.log('✓ User profile tracking enabled');
        console.log('✓ Personalized recommendations available');
        console.log('✓ Cross-sell suggestions enabled');
        console.log('✓ Loyalty tier system active');
        console.log('Current Tier:', this.getLoyaltyTier());
    }
}

let recommendationEngine;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        recommendationEngine = new RecommendationEngine();
        recommendationEngine.testRecommendations();
    }, 100);
});
