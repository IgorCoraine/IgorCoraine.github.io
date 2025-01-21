let language = "en"; // Global variable to hold language selected
// Copy text to clipboard
document.getElementById('copyButton').addEventListener('click', function() {
    const text = document.getElementById('textToCopy').innerText; // Get text
    navigator.clipboard.writeText(text) // Copy to clipboard
        .then(() => {
            alert(translations[language].copiedSuccessfuly); // Alert on success 
        })
        .catch(err => {
            alert(translations[language].failedCopy + err); // Alert on failure
        });
 });
 
 // Get repositories from my GitHub
 let repositories = []; // Global variable to hold fetched repositories
 let repositoryLanguages = {}; // Object to hold languages for each repository
 
 async function fetchRepositories() {
    const response = await fetch('https://api.github.com/users/igorcoraine/repos?sort=updated');
    
    if (!response.ok) {
        console.error('Error fetching repositories:', response.statusText);
        return;
    }
 
    repositories = await response.json(); // Store fetched repositories
    // Fetch languages for all repositories in parallel
    const languagePromises = repositories.map(repo => 
        fetch(repo.languages_url)
            .then(response => response.json())
            .then(languagesData => {
                repositoryLanguages[repo.id] = Object.keys(languagesData); // Store languages by repo ID
            })
            .catch(error => console.error('Error fetching languages:', error))
    );

    await Promise.all(languagePromises); // Wait for all language fetches to complete

    displayRepositories(repositories); // Display repositories initially
 }
 
 // Function to display repositories on the page
 function displayRepositories(repos) {
    const repoList = document.getElementById('my_repos');
    
    // Clear existing content
    repoList.innerHTML = '';
 
    repos.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
        
        const repoName = document.createElement('h3');
        repoName.innerHTML = repo.name || translations[language].repoNameUnavailable;;
        
        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || translations[language].repoDescriptionUnavailable;

        const repoLanguages = document.createElement('p');
        const languages = repositoryLanguages[repo.id] || [];
        repoLanguages.textContent = translations[language].languages + languages.join(', ') || languages[language].languageUnavailable;

        const moreDetails = document.createElement('p');
        moreDetails.textContent = translations[language].moreDetails; 
 
        repoLink.appendChild(repoName);
        repoLink.appendChild(repoDescription);
        repoLink.appendChild(repoLanguages);
        repoLink.appendChild(moreDetails);
        
        repoList.appendChild(repoLink);
    });
 }
 
 // Call the function to fetch repositories when the DOM is fully loaded
 document.addEventListener('DOMContentLoaded', fetchRepositories);
 
 // Follows mouse movement
 const follower = document.getElementById('follower');
 
 document.addEventListener('mousemove', (event) => {
    const x = event.pageX; // Mouse X position
    const y = event.pageY; // Mouse Y position
 
    // Update element position
    follower.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Move follower to mouse position
 });
 
 // Multilingual support
 
 // Dictionary for English and Portuguese
 const translations = {
    en: {
        greeting: "Hi, my name is Igor!",
        description: "I am an industrial automation specialist with a strong passion for new technologies and software development.<br>Below, you will find a selection of personal projects that I have worked on.",
        languages: "Languages: ",
        moreDetails: "Click for more details",
        repoNameUnavailable: "Name not available",
        repoDescriptionUnavailable: "Description not available",
        languageUnavailable: "No languages available",
        copiedSuccessfuly: "Email address copied to clipboard!",
        failedCopy: "Failed to copy email address:"
    },
    pt: {
        greeting: "Olá, meu nome é Igor!",
        description: "Sou um especialista em automação industrial com uma forte paixão por novas tecnologias e desenvolvimento de software.<br>Abaixo, você encontrará uma seleção de projetos pessoais em que trabalhei.",
        languages: "Linguagens: ",
        moreDetails: "Clique para mais detalhes",
        repoNameUnavailable: "Nome não disponível",
        repoDescriptionUnavailable: "Descrição não disponível",
        languageUnavailable: "Nenhuma linguagem disponível",
        copiedSuccessfuly: "Endereço de email copiado para área de transferência!",
        failedCopy: "Falha ao copiar o endereço de e-mail:"
    },
    es: {
        greeting: "¡Hola, mi nombre es Igor!",
        description: "Soy un especialista en automatización industrial con una gran pasión por las nuevas tecnologías y el desarrollo de software.<br> A continuación, encontrarás una selección de proyectos personales en los que he trabajado.",
        languages: "Lenguajes: ",
        moreDetails: "Haz clic para más detalles",
        repoNameUnavailable: "Nombre no disponible",
        repoDescriptionUnavailable: "Descripción no disponible",
        languageUnavailable: "No hay lenguajes disponibles",
        copiedSuccessfuly: "¡Dirección de correo electrónico copiada al portapapeles!",
        failedCopy: "Error al copiar la dirección de correo electrónico:"
    }
 };
 
 // Check browser language
 let userLang = navigator.language || navigator.userLanguage; 
 userLang = userLang.split('-')[0];
 
 if (!translations[userLang]) {
    userLang = 'en'; // Default to English if language not supported
 }

 language = userLang; //set global var
 
 // Update text based on selected language
 function updateText(lang) {
    language = lang; //set global var
    document.getElementById('greeting').innerText = translations[lang].greeting;
    document.getElementById('description').innerHTML = translations[lang].description;
 
    // Update repository details based on language
    const repoList = document.getElementById('my_repos');
 
    // Clear and re-display repositories with updated translations
    repoList.innerHTML = '';
    
    repositories.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
 
        const repoName = document.createElement('h3');
        repoName.innerHTML = repo.name || translations[lang].repoNameUnavailable;
        
        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || translations[lang].repoDescriptionUnavailable;

        const repoLanguages = document.createElement('p');
        const languages = repositoryLanguages[repo.id] || [];
       repoLanguages.textContent = translations[lang].languages + languages.join(', ') || languages[language].languageUnavailable;
 
 
        const moreDetails = document.createElement('p');
        moreDetails.textContent = translations[lang].moreDetails;
 
        repoLink.appendChild(repoName);
        repoLink.appendChild(repoDescription);
        repoLink.appendChild(repoLanguages);
        repoLink.appendChild(moreDetails);
 
        repoList.appendChild(repoLink);

    });

    // update check icon according to selected language
    document.querySelectorAll('.check-icon').forEach(icon => {
        icon.style.display = 'none'; // hide all
    });

    // show icon on selected language
    document.getElementById(`check-${lang}`).style.display = 'inline'; 
 }
 
 // Handle language selection from dropdown
 document.querySelectorAll('.language-option').forEach(button => {
    button.addEventListener('click', () => {
        const selectedLang = button.getAttribute('data-lang');
        updateText(selectedLang); // Update text based on selected language
    });
 });
 
 // Initialize text based on browser language
 updateText(userLang);

 