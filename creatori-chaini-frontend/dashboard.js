// this is java iza managing dashboard muri rusange
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupTabNavigation();
    loadDashboardData();
    setupEventListeners();
});


function checkAuthentication() {
    const token = localStorage.getItem('artistToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function setupTabNavigation() {
    const menuItems = document.querySelectorAll('.dashboard-menu li');
    const tabContents = document.querySelectorAll('.tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
          
            menuItems.forEach(i => i.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}


async function loadDashboardData() {
    try {
        const artistId = localStorage.getItem('artistId');
        const dashboardData = await fetchDashboardData(artistId);
        
        updateOverviewStats(dashboardData.stats);
        updateRecentActivity(dashboardData.recentActivity);
        loadArtworks(dashboardData.artworks);
        loadSales(dashboardData.sales);
        updateEarnings(dashboardData.earnings);
        loadProfile(dashboardData.profile);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please refresh the page.');
    }
}


function setupEventListeners() {
 
    document.getElementById('addArtworkBtn')?.addEventListener('click', () => {
        const modal = document.getElementById('addArtworkModal');
        modal.style.display = 'block';
    });

   
    document.querySelector('.close')?.addEventListener('click', () => {
        document.getElementById('addArtworkModal').style.display = 'none';
    });

    
    document.getElementById('addArtworkForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleAddArtwork();
    });

    document.getElementById('profileSettingsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleUpdateProfile();
    });

  
    document.getElementById('withdrawBtn')?.addEventListener('click', () => {
        initiateWithdrawal();
    });
}


function updateOverviewStats(stats) {
    document.getElementById('totalSales').textContent = stats.totalSales;
    document.getElementById('activeListings').textContent = stats.activeListings;
    document.getElementById('totalEarnings').textContent = `${formatPrice(stats.totalEarnings)} RWF`;
    document.getElementById('profileViews').textContent = stats.profileViews;
}


function updateRecentActivity(activities) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <p>${activity.message}</p>
            <small>${formatDate(activity.timestamp)}</small>
        </div>
    `).join('');
}

function loadArtworks(artworks) {
    const artworksList = document.getElementById('artworksList');
    artworksList.innerHTML = artworks.map(artwork => `
        <div class="artwork-card">
            <img src="${artwork.image}" alt="${artwork.title}">
            <div class="artwork-info">
                <h3>${artwork.title}</h3>
                <p class="price">${formatPrice(artwork.price)} RWF</p>
                <p class="status">${artwork.status}</p>
                <div class="artwork-actions">
                    <button onclick="editArtwork(${artwork.id})">Edit</button>
                    <button onclick="deleteArtwork(${artwork.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadSales(sales) {
    const salesList = document.getElementById('salesList');
    salesList.innerHTML = sales.map(sale => `
        <div class="sale-item">
            <div class="sale-info">
                <h4>${sale.artwork}</h4>
                <p>Sold to: ${sale.buyer}</p>
                <small>${formatDate(sale.date)}</small>
            </div>
            <div class="sale-amount">
                ${formatPrice(sale.amount)} RWF
            </div>
        </div>
    `).join('');
}


function updateEarnings(earnings) {
    document.getElementById('availableBalance').textContent = `${formatPrice(earnings.available)} RWF`;
}


function loadProfile(profile) {
    document.getElementById('displayName').value = profile.name;
    document.getElementById('bio').value = profile.bio;
    document.getElementById('email').value = profile.email;
    if (profile.image) {
        document.getElementById('artistImage').src = profile.image;
    }
}


async function handleAddArtwork() {
    const form = document.getElementById('addArtworkForm');
    const formData = new FormData(form);

    try {
        const response = await addArtwork(formData);
        if (response.success) {
            showSuccess('Artwork added successfully');
            document.getElementById('addArtworkModal').style.display = 'none';
            loadArtworks(response.artworks);
        } else {
            showError(response.message);
        }
    } catch (error) {
        console.error('Error adding artwork:', error);
        showError('Failed to add artwork. Please try again.');
    }
}


async function handleUpdateProfile() {
    const form = document.getElementById('profileSettingsForm');
    const formData = new FormData(form);

    try {
        const response = await updateProfile(formData);
        if (response.success) {
            showSuccess('Profile updated successfully');
            loadProfile(response.profile);
        } else {
            showError(response.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showError('Failed to update profile. Please try again.');
    }
}

async function initiateWithdrawal() {
    try {
        const amount = await promptWithdrawalAmount();
        if (!amount) return;

        const response = await processWithdrawal(amount);
        if (response.success) {
            showSuccess('Withdrawal initiated successfully');
            updateEarnings(response.earnings);
        } else {
            showError(response.message);
        }
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        showError('Failed to process withdrawal. Please try again.');
    }
}

async function fetchDashboardData(artistId) {
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                stats: {
                    totalSales: 25,
                    activeListings: 10,
                    totalEarnings: 750000,
                    profileViews: 1200
                },
                recentActivity: [
                    {
                        message: "New artwork sold: 'Abstract Harmony'",
                        timestamp: new Date()
                    },
                   
                ],
                artworks: [
                    {
                        id: 1,
                        title: "Abstract Harmony",
                        price: 150000,
                        status: "Available",
                        image: "images/artwork1.jpg"
                    },
                   
                ],
                sales: [
                    {
                        artwork: "Abstract Harmony",
                        buyer: "John Smith",
                        amount: 150000,
                        date: new Date()
                    },
                    
                ],
                earnings: {
                    available: 500000
                },
                profile: {
                    name: "Jane Doe",
                    bio: "Contemporary artist specializing in abstract art",
                    email: "jane@example.com",
                    image: "images/artist1.jpg"
                }
            });
        }, 1000);
    });
}

async function addArtwork(formData) {
  
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Artwork added successfully',
                artworks: [] // Updated artworks list
            });
        }, 1000);
    });
}

async function updateProfile(formData) {
   
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Profile updated successfully',
                profile: {} // Updated profile data
            });
        }, 1000);
    });
}

async function processWithdrawal(amount) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Withdrawal processed successfully',
                earnings: {
                    available: 0 // Updated earnings
                }
            });
        }, 1000);
    });
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('rw-RW').format(price);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showError(message) {
    // Implement error notification
    alert(message);
}

function showSuccess(message) {
    // Implement success notification
    alert(message);
}

function promptWithdrawalAmount() {
    return new Promise((resolve) => {
        const amount = prompt('Enter withdrawal amount (RWF):');
        if (amount === null) {
            resolve(null);
        } else {
            resolve(parseFloat(amount));
        }
    });
}
