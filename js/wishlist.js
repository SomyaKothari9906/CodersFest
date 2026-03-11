/**
 * Wishlist Management Module
 * Handles displaying, removing, and managing wishlist items
 */

// API Base URL - change if backend is on different server
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Load user's wishlist items
 */
async function loadWishlist() {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            showLoginPrompt();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/wishlist`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                showLoginPrompt();
                return;
            }
            throw new Error('Failed to load wishlist');
        }

        const data = await response.json();
        displayWishlist(data.items, data.count);
    } catch (error) {
        console.error('Error loading wishlist:', error);
        displayWishlistError('Failed to load wishlist');
    }
}

/**
 * Display wishlist items
 */
function displayWishlist(items, count) {
    const wishlistContent = document.getElementById('wishlist-content');
    const itemCountSpan = document.getElementById('wishlist-item-count');
    const clearBtn = document.getElementById('clear-btn');
    
    itemCountSpan.textContent = count;

    if (!items || items.length === 0) {
        wishlistContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❤️</div>
                <p>Your wishlist is empty</p>
                <p style="font-size: 0.9rem; color: #999;">Start adding items to save them for later!</p>
                <a href="products.html" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Browse Products</a>
            </div>
        `;
        clearBtn.style.display = 'none';
        return;
    }

    // Show clear button
    clearBtn.style.display = 'block';

    // Build wishlist grid
    const grid = document.createElement('div');
    grid.className = 'wishlist-grid';

    items.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.id = `wishlist-${item.id}`;

        const product = item.product;
        const price = product.price || 'N/A';
        const discount = product.discount_percentage ? `<small style="color: #28a745;">-${product.discount_percentage}%</small>` : '';

        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                ${product.thumbnail ? `<img src="${product.thumbnail}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : '📦'}
            </div>
            <div class="wishlist-item-name">${truncateText(product.name, 50)}</div>
            <div class="wishlist-item-price">₹${price} ${discount}</div>
            <div class="wishlist-item-actions">
                <button class="btn-add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${price})">
                    Add to Cart
                </button>
                <button class="btn-remove" onclick="removeFromWishlist('${item.id}', event)" aria-label="Remove ${product.name} from wishlist">
                    🗑️ Remove
                </button>
            </div>
        `;

        grid.appendChild(wishlistItem);
    });

    wishlistContent.innerHTML = '';
    wishlistContent.appendChild(grid);
}

/**
 * Remove item from wishlist
 */
async function removeFromWishlist(wishlistId, event) {
    event.preventDefault();
    
    if (!confirm('Are you sure you want to remove this item from your wishlist?')) {
        return;
    }

    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            showLoginPrompt();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove item');
        }

        // Remove item from DOM with animation
        const itemElement = document.getElementById(`wishlist-${wishlistId}`);
        if (itemElement) {
            itemElement.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                itemElement.remove();
                // Reload wishlist to update count
                loadWishlist();
            }, 300);
        }

        showNotification('Item removed from wishlist', 'success');
    } catch (error) {
        console.error('Error removing item:', error);
        showNotification('Failed to remove item from wishlist', 'error');
    }
}

/**
 * Remove product from wishlist by product ID
 */
async function removeProductFromWishlist(productId) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            showLoginPrompt();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/wishlist/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove item');
        }

        loadWishlist();
        showNotification('Item removed from wishlist', 'success');
    } catch (error) {
        console.error('Error removing product:', error);
        showNotification('Failed to remove item', 'error');
    }
}

/**
 * Clear entire wishlist
 */
async function clearWishlist() {
    if (!confirm('Are you sure you want to clear your entire wishlist? This action cannot be undone.')) {
        return;
    }

    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            showLoginPrompt();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to clear wishlist');
        }

        const data = await response.json();
        loadWishlist();
        showNotification(`Removed ${data.items_removed} items from wishlist`, 'success');
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        showNotification('Failed to clear wishlist', 'error');
    }
}

/**
 * Check if product is in wishlist
 */
async function checkIfInWishlist(productId) {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            return false;
        }

        const response = await fetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data.in_wishlist;
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
    }
}

/**
 * Add to cart (placeholder - connects to cart functionality)
 */
function addToCart(productId, productName, price) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${productName} added to cart`, 'success');
    
    // Update cart count in header
    updateCartCount();
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadges = document.querySelectorAll('#cart-count');
    cartBadges.forEach(badge => {
        badge.textContent = cartCount;
    });
}

/**
 * Display wishlist error
 */
function displayWishlistError(message) {
    const wishlistContent = document.getElementById('wishlist-content');
    wishlistContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <p>${message}</p>
            <button onclick="loadWishlist()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
        </div>
    `;
}

/**
 * Show login prompt
 */
function showLoginPrompt() {
    const wishlistContent = document.getElementById('wishlist-content');
    wishlistContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🔐</div>
            <p>Please log in to view your wishlist</p>
            <button onclick="goToLogin()" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; border: none; cursor: pointer;">Log In</button>
        </div>
    `;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Go to login page
 */
function goToLogin() {
    window.location.href = 'index.html#login';
}

/**
 * Truncate text
 */
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

/**
 * Show section in account page
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Add active class to clicked nav link
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Load section-specific data
    if (sectionId === 'wishlist') {
        loadWishlist();
    }

    return false;
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // If account page is loaded and wishlist section was opened, load wishlist
    if (document.getElementById('wishlist')) {
        // Load initial data if needed
    }
});
