// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    loadArtworks();
    setupFilters();
});

// Load artworks
async function loadArtworks(filters = {}) {
    try {
        // This would be replaced with actual API call
        const artworks = await fetchArtworks(filters);
        displayArtworks(artworks);
    } catch (error) {
        console.error('Error loading artworks:', error);
        showError('Failed to load artworks. Please try again later.');
    }
}

// Setup filter listeners
function setupFilters() {
    const searchInput = document.getElementById('searchArt');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    // Debounce search input
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 500);
    });

    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
}

// Apply filters
function applyFilters() {
    const searchQuery = document.getElementById('searchArt').value;
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;

    loadArtworks({
        search: searchQuery,
        category,
        priceRange
    });
}

// Display artworks in grid
function displayArtworks(artworks) {
    const grid = document.getElementById('artworkGrid');
    grid.innerHTML = artworks.map(artwork => `
        <div class="artwork-card" data-id="${artwork.id}">
            <div class="artwork-image">
                <img src="${artwork.image}" alt="${artwork.title}">
            </div>
            <div class="artwork-info">
                <h3>${artwork.title}</h3>
                <p class="artist">${artwork.artist}</p>
                <p class="price">${formatPrice(artwork.price)} RWF</p>
                <div class="artwork-actions">
                    <button class="view-details" onclick="openArtworkModal(${artwork.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open artwork modal
async function openArtworkModal(artworkId) {
    try {
        const artwork = await fetchArtworkDetails(artworkId);
        const modal = document.getElementById('artworkModal');
        
        document.getElementById('modalImage').src = artwork.image;
        document.getElementById('modalTitle').textContent = artwork.title;
        document.getElementById('modalArtist').textContent = `By ${artwork.artist}`;
        document.getElementById('modalDescription').textContent = artwork.description;
        document.getElementById('modalPrice').textContent = `${formatPrice(artwork.price)} RWF`;

        modal.style.display = 'block';

        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };

        // Close modal when clicking X
        document.querySelector('.close').onclick = closeModal;
    } catch (error) {
        console.error('Error loading artwork details:', error);
        showError('Failed to load artwork details. Please try again later.');
    }
}

// Close modal
function closeModal() {
    document.getElementById('artworkModal').style.display = 'none';
}

// Payment distribution percentages
const PAYMENT_DISTRIBUTION = {
    ARTIST_FIRST_SALE: 85, // Artist gets 85% on first sale
    PLATFORM_FIRST_SALE: 15, // Platform gets 15% on first sale
    ARTIST_RESALE: 10, // Artist gets 10% on resales
    SELLER_RESALE: 80, // Seller gets 80% on resales
    PLATFORM_RESALE: 10 // Platform gets 10% on resales
};

// Initiate payment
async function initiatePayment() {
    const paymentMethod = await selectPaymentMethod();
    if (!paymentMethod) return;

    try {
        const artworkId = document.querySelector('.modal-content').dataset.artworkId;
        const artwork = await fetchArtworkDetails(artworkId);
        
        // Process payment with revenue sharing
        const response = await processPayment({
            artworkId: artwork.id,
            price: artwork.price,
            paymentMethod,
            isResale: artwork.previousOwners && artwork.previousOwners.length > 0
        });

        if (response.success) {
            showSuccess('Payment successful! The funds have been distributed.');
            closeModal();
            
            // Update artwork ownership
            await updateArtworkOwnership(artwork.id);
        } else {
            showError('Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showError('An error occurred during payment. Please try again.');
    }
}

// Process payment with revenue sharing
async function processPayment({ artworkId, price, paymentMethod, isResale }) {
    // Calculate payment distribution
    const distribution = calculatePaymentDistribution(price, isResale);
    
    try {
        // Process the payment based on the payment method
        const paymentResult = await processPaymentTransaction(paymentMethod, price);
        
        if (paymentResult.success) {
            // Distribute the funds
            await distributeFunds({
                artworkId,
                distribution,
                paymentMethod,
                transactionId: paymentResult.transactionId
            });
            
            return {
                success: true,
                message: 'Payment processed and funds distributed successfully'
            };
        }
        
        return {
            success: false,
            message: 'Payment processing failed'
        };
    } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
    }
}

// Calculate payment distribution
function calculatePaymentDistribution(price, isResale) {
    if (isResale) {
        return {
            artist: (price * PAYMENT_DISTRIBUTION.ARTIST_RESALE) / 100,
            seller: (price * PAYMENT_DISTRIBUTION.SELLER_RESALE) / 100,
            platform: (price * PAYMENT_DISTRIBUTION.PLATFORM_RESALE) / 100
        };
    }
    
    return {
        artist: (price * PAYMENT_DISTRIBUTION.ARTIST_FIRST_SALE) / 100,
        platform: (price * PAYMENT_DISTRIBUTION.PLATFORM_FIRST_SALE) / 100
    };
}

// Distribute funds to all parties
async function distributeFunds({ artworkId, distribution, paymentMethod, transactionId }) {
    const transfers = [];
    
    // Artist payment
    if (distribution.artist > 0) {
        transfers.push(transferFunds({
            amount: distribution.artist,
            recipient: 'artist',
            artworkId,
            paymentMethod,
            transactionId
        }));
    }
    
    // Seller payment (for resales)
    if (distribution.seller > 0) {
        transfers.push(transferFunds({
            amount: distribution.seller,
            recipient: 'seller',
            artworkId,
            paymentMethod,
            transactionId
        }));
    }
    
    // Platform fee
    if (distribution.platform > 0) {
        transfers.push(transferFunds({
            amount: distribution.platform,
            recipient: 'platform',
            artworkId,
            paymentMethod,
            transactionId
        }));
    }
    
    // Wait for all transfers to complete
    await Promise.all(transfers);
}

// Transfer funds to a specific recipient
async function transferFunds({ amount, recipient, artworkId, paymentMethod, transactionId }) {
    // This would be replaced with actual payment gateway integration
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Transferred ${amount} RWF to ${recipient} for artwork ${artworkId}`);
            resolve({
                success: true,
                recipient,
                amount,
                transactionId
            });
        }, 1000);
    });
}

// Update artwork ownership after successful purchase
async function updateArtworkOwnership(artworkId) {
    try {
        const response = await fetch('/api/artworks/update-ownership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                artworkId,
                newOwnerId: localStorage.getItem('userId'),
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update artwork ownership');
        }
    } catch (error) {
        console.error('Error updating artwork ownership:', error);
        // Continue anyway as the payment was successful
    }
}

// Select payment method
function selectPaymentMethod() {
    return new Promise((resolve) => {
        const methods = ['mtn', 'airtel', 'paypal'];
        const buttons = methods.map(method => `
            <button onclick="resolve('${method}')">${method.toUpperCase()}</button>
        `).join('');

        const modal = document.createElement('div');
        modal.className = 'payment-method-modal';
        modal.innerHTML = `
            <div class="payment-method-content">
                <h3>Select Payment Method</h3>
                ${buttons}
                <button onclick="resolve(null)">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);
    });
}

// Mock API calls (replace with actual API calls)
async function fetchArtworks(filters = {}) {
    // Simulate API call with real images
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: "Abstract Harmony",
                    artist: "Ivan Ishimwe",
                    price: 150000,
                    image: "image 1.jpg",
                    description: "A vibrant abstract piece showcasing dynamic colors and movement.",
                    category: "painting"
                },
                {
                    id: 2,
                    title: "Nature's Serenity",
                    artist: "Cansilida Munyankindi",
                    price: 250000,
                    image: "image 2.jpg",
                    description: "A peaceful landscape capturing the beauty of Rwanda's natural scenery.",
                    category: "photography"
                },
                {
                    id: 3,
                    title: "Urban Dreams",
                    artist: "David Wilson",
                    price: 180000,
                    image: "image 3.jpg",
                    description: "A contemporary piece reflecting modern urban life and culture.",
                    category: "digital"
                },
                {
                    id: 4,
                    title: "Cultural Heritage",
                    artist: "Sarah Johnson",
                    price: 300000,
                    image: "image 4.jpg",
                    description: "A powerful representation of Rwanda's rich cultural heritage.",
                    category: "painting"
                }
            ]);
        }, 1000);
    });
}

async function fetchArtworkDetails(artworkId) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: artworkId,
                title: "Abstract Harmony",
                artist: "Ivan Ishimwe",
                price: 150000,
                image: "image 1.jpg",
                description: "A beautiful abstract piece showcasing the harmony of colors and shapes."
            });
        }, 500);
    });
}

async function processPaymentTransaction(paymentMethod, price) {
    // Simulate payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: '1234567890'
            });
        }, 1500);
    });
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('rw-RW').format(price);
}

function showError(message) {
    // Implement error notification
    alert(message);
}

function showSuccess(message) {
    // Implement success notification
    alert(message);
}
