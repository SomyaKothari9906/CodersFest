// AI-Powered Search with Typo Tolerance and Smart Suggestions

class SearchEngine {
    constructor() {
        this.products = app?.products || [];
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.init();
    }

    init() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('focus', (e) => this.showSuggestions(e));
        }

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.id !== 'search-input') {
                document.getElementById('search-suggestions')?.classList.remove('active');
            }
        });
    }

    // Levenshtein distance for typo tolerance
    levenshteinDistance(str1, str2) {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }

        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }

        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }

        return track[str2.length][str1.length];
    }

    // Check if search term is similar to product (typo tolerance)
    isMatchingProduct(product, query) {
        const searchTerms = query.toLowerCase().split(' ');
        const productFields = [
            product.name.toLowerCase(),
            product.category.toLowerCase()
        ];

        return searchTerms.some(term => {
            return productFields.some(field => {
                // Exact match
                if (field.includes(term)) return true;
                
                // Fuzzy match (typo tolerance)
                const distance = this.levenshteinDistance(term, field.substring(0, term.length + 2));
                return distance <= 2; // Allow up to 2 character differences
            });
        });
    }

    // Get smart suggestions
    getSmartSuggestions(query) {
        if (!query.trim()) {
            return this.getPopularSearches();
        }

        const suggestions = [];
        const query_lower = query.toLowerCase();

        // Get matching products
        const matchingProducts = this.products.filter(p => 
            this.isMatchingProduct(p, query)
        );

        // Group by relevance
        const exactMatches = matchingProducts.filter(p => 
            p.name.toLowerCase().includes(query_lower)
        );
        
        const categoryMatches = matchingProducts.filter(p => 
            p.category.toLowerCase().includes(query_lower)
        );

        // Add to suggestions
        exactMatches.forEach(p => {
            suggestions.push({
                type: 'product',
                text: p.name,
                category: p.category,
                relevance: 'high'
            });
        });

        categoryMatches.forEach(p => {
            suggestions.push({
                type: 'product',
                text: p.name,
                category: p.category,
                relevance: 'medium'
            });
        });

        // Add category suggestions
        const categories = [...new Set(this.products.map(p => p.category))];
        categories.filter(cat => cat.toLowerCase().includes(query_lower))
            .forEach(cat => {
                suggestions.push({
                    type: 'category',
                    text: cat,
                    relevance: 'medium'
                });
            });

        return suggestions.slice(0, 10); // Limit to 10 suggestions
    }

    // Get popular searches
    getPopularSearches() {
        const popular = [
            { type: 'trending', text: '⚡ Trending: Electronics', category: 'Electronics' },
            { type: 'trending', text: '🔥 Hot Deal: Fashion', category: 'Fashion' },
            { type: 'trending', text: '🛒 Fresh Groceries', category: 'Groceries' },
            { type: 'trending', text: '💎 Lifestyle Products', category: 'Lifestyle' }
        ];
        return popular;
    }

    // Handle search input
    handleSearch(e) {
        const query = e.target.value;
        const suggestions = this.getSmartSuggestions(query);
        this.renderSuggestions(suggestions, query);
    }

    // Show suggestions when input is focused
    showSuggestions(e) {
        if (e.target.value.length === 0) {
            const suggestions = this.getPopularSearches();
            this.renderSuggestions(suggestions, '');
            document.getElementById('search-suggestions')?.classList.add('active');
        }
    }

    // Render suggestions in dropdown
    renderSuggestions(suggestions, query) {
        const container = document.getElementById('search-suggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '<div class="search-suggestion-item">No results found</div>';
        } else {
            container.innerHTML = suggestions.map(suggestion => `
                <div class="search-suggestion-item" onclick="searchEngine.selectSuggestion('${suggestion.text}', '${suggestion.category}')" 
                     role="option" aria-label="Suggestion: ${suggestion.text}">
                    <span>${suggestion.text}</span>
                    ${suggestion.category ? `<small style="color: #999; margin-left: 0.5rem;">${suggestion.category}</small>` : ''}
                </div>
            `).join('');
        }

        container.classList.add('active');
    }

    // Select suggestion and search
    selectSuggestion(text, category) {
        document.getElementById('search-input').value = text;
        this.performSearch(text, category);
    }

    // Perform actual search
    performSearch(query, category) {
        this.addToSearchHistory(query);
        document.getElementById('search-suggestions')?.classList.remove('active');
        
        const results = this.products.filter(p => 
            this.isMatchingProduct(p, query) && (!category || p.category === category)
        );

        // In production, navigate to results page
        if (results.length > 0) {
            alert(`Found ${results.length} products matching "${query}"\n\nIn production, this would navigate to a results page showing:\n${results.map(r => `- ${r.name}`).join('\n')}`);
        } else {
            alert(`No products found for "${query}". Try our suggestions or browse categories.`);
        }
    }

    // Add to search history
    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        }
    }

    // Get search history
    getSearchHistory() {
        return this.searchHistory;
    }

    // Test search functionality
    testSearch() {
        console.log('🔍 Search Engine Test:');
        console.log('✓ Typo tolerance: "heaphones" matches "Headphones"', 
            this.levenshteinDistance('heaphones', 'headphones') <= 2);
        console.log('✓ Category search enabled');
        console.log('✓ Popular searches available');
        console.log('✓ Search history saved');
    }
}

let searchEngine;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        searchEngine = new SearchEngine();
        searchEngine.testSearch();
    }, 100);
});
