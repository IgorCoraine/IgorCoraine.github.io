// Copy text to clipboard
document.getElementById('copyButton').addEventListener('click', function() {
    const text = document.getElementById('textToCopy').innerText; // Get text
    navigator.clipboard.writeText(text) // Copy to clipboard
        .then(() => {
            alert('Text copied to clipboard!'); // Alert on success
        })
        .catch(err => {
            alert('Failed to copy text: ' + err); // Alert on failure
        });
});

// Get repositories from my GitHub
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/users/igorcoraine/repos?sort=updated')
        .then(response => response.json())
        .then(data => {
            const repoList = document.getElementById('my_repos');
            data.forEach(repo => {
                const listItem = document.createElement('li');
                const repoLink = document.createElement('a');
                repoLink.href = repo.html_url;
                repoLink.target = '_blank';

                const repoName = document.createElement('h3');
                const repoDescription = document.createElement('p');
                const repoLanguages = document.createElement('p');
                const moreDetails = document.createElement('p'); 

                repoName.textContent = repo.name || "Name not available"; // Set repository name
                repoDescription.textContent = repo.description || "Description not available"; // Set repository description
                moreDetails.textContent = "Click for more details"; // Indicate more details

                fetch(repo.languages_url)
                    .then(response => response.json())
                    .then(languagesData => {
                        const languages = Object.keys(languagesData);
                        repoLanguages.textContent = `Languages: ${languages.join(', ')}`; // Display languages used
                    })
                    .catch(error => console.error('Error fetching languages:', error));

                // Add elements to the link
                repoLink.appendChild(repoName);
                repoLink.appendChild(repoDescription);
                repoLink.appendChild(repoLanguages);
                repoLink.appendChild(moreDetails);
                listItem.appendChild(repoLink);
                repoList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching repositories:', error));
});

// Follows mouse movement
const follower = document.getElementById('follower');

document.addEventListener('mousemove', (event) => {
    const x = event.pageX; // Mouse X position
    const y = event.pageY; // Mouse Y position

    // Update element position
    follower.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Move follower to mouse position
});
