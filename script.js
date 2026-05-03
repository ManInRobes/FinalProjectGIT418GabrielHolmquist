
// CONFIG

const BASE_URL = 'https://bceb3183-63d1-4841-bb77-a2804fe906ff.mock.pstmn.io';
const POSTMAN_API_KEY = localStorage.getItem('postman_api_key') || 'PMAK-69f4ed3226184d00019c7576-cb9b87a1f005e6778033417af2cc7ebe8a';


// AUTH STATE

let authToken = localStorage.getItem('user_char_token') || null;
let currentUser = localStorage.getItem('current_user') || null;


// LOCAL CHARACTER STORE

let localCharacters = JSON.parse(localStorage.getItem('local_characters') || '[]');

function saveLocalCharacters() {
    localStorage.setItem('local_characters', JSON.stringify(localCharacters));
}

function generateId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Slick

  $(document).ready(function(){
    $('.slider').slick({
      autoplay: true,
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1
    });
  });

// $(document).ready(function(){
//     $('.slider').slick({
//       dots: true,
//       infinite: false, // Prevents clone misalignment
//       speed: 500,
//       slidesToShow: 3,
//       slidesToScroll: 1,
//     });
//   });

// FIRST-VISIT / RETURNING VISITOR LOGIC

window.addEventListener('DOMContentLoaded', () => {
    const isReturning = localStorage.getItem('hasVisited');
    const statusDiv = document.getElementById('status');

    if (isReturning) {
        if (statusDiv) statusDiv.textContent = 'Welcome Back!';
    } else {
        localStorage.setItem('hasVisited', 'true');
        if (statusDiv) statusDiv.textContent = 'New Here? Register!';
    }

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('light-switch');
        if (toggleBtn) toggleBtn.classList.add('theme-toggle--toggled');
    }

    const toggleBtn = document.getElementById('light-switch');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleDarkMode);

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const charForm = document.getElementById('characterForm');
    if (charForm) charForm.addEventListener('submit', handleFormSubmit);

    updateAuthUI();

    if (authToken) {
        renderCharacters(localCharacters);
    }
});

 
// DARK MODE
 
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const toggleBtn = document.getElementById('light-switch');
    if (toggleBtn) toggleBtn.classList.toggle('theme-toggle--toggled');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Tabs
document.addEventListener('DOMContentLoaded', () => {
    // Select the container
    const container = document.querySelector('.tab-container');
    
    // Select all tabs and panes
    const tabs = container.querySelectorAll('.tab');
    const panes = container.querySelectorAll('.tab-pane');

    // Add click event listener to each tab
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Remove active class from all panes
            panes.forEach(p => p.classList.remove('active'));
            
            // Add active class to the clicked tab and the corresponding pane
            tab.classList.add('active');
            panes[index].classList.add('active');
        });
    });
});

 
// AUTH UI
 
function updateAuthUI() {
    const statusDiv = document.getElementById('status');
    const logoutBtn = document.getElementById('logoutBtn');
    const authSection = document.getElementById('authSection');
    const charSection = document.getElementById('UserCharacters');
    const formSection = document.getElementById('characterFormSection');

    if (authToken) {
        if (statusDiv) statusDiv.textContent = currentUser ? `Logged in as ${currentUser}` : 'Logged In';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (authSection) authSection.style.display = 'none';
        if (charSection) charSection.style.display = 'block';
        if (formSection) formSection.style.display = 'block';
    } else {
        if (statusDiv) statusDiv.textContent = localStorage.getItem('hasVisited') ? 'Welcome Back! Please Login.' : 'New Here? Register!';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (authSection) authSection.style.display = 'block';
        if (charSection) charSection.style.display = 'none';
        if (formSection) formSection.style.display = 'none';
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('user_char_token');
    localStorage.removeItem('current_user');
    updateAuthUI();
    const list = document.getElementById('characterList');
    if (list) list.innerHTML = '';
}

 
// AUTH — LOGIN
 
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': POSTMAN_API_KEY },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error(`Login failed: ${res.status}`);

        const data = await res.json();
        authToken = data.token || data.access_token || 'mock-token';
        currentUser = username;
        localStorage.setItem('user_char_token', authToken);
        localStorage.setItem('current_user', currentUser);
        document.getElementById('loginPassword').value = '';
        updateAuthUI();
        renderCharacters(localCharacters);
    } catch (err) {
        console.error(err);
        alert(`Login error: ${err.message}`);
    }
}

 
// AUTH — REGISTER
 
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': POSTMAN_API_KEY },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

        alert('Registered successfully! Please log in on the left.');
        document.getElementById('registerForm').reset();
    } catch (err) {
        console.error(err);
        alert(`Registration error: ${err.message}`);
    }
}

 
// CHARACTERS — RENDER
 
function renderCharacters(characters) {
    const list = document.getElementById('characterList');
    if (!list) return;

    if (!characters || !characters.length) {
        list.innerHTML = '<p>No characters yet. Create one below!</p>';
        return;
    }

    list.innerHTML = characters.map(char => {
        const stats = char.stats || {};
        return `
            <div class="cp2020-card character-card" data-id="${char.id}">
                <div class="header">
                    <div class="name">${char.name || 'Unknown'}</div>
                    <div class="role">${char.role ? char.role.toUpperCase() : 'N/A'}</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-box"><div class="stat-title">INT</div><div class="stat-value">${stats.INT ?? '-'}</div></div>
                    <div class="stat-box"><div class="stat-title">REF</div><div class="stat-value">${stats.REF ?? '-'}</div></div>
                    <div class="stat-box"><div class="stat-title">TECH</div><div class="stat-value">${stats.TECH ?? '-'}</div></div>
                    <div class="stat-box"><div class="stat-title">COOL</div><div class="stat-value">${stats.COOL ?? '-'}</div></div>
                    <div class="stat-box"><div class="stat-title">ATTR</div><div class="stat-value">${stats.ATTR ?? '-'}</div></div>
                    <div class="stat-box"><div class="stat-title">LUCK</div><div class="stat-value">${stats.LUCK ?? '-'}</div></div>
                </div>
                <div class="details-section">
                    <p id="Handle"><strong>Handle:</strong> ${char.handle || ''},</p>
                    <p id="Humanity"><strong>Humanity:</strong> ${char.humanity ?? 'N/A'},</p>
                    <p id="SpecialAbility"><strong>Special Ability:</strong> ${char.specialAbility || 'N/A'}</p>
                </div>
                <div class="button-section">
                    <button class="edit-btn" onclick='openEditModal("${char.id}", ${JSON.stringify(char).replace(/'/g, "\\'")})'>Edit</button>
                    <button class="delete-btn" onclick="deleteCharacter('${char.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

 
// CHARACTERS — OPEN EDIT MODAL
 
function openEditModal(id, char) {
    const form = document.getElementById('characterForm');
    if (!form) return;

    form.dataset.editId = id;
    document.getElementById('charName').value = char.name || '';
    document.getElementById('charHandle').value = char.handle || '';
    document.getElementById('charRole').value = char.role || '';
    document.getElementById('charHumanity').value = char.humanity ?? '';
    document.getElementById('charSpecial').value = char.specialAbility || '';

    const stats = char.stats || {};
    document.getElementById('stat-int').value = stats.INT ?? '';
    document.getElementById('stat-ref').value = stats.REF ?? '';
    document.getElementById('stat-tech').value = stats.TECH ?? '';
    document.getElementById('stat-cool').value = stats.COOL ?? '';
    document.getElementById('stat-attr').value = stats.ATTR ?? '';
    document.getElementById('stat-luck').value = stats.LUCK ?? '';

    form.scrollIntoView({ behavior: 'smooth' });
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Update Character';
}

 
// CHARACTERS — CREATE / UPDATE
 
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const editId = form.dataset.editId || null;

    const payload = {
        name: document.getElementById('charName').value.trim(),
        handle: document.getElementById('charHandle').value.trim(),
        role: document.getElementById('charRole').value,
        humanity: parseInt(document.getElementById('charHumanity').value, 10),
        specialAbility: document.getElementById('charSpecial').value.trim(),
        stats: {
            INT: parseInt(document.getElementById('stat-int').value, 10),
            REF: parseInt(document.getElementById('stat-ref').value, 10),
            TECH: parseInt(document.getElementById('stat-tech').value, 10),
            COOL: parseInt(document.getElementById('stat-cool').value, 10),
            ATTR: parseInt(document.getElementById('stat-attr').value, 10),
            LUCK: parseInt(document.getElementById('stat-luck').value, 10)
        }
    };

    const url = editId ? `${BASE_URL}/characters/${editId}` : `${BASE_URL}/characters`;
    const method = editId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'x-api-key': POSTMAN_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Save failed: ${res.status}`);

        if (editId) {
            const index = localCharacters.findIndex(c => c.id === editId);
            if (index !== -1) {
                localCharacters[index] = { ...payload, id: editId };
            }
        } else {
            localCharacters.push({ ...payload, id: generateId() });
        }

        saveLocalCharacters();

        form.reset();
        delete form.dataset.editId;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Save Character';

        renderCharacters(localCharacters);
    } catch (err) {
        console.error(err);
        alert(`Error saving character: ${err.message}`);
    }
}

 
// CHARACTERS — DELETE
 
async function deleteCharacter(id) {
    if (!confirm('Delete this character?')) return;

    try {
        const res = await fetch(`${BASE_URL}/characters/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'x-api-key': POSTMAN_API_KEY
            }
        });

        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

        localCharacters = localCharacters.filter(c => c.id !== id);
        saveLocalCharacters();
        renderCharacters(localCharacters);
    } catch (err) {
        console.error(err);
        alert(`Error deleting character: ${err.message}`);
    }
}
