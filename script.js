// Global variable to hold selected language
let language = "en";

// Translations for multilingual support
const translations = {
    en: {
        greeting: "Hi, my name is Igor!",
        description: "I am an industrial automation specialist with a strong passion for new technologies and software development.<br>Below, you will find a selection of personal projects that I have worked on.",
        languages: "Languages: ",
        moreDetails: "Click for more details",
        repoNameUnavailable: "Name not available",
        repoDescriptionUnavailable: "Description not available",
        languageUnavailable: "No languages available",
        copiedSuccessfully: "Email address copied to clipboard!",
        failedCopy: "Failed to copy email address:",
        catMessage: "Free software<br>for a free society"
    },
    pt: {
        greeting: "Olá, meu nome é Igor!",
        description: "Sou um especialista em automação industrial com uma forte paixão por novas tecnologias e desenvolvimento de software.<br>Abaixo, você encontrará uma seleção de projetos pessoais em que trabalhei.",
        languages: "Linguagens: ",
        moreDetails: "Clique para mais detalhes",
        repoNameUnavailable: "Nome não disponível",
        repoDescriptionUnavailable: "Descrição não disponível",
        languageUnavailable: "Nenhuma linguagem disponível",
        copiedSuccessfully: "Endereço de email copiado para área de transferência!",
        failedCopy: "Falha ao copiar o endereço de e-mail:",
        catMessage: "Software livre<br>para uma sociedade livre"
    },
    es: {
        greeting: "¡Hola, mi nombre es Igor!",
        description: "Soy un especialista en automatización industrial con una gran pasión por las nuevas tecnologías y el desarrollo de software.<br>A continuación, encontrarás una selección de proyectos personales en los que he trabajado.",
        languages: "Lenguajes: ",
        moreDetails: "Haz clic para más detalles",
        repoNameUnavailable: "Nombre no disponible",
        repoDescriptionUnavailable: "Descripción no disponible",
        languageUnavailable: "No hay lenguajes disponibles",
        copiedSuccessfully: "¡Dirección de correo electrónico copiada al portapapeles!",
        failedCopy: "Error al copiar la dirección de correo electrónico:",
        catMessage: "Software libre<br>para una sociedad libre"
    }
};

// Global variables to hold fetched repositories and their languages
let repositories = [];
let repositoryLanguages = {};

// Initialize user language based on browser settings
let userLang = navigator.language || navigator.userLanguage;
userLang = userLang.split('-')[0];
language = translations[userLang] ? userLang : 'en';

// Event listener for copying text to clipboard
document.getElementById('copyButton').addEventListener('click', copyTextToClipboard);

// Function to copy text to clipboard
function copyTextToClipboard() {
    const text = document.getElementById('textToCopy').innerText;
    navigator.clipboard.writeText(text)
        .then(() => alert(translations[language].copiedSuccessfully))
        .catch(err => alert(translations[language].failedCopy + err));
}

// Fetch repositories from GitHub when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchRepositories);

// Function to fetch repositories from GitHub
async function fetchRepositories() {
    try {
        const response = await fetch('https://api.github.com/users/igorcoraine/repos?sort=updated');
        
        if (!response.ok) throw new Error('Error fetching repositories:', response.statusText);
        
        repositories = await response.json();
        
        // Fetch languages for all repositories in parallel
        await Promise.all(repositories.map(fetchRepositoryLanguages));
        
        displayRepositories(repositories);
    } catch (error) {
        console.error(error);
    }
}

// Function to fetch languages for a repository
async function fetchRepositoryLanguages(repo) {
    try {
        const response = await fetch(repo.languages_url);
        
        if (response.ok) {
            const languagesData = await response.json();
            repositoryLanguages[repo.id] = Object.keys(languagesData);
        }
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
}

// Function to display repositories on the page
function displayRepositories(repos) {
    const repoList = document.getElementById('my_repos');
    repoList.innerHTML = ''; // Clear existing content

    repos.forEach(repo => {
        const repoLink = createRepositoryLink(repo);
        repoList.appendChild(repoLink);
    });
}

// Function to create a repository link element
function createRepositoryLink(repo) {
    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";

    const repoName = document.createElement('h3');
    repoName.innerHTML = repo.name || translations[language].repoNameUnavailable;

    const repoDescription = document.createElement('p');
    repoDescription.textContent = repo.description || translations[language].repoDescriptionUnavailable;

    const repoLanguagesText = document.createElement('p');
    const languages = repositoryLanguages[repo.id] || [];
    repoLanguagesText.textContent = translations[language].languages + languages.join(', ') || translations[language].languageUnavailable;

    const moreDetails = document.createElement('p');
    moreDetails.textContent = translations[language].moreDetails;

    // Append elements to the link
    [repoName, repoDescription, repoLanguagesText, moreDetails].forEach(element => repoLink.appendChild(element));

    return repoLink;
}

// Follower effect on mouse movement
const follower = document.getElementById('follower');
document.addEventListener('mousemove', (event) => {
    follower.style.transform = `translate3d(${event.pageX}px, ${event.pageY}px, 0)`;
});

// Update text based on selected language
function updateText(lang) {
    language = lang;
    
    document.getElementById('greeting').innerText = translations[lang].greeting;
    document.getElementById('description').innerHTML = translations[lang].description;
    document.getElementById('cat-message').innerHTML = translations[lang].catMessage;

    displayRepositories(repositories); // Re-display repositories with updated translations

    // Update check icon according to selected language
    document.querySelectorAll('.check-icon').forEach(icon => icon.style.display = 'none'); // Hide all icons
    document.getElementById(`check-${lang}`).style.display = 'inline'; // Show selected language icon
}

// Handle language selection from dropdown
document.querySelectorAll('.language-option').forEach(button => {
    button.addEventListener('click', () => updateText(button.getAttribute('data-lang')));
});

// Initialize text based on browser language
updateText(userLang);

// Floating cat message functionality
document.getElementById('floating-cat').addEventListener('click', toggleCatMessage);

// Function to toggle cat message visibility
function toggleCatMessage() {
    const messageDiv = document.getElementById('cat-message');
    
    if (messageDiv.style.display === 'none') {
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none'; // Hide after 3 seconds
        }, 3000);
    }
}

// Check if the device is mobile
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

const floatingImage = document.getElementById('floating-cat');

// Mobile-specific behavior for floating image visibility based on scroll position
if (isMobile()) {
    document.addEventListener('scroll', () => {
        floatingImage.style.display = window.scrollY > 150 ? 'block' : 'none';
    });
} else {
    floatingImage.style.display = 'block'; // Always show on desktop
}
