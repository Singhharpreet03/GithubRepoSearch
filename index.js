let repoName = sessionStorage.getItem('reponame');
async function fetchUserProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${repoName}`);
        const userData = await response.json();

        // Update HTML elements with user profile data
        document.getElementById('profilePhoto').src = userData.avatar_url;
        document.getElementById('name').innerText = userData.name || 'John Doe';
        document.getElementById('bio').innerText = userData.bio || 'Bio goes here';
        document.getElementById('location').innerText = userData.location || 'Location';
        document.getElementById('twitter').innerText = userData.twitter_username || 'Twitter';
        document.getElementById('github').innerHTML = `<a href="${userData.html_url}" target="_blank">${userData.html_url}</a>`;
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Initial fetch and display
fetchUserProfile();

let reposData = []; // To store the fetched GitHub repositories data
    let currentPage = 1;
    let cardsPerPage = 10;

    async function fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${repoName}/repos`);
            reposData = await response.json();
            reposData=reposData.slice(1,);
            displayCards();
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
        }
    }

    function displayCards() {
        const cardsContainer = document.getElementById("cards-container");
        cardsContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        for (let i = startIndex; i < endIndex && i < reposData.length; i++) {
            const repo = reposData[i];
            const card = document.createElement("div");
            card.className = "card";
            card.id="c";
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>
                <strong>Link:</strong>
                <button class="github-button" onclick="window.open('${repo.html_url}', '_blank')">Github</button>
            </p>
            
                <p><strong>Languages:</strong> ${Array.isArray(repo.language) ? repo.language.join(', ') : (repo.language || 'N/A')}</p>

            `;
            cardsContainer.appendChild(card);
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(reposData.length / cardsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayCards();
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayCards();
        }
    }

    function changeCardsPerPage() {
        const selectElement = document.getElementById("cards-per-page");
        cardsPerPage = parseInt(selectElement.value, 10);
        currentPage = 1; // Reset to the first page when changing cards per page
        displayCards();
    }

    // Initial fetch and display
    fetchGitHubRepos();

    // darkmode and lightmode

    function toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark-mode');
        
        // Store user's preferred mode in local storage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }

    // Check user's preferred mode from local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById(c).classList.add('dark-mode');
        document.querySelectorAll('.search-home').forEach(element => {
        element.classList.toggle('dark-mode');
    });
    
    }   

    // search

    async function searchRepo(event) {
        event.preventDefault();

        repoName = document.getElementById('repoName').value.replace(/\s/g, '');
        const apiUrl = `https://api.github.com/users/${repoName}`;

        try {
            const response = await fetch(apiUrl);

            if (response.ok) {
                console.log("ok");
                sessionStorage.setItem('reponame', repoName);
                window.location.href='home.html';
            } else {
                alert('Repository does not exist.');
                window.location.href = 'index.html'; // Replace with the actual next page URL
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }