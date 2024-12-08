// Language translations
const translations = {
    en: {
        welcome: {
            title: "Welcome to Artista",
            subtitle: "Discover and Connect with Rwandan Artists",
            continue: "Continue",
            signup: "Sign Up",
            login: "Login"
        },
        chatbot: {
            greeting: "Welcome to Artista! You can ask questions about:\n\n" +
                "1. About Artista and how it works\n" +
                "2. Registration and account management\n" +
                "3. Selling and payments\n" +
                "4. Collaborating with other artists\n" +
                "5. Promoting artwork\n" +
                "6. Rules and guidelines\n" +
                "7. Training and development",
            placeholder: "Type your message...",
            assistant: "Artista Assistant",
            send: "Send",
            categories: {
                platform_info: {
                    patterns: ["what is artista", "how does it work", "platform"],
                    responses: [
                        "Artista is a platform dedicated to promoting Rwandan art. We help artists reach customers and expand their knowledge.",
                        "Artista helps Rwandan artists reach international markets and develop their art.",
                        "Our platform helps artists reach customers, expand knowledge, and connect with other artists."
                    ]
                }
            }
        }
    },
    rw: {
        welcome: {
            title: "Murakaza neza kuri Artista",
            subtitle: "Menya kandi Uhure n'Abahanzi b'Abanyarwanda",
            continue: "Komeza",
            signup: "Iyandikishe",
            login: "Injira"
        },
        chatbot: {
            greeting: "Murakaza neza kuri Artista! Mushobora kubaza ibibazo ku byerekeye:\n\n" +
                "1. Ibyerekeye Artista n'uburyo ikora\n" +
                "2. Kwiyandikisha no gucunga konti\n" +
                "3. Kugurisha no kwishyurwa\n" +
                "4. Gukorana n'abandi bahanzi\n" +
                "5. Kwamamaza ibihangano\n" +
                "6. Amategeko n'amabwiriza\n" +
                "7. Amahugurwa n'iterambere",
            placeholder: "Andika ubutumwa bwawe...",
            assistant: "Umufasha wa Artista",
            send: "Ohereza",
            categories: {
                platform_info: {
                    patterns: ["artista ni iki", "ikora iki", "platform"],
                    responses: [
                        "Artista ni urubuga ngenderwaho mu guteza imbere ubuhanzi nyarwanda. Dufasha abahanzi kugera ku bakiriya no kwagura ubumenyi bwabo.",
                        "Artista ni urubuga rufasha abahanzi b'abanyarwanda kugera ku isoko mpuzamahanga no guteza imbere ubuhanzi bwabo.",
                        "Platform yacu ifasha abahanzi kugera ku bakiriya, kwagura ubumenyi no guhana ibitekerezo n'abandi bahanzi."
                    ]
                }
            }
        }
    }
};

// Current language
let currentLang = 'en';

// DOM Elements
const languageBtn = document.getElementById('languageBtn');
const languageDropdown = document.querySelector('.language-dropdown');
const currentLangSpan = document.querySelector('.current-lang');
const languageOptions = document.querySelectorAll('.language-option');

// Toggle language dropdown
languageBtn.addEventListener('click', () => {
    languageDropdown.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!languageBtn.contains(e.target)) {
        languageDropdown.classList.add('hidden');
    }
});

// Language selection
languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        setLanguage(lang);
        languageDropdown.classList.add('hidden');
    });
});

// Set language and update content
function setLanguage(lang) {
    currentLang = lang;
    currentLangSpan.textContent = lang.toUpperCase();
    updateContent();
    
    // Update chatbot content
    if (typeof clearChat === 'function') {
        clearChat();
    }
}

// Update page content based on selected language
function updateContent() {
    const content = translations[currentLang].welcome;
    document.querySelector('.welcome-title').textContent = content.title;
    document.querySelector('.welcome-subtitle').textContent = content.subtitle;
    document.querySelector('#continueBtn').textContent = content.continue;
    
    // Update auth buttons if they exist
    const signupBtn = document.querySelector('.signup-btn');
    const loginBtn = document.querySelector('.login-btn');
    if (signupBtn) signupBtn.textContent = content.signup;
    if (loginBtn) loginBtn.textContent = content.login;
    
    // Update chatbot elements
    const chatContent = translations[currentLang].chatbot;
    const messageInput = document.querySelector('#messageInput');
    const assistantTitle = document.querySelector('.chatbox-header h3');
    if (messageInput) messageInput.placeholder = chatContent.placeholder;
    if (assistantTitle) assistantTitle.textContent = chatContent.assistant;
}

// Export for chatbot.js
window.getCurrentLang = () => currentLang;
window.getTranslations = () => translations;

// Initialize content
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
});
