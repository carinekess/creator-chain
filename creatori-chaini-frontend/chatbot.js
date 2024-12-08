// Chatbot training model
const chatbotResponses = {
    platform_info: {
        patterns: ['artista ni iki', 'ikora iki', 'guteza imbere', 'platform', 'about artista'],
        responses: [
            'Artista ni urubuga ngenderwaho mu guteza imbere ubuhanzi nyarwanda. Dufasha abahanzi kugera ku bakiriya no kwagura ubumenyi bwabo.',
            'Artista ni urubuga rufasha abahanzi b\'abanyarwanda kugera ku isoko mpuzamahanga no guteza imbere ubuhanzi bwabo.',
            'Platform yacu ifasha abahanzi kugera ku bakiriya, kwagura ubumenyi no guhana ibitekerezo n\'abandi bahanzi.'
        ]
    },
    account_management: {
        patterns: ['kwiyandikisha', 'konti', 'guhindura amakuru', 'account', 'register'],
        responses: [
            'Kwiyandikisha ni byoroshye: 1) Kanda "Sign Up" 2) Uzuza amakuru yawe 3) Emeza konti yawe.',
            'Ushobora guhindura amakuru ya konti yawe unyuze kuri "Profile Settings".',
            'Konti yawe igufasha gucuruza no kugera ku bakiriya bawe byoroshye.'
        ]
    },
    selling_art: {
        patterns: ['kugurisha', 'ibiciro', 'abakiriya', 'gukurikirana', 'price', 'sell'],
        responses: [
            'Dufite uburyo bworoshye bwo gushyiraho ibiciro no gucuruza ibihangano byawe.',
            'Ushobora gukurikirana ibyaguzwe binyuze kuri dashboard yawe.',
            'Tugufasha kubona abakiriya binyuze mu kwamamaza no guteza imbere ibihangano byawe.'
        ]
    },
    payments: {
        patterns: ['kwishyurwa', 'ubwishyu', 'payment', 'money'],
        responses: [
            'Twakira ubwishyu mu buryo butandukanye harimo Mobile Money, Bank Transfer na PayPal.',
            'Ubwishyu bukorwa mu buryo bwizewe kandi bwihuse.',
            'Ushobora gukurikirana ubwishyu bwawe binyuze kuri dashboard yawe.'
        ]
    },
    community: {
        patterns: ['mmenyane', 'guhanahana', 'ubumenyi', 'community', 'connect'],
        responses: [
            'Artista itegura inama n\'ibiganiro by\'abahanzi buri kwezi.',
            'Ushobora guhuza n\'abandi bahanzi ukoresheje forum yacu.',
            'Dufite uburyo bwo guhana ubumenyi n\'abandi bahanzi kuri platform.'
        ]
    },
    promotion: {
        patterns: ['kwamamaza', 'imbuga nkoranyambaga', 'amafoto', 'promotion'],
        responses: [
            'Tugufasha kwamamaza ibihangano byawe ku mbuga nkoranyambaga.',
            'Dutanga ubufasha mu gufata amafoto n\'amashusho y\'ibihangano byawe.',
            'Dufite uburyo bwihariye bwo guteza imbere ibihangano byawe.'
        ]
    },
    legal: {
        patterns: ['amategeko', 'amabwiriza', 'uburenganzira', 'legal', 'rights'],
        responses: [
            'Buri gihe turinda uburenganzira bw\'abahanzi ku bihangano byabo.',
            'Dufite amabwiriza agenderwaho mu kurinda ibihangano.',
            'Ushobora kumenyekanisha ikoreshwa ribi ry\'ibihangano byawe.'
        ]
    },
    training: {
        patterns: ['amahugurwa', 'iterambere', 'impano', 'training', 'skills'],
        responses: [
            'Dutanga amahugurwa ku bijyanye no guteza imbere impano.',
            'Dufite gahunda zo gufasha abahanzi batangiye.',
            'Tubafasha kwiga ibyerekeye isoko ry\'ubuhanzi mpuzamahanga.'
        ]
    }
};

// Chatbot functionality
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbox = document.getElementById('chatbox');
const closeChatBtn = document.getElementById('closeChatBtn');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');

function findBestMatch(message) {
    const currentLang = window.getCurrentLang();
    const translations = window.getTranslations();
    const categories = translations[currentLang].chatbot.categories;
    
    message = message.toLowerCase();
    let bestMatch = null;
    let highestMatchCount = 0;

    for (const category in categories) {
        const patterns = categories[category].patterns;
        let matchCount = 0;

        for (const pattern of patterns) {
            if (message.includes(pattern.toLowerCase())) {
                matchCount++;
            }
        }

        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            bestMatch = category;
        }
    }

    if (bestMatch) {
        const responses = categories[bestMatch].responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    return translations[currentLang].chatbot.fallback;
}

function addMessage(message, isUser = false) {
    const messagesDiv = document.querySelector('.chatbox-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearChat() {
    const currentLang = window.getCurrentLang();
    const translations = window.getTranslations();
    const messagesDiv = document.querySelector('.chatbox-messages');
    messagesDiv.innerHTML = `<div class="message bot">${translations[currentLang].chatbot.greeting}</div>`;
    messageInput.value = '';
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, true);
        messageInput.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = findBestMatch(message);
            addMessage(response);
        }, 1000);
    }
}

chatbotBtn.addEventListener('click', function() {
    chatbox.classList.remove('hidden');
});

closeChatBtn.addEventListener('click', function() {
    chatbox.classList.add('hidden');
    // Clear chat after a brief delay to allow for closing animation
    setTimeout(clearChat, 300);
});

sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize chat with welcome message when the page loads
clearChat();
