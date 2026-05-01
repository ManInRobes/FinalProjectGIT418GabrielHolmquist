const statusDiv = document.getElementById('status');

        const btn = document.getElementById('actionButton');

        // 1. Check if the user has been here before
        const hasVisited = localStorage.getItem('hasVisited');

        if (!hasVisited) {
            // First time logic
            statusDiv.innerText = "Welcome! Create an account.";
            btn.innerText = "Get Started";
            
            // Set the flag so next time they are "Returning"
            localStorage.setItem('hasVisited', 'true');
        } else {
            // Returning visitor logic
            statusDiv.innerText = "Welcome back, friend!";
            btn.innerText = "Continue Journey";
        }

        // // Optional: Reset button for testing purposes
        // btn.addEventListener('click', () => {
        //     alert("Button clicked! The script knows you've been here.");
        // });
        const toggleBtn = document.getElementById('light-switch');
        
        toggleBtn.addEventListener('click', () => {
            // This class triggers the CSS animation from the stylesheet
            toggleBtn.classList.toggle('theme-toggle--toggled');
            
            // This handles your actual page theme
            document.body.classList.toggle('dark-mode');
        });

        // For Cyberpunk Characters

    async function fetchCharacters() {
    try {

        // const response = await fetch(API_URL);
        // const characters = await response.json();
        
        // Mock data array of multiple characters

        // Test Variables
        const characters = [
            {
                id: 1,
                name: "Jax \"V\" Mercer",
                handle: "Razorwire",
                role: "Solo",
                humanity: 45,
                specialAbility: "Combat Sense (6)",
                stats: { INT: 6, REF: 9, TECH: 4, COOL: 8, ATTR: 5, LUCK: 7 }
            },
            {
                id: 2,
                name: "Sarah Chen",
                handle: "Ghost",
                role: "Netrunner",
                humanity: 30,
                specialAbility: "Interface (8)",
                stats: { INT: 10, REF: 6, TECH: 7, COOL: 6, ATTR: 5, LUCK: 5 }
            },
            {
                id: 3,
                name: "Deckard Vance",
                handle: "Drifter",
                role: "Nomad",
                humanity: 60,
                specialAbility: "Family (5)",
                stats: { INT: 5, REF: 7, TECH: 8, COOL: 7, ATTR: 4, LUCK: 6 }
            }
        ];

        const nestContainer = document.getElementById('UserCharacters');
        nestContainer.innerHTML = '<h2 id="UserCharHeader">Characters:</h2>';

        
        characters.forEach(char => {
            // Generate the inner stat boxes for each character
            let statsHTML = '';
            for (const [stat, value] of Object.entries(char.stats)) {
                statsHTML += `
                    <div class="stat-box">
                        <div class="stat-title">${stat}</div>
                        <div class="stat-value">${value}</div>
                    </div>
                `;
            }

            // Create the full card element for the character
            const cardHTML = `
                <div class="cp2020-card">
                    <div class="header">
                        <div class="name">${char.name}</div>
                        <div class="role">${char.role.toUpperCase()}</div>
                    </div>
                    
                    <div class="stats-grid">
                        ${statsHTML}
                    </div>

                    <div class="details-section">
                        <p><strong>Handle:</strong> ${char.handle}</p>
                        <p><strong>Humanity:</strong> ${char.humanity}</p>
                        <p><strong>Special Ability:</strong> ${char.specialAbility}</p>
                    </div>

                    <div class="button-section">
                        <button class="edit-btn" onclick="openEditModal(${char.id})">Edit Character</button>
                    </div>
                </div>
            `;

            nestContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error("Error loading roster data:", error);
        document.getElementById('nestContainer').innerHTML = '<div style="color: #ff0055;">SYSTEM ERROR: Roster offline.</div>';
    }
}

// Function placeholder for your editing functionality
function openEditModal(characterId) {
    console.log("Editing character with ID:", characterId);
    // You can add your modal-opening or routing logic here
    alert("Editing feature is being set up for character ID: " + characterId);
}

// Initialize on page load
fetchCharacters();

