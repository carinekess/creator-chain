// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('artistToken');
    if (token) {
        // Update navigation for logged-in users
        const navLinks = document.querySelector('.nav-links');
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="gallery.html">Gallery</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('artistToken');
    localStorage.removeItem('artistId');
    window.location.href = 'index.html';
}

// Load featured artists
async function loadFeaturedArtists() {
    try {
        // This would be replaced with actual API call
        const featuredArtists = [
            {
                id: 1,
                name: "Ivan Ishimwe",
                image: "image 1.jpg",
                specialty: "Abstract Art"
            },
            {
                id: 2,
                name: "Cansilida Munyankindi",
                image: "image 2.jpg",
                specialty: "Nature Photography"
            }
            // Add more featured artists
        ];

        const artistGrid = document.getElementById('featuredArtists');
        if (artistGrid) {
            artistGrid.innerHTML = featuredArtists.map(artist => `
                <div class="artist-card">
                    <img src="${artist.image}" alt="${artist.name}">
                    <h3>${artist.name}</h3>
                    <p>${artist.specialty}</p>
                    <a href="gallery.html?artist=${artist.id}" class="view-works">View Works</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured artists:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadFeaturedArtists();
});
