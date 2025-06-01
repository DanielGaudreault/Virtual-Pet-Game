// Game state
let gameState = {
    currentPet: null,
    pets: [],
    coins: 100,
    timeOfDay: 'day',
    weather: 'sunny',
    houseItems: []
};

// Initialize game
function initializeGame() {
    if (!gameState.currentPet && gameState.pets.length > 0) {
        gameState.currentPet = gameState.pets[0];
    } else if (!gameState.currentPet) {
        gameState.currentPet = {
            id: 'pet_' + Date.now(),
            name: "Whiskers",
            type: "cat",
            emoji: "🐱",
            age: 3,
            level: 1,
            experience: 150,
            maxExperience: 200,
            health: 85,
            hunger: 60,
            happiness: 75,
            energy: 90,
            cleanliness: 70,
            mood: "happy",
            traits: ["playful", "curious"],
            lastFed: Date.now() - 2 * 60 * 60 * 1000,
            lastPlayed: Date.now() - 1 * 60 * 60 * 1000,
            lastCleaned: Date.now() - 4 * 60 * 60 * 1000,
            lastSlept: Date.now() - 8 * 60 * 60 * 1000
        };
        gameState.pets.push(gameState.currentPet);
    }
    updateUI();
}

// Pet care functions
function feedPet() {
    if (gameState.currentPet.hunger < 100) {
        gameState.currentPet.hunger = Math.min(100, gameState.currentPet.hunger + 25);
        gameState.currentPet.happiness = Math.min(100, gameState.currentPet.happiness + 10);
        gameState.currentPet.lastFed = Date.now();
        gainExperience(5);
        showFloatingHearts();
        showNotification(gameState.currentPet.name + ' enjoyed the meal!', 'success');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is not hungry right now', 'info');
    }
}

function playWithPet() {
    if (gameState.currentPet.energy > 20) {
        gameState.currentPet.happiness = Math.min(100, gameState.currentPet.happiness + 20);
        gameState.currentPet.energy = Math.max(0, gameState.currentPet.energy - 20);
        gameState.currentPet.lastPlayed = Date.now();
        gainExperience(10);
        showFloatingHearts();
        showNotification(gameState.currentPet.name + ' had a great time playing!', 'success');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is too tired to play', 'info');
    }
}

function cleanPet() {
    if (gameState.currentPet.cleanliness < 100) {
        gameState.currentPet.cleanliness = Math.min(100, gameState.currentPet.cleanliness + 30);
        gameState.currentPet.happiness = Math.min(100, gameState.currentPet.happiness + 5);
        gameState.currentPet.lastCleaned = Date.now();
        gainExperience(5);
        showNotification(gameState.currentPet.name + ' feels fresh and clean!', 'success');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is already clean', 'info');
    }
}

function sleepPet() {
    if (gameState.currentPet.energy < 100) {
        gameState.currentPet.energy = Math.min(100, gameState.currentPet.energy + 40);
        gameState.currentPet.lastSlept = Date.now();
        showNotification(gameState.currentPet.name + ' had a good nap!', 'success');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is not tired right now', 'info');
    }
}

function takeToVet() {
    if (gameState.coins >= 50) {
        gameState.coins -= 50;
        gameState.currentPet.health = 100;
        showNotification('Veterinary visit complete! ' + gameState.currentPet.name + ' is in perfect health!', 'success');
        updateUI();
        saveGameState();
    } else {
        showNotification('You need 50 coins for a vet visit', 'error');
    }
}

// Game mechanics
function gainExperience(amount) {
    gameState.currentPet.experience += amount;
    if (gameState.currentPet.experience >= gameState.currentPet.maxExperience) {
        levelUp();
    }
    updateUI();
}

function levelUp() {
    gameState.currentPet.level++;
    gameState.currentPet.experience = 0;
    gameState.currentPet.maxExperience = gameState.currentPet.level * 100;
    gameState.coins += gameState.currentPet.level * 50;
    showNotification(gameState.currentPet.name + ' leveled up! Level ' + gameState.currentPet.level, 'success');
    updateUI();
    saveGameState();
}

function updatePetMood() {
    const avg = (gameState.currentPet.health + gameState.currentPet.hunger +
                gameState.currentPet.happiness + gameState.currentPet.energy +
                gameState.currentPet.cleanliness) / 5;
    const moodElement = document.getElementById('currentPetMood');
    if (avg >= 80) {
        gameState.currentPet.mood = 'happy';
        moodElement.textContent = '😊';
    } else if (avg >= 60) {
        gameState.currentPet.mood = 'neutral';
        moodElement.textContent = '😐';
    } else if (avg >= 40) {
        gameState.currentPet.mood = 'sad';
        moodElement.textContent = '😢';
    } else {
        gameState.currentPet.mood = 'sick';
        moodElement.textContent = '😷';
    }
}

function showFloatingHearts() {
    const avatar = document.getElementById('currentPetAvatar');
    const hearts = document.createElement('div');
    hearts.className = 'floating-hearts';
    hearts.textContent = '💕';
    hearts.style.position = 'absolute';
    hearts.style.left = Math.random() * 100 + 'px';
    hearts.style.top = Math.random() * 100 + 'px';
    avatar.appendChild(hearts);
    setTimeout(() => {
        if (hearts.parentNode) {
            hearts.parentNode.removeChild(hearts);
        }
    }, 2000);
}

// UI update functions
function updateUI() {
    if (!gameState.currentPet) return;
    document.getElementById('currentPetName').textContent = gameState.currentPet.name;
    document.getElementById('currentPetAvatar').textContent = gameState.currentPet.emoji;
    document.getElementById('currentPetAge').textContent = 'Age: ' + gameState.currentPet.age + ' months';
    updateStatusBar('health', gameState.currentPet.health);
    updateStatusBar('hunger', gameState.currentPet.hunger);
    updateStatusBar('happiness', gameState.currentPet.happiness);
    updateStatusBar('energy', gameState.currentPet.energy);
    updateStatusBar('cleanliness', gameState.currentPet.cleanliness);
    const expPercent = (gameState.currentPet.experience / gameState.currentPet.maxExperience) * 100;
    document.getElementById('experienceBar').style.width = expPercent + '%';
    document.getElementById('experienceValue').textContent =
        gameState.currentPet.experience + '/' + gameState.currentPet.maxExperience;
    document.getElementById('userCoins').textContent = gameState.coins;
    document.getElementById('userLevel').textContent = gameState.currentPet.level;
}

function updateStatusBar(stat, value) {
    const bar = document.getElementById(stat + 'Bar');
    const valueSpan = document.getElementById(stat + 'Value');
    if (bar && valueSpan) {
        bar.style.width = value + '%';
        valueSpan.textContent = value + '/100';
    }
}

// Navigation functions
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    const sectionToShow = document.getElementById(sectionName + 'Section');
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
    const tabs = document.querySelectorAll('.navigation-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = Array.from(tabs).find(tab => tab.getAttribute('data-section') === sectionName);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    switch(sectionName) {
        case 'pets':
            loadPetCollection();
            break;
        case 'house':
            loadHouseDesigner();
            break;
        case 'shop':
            loadShop();
            break;
        case 'stats':
            updateCharts();
            break;
    }
}

// Additional features
function createNewPet() {
    const petTypes = [
        { type: 'cat', emoji: '🐱' },
        { type: 'dog', emoji: '🐶' },
        { type: 'bird', emoji: '🐦' },
        { type: 'fish', emoji: '🐠' }
    ];
    const newPet = {
        id: 'pet_' + Date.now(),
        name: prompt('Enter pet name:') || 'Pet' + (gameState.pets.length + 1),
        type: petTypes[Math.floor(Math.random() * petTypes.length)].type,
        emoji: petTypes[Math.floor(Math.random() * petTypes.length)].emoji,
        age: 1,
        level: 1,
        experience: 0,
        maxExperience: 100,
        health: 100,
        hunger: 80,
        happiness: 80,
        energy: 100,
        cleanliness: 80,
        mood: 'happy',
        traits: ['playful'],
        lastFed: Date.now(),
        lastPlayed: Date.now(),
        lastCleaned: Date.now(),
        lastSlept: Date.now()
    };
    gameState.pets.push(newPet);
    gameState.currentPet = newPet;
    showNotification('New pet ' + newPet.name + ' created!', 'success');
    updateUI();
    saveGameState();
    loadPetCollection();
}

function loadPetCollection() {
    const collection = document.getElementById('petCollection');
    collection.innerHTML = '';
    gameState.pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <div class="pet-avatar">${pet.emoji}</div>
            <h3>${pet.name}</h3>
            <p>Type: ${pet.type}</p>
            <button onclick="switchPet('${pet.id}')">Select</button>
        `;
        collection.appendChild(petCard);
    });
}

function switchPet(petId) {
    gameState.currentPet = gameState.pets.find(pet => pet.id === petId);
    updateUI();
    showSection('main');
    saveGameState();
}

function loadShop() {
    const shopItems = [
        { id: 'food', name: 'Pet Food', cost: 10, effect: () => feedPet() },
        { id: 'toy', name: 'Toy', cost: 15, effect: () => playWithPet() },
        { id: 'bed', name: 'Cozy Bed', cost: 30, effect: () => sleepPet() }
    ];
    const shop = document.getElementById('shopItems');
    shop.innerHTML = '';
    shopItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Cost: ${item.cost} coins</p>
            <button onclick="buyItem('${item.id}')">Buy</button>
        `;
        shop.appendChild(itemElement);
    });
}

function buyItem(itemId) {
    const shopItems = {
        food: { cost: 10, effect: feedPet },
        toy: { cost: 15, effect: playWithPet },
        bed: { cost: 30, effect: sleepPet }
    };
    const item = shopItems[itemId];
    if (gameState.coins >= item.cost) {
        gameState.coins -= item.cost;
        item.effect();
        showNotification('Purchased ' + itemId + '!', 'success');
        updateUI();
        saveGameState();
    } else {
        showNotification('Not enough coins!', 'error');
    }
}

function loadHouseDesigner() {
    const canvas = document.getElementById('houseCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameState.houseItems.forEach(item => {
        ctx.font = '30px Arial';
        ctx.fillText(item.type === 'bed' ? '🛏️' : '💡', item.x, item.y);
    });
}

function addFurniture(type) {
    gameState.houseItems.push({
        type,
        x: Math.random() * 350,
        y: Math.random() * 250
    });
    loadHouseDesigner();
    saveGameState();
}

function clearHouse() {
    gameState.houseItems = [];
    loadHouseDesigner();
    saveGameState();
}

let statsChart;
function initializeCharts() {
    const ctx = document.getElementById('statsChart').getContext('2d');
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Health', 'Hunger', 'Happiness', 'Energy', 'Cleanliness'],
            datasets: [{
                label: 'Pet Stats',
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#22c55e', '#eab308', '#ec4899', '#3b82f6', '#10b981']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateCharts() {
    if (!gameState.currentPet) return;
    statsChart.data.datasets[0].data = [
        gameState.currentPet.health,
        gameState.currentPet.hunger,
        gameState.currentPet.happiness,
        gameState.currentPet.energy,
        gameState.currentPet.cleanliness
    ];
    statsChart.update();
}

// Save and load game state
function saveGameState() {
    localStorage.setItem('petGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('petGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.getElementById('notificationArea').appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Authentication
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.classList.toggle('fa-eye');
            toggle.classList.toggle('fa-eye-slash');
        });
    });
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const savedUser = localStorage.getItem('user_' + username);
    if (savedUser && JSON.parse(savedUser).password === password) {
        showSection('main');
        showNotification('Welcome back, ' + username + '!', 'success');
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    if (localStorage.getItem('user_' + username)) {
        showNotification('Username already exists', 'error');
    } else {
        localStorage.setItem('user_' + username, JSON.stringify({ username, password }));
        showSection('login');
        showNotification('Registration successful! Please login.', 'success');
    }
}

function logout() {
    showSection('login');
    showNotification('Logged out successfully', 'success');
}

// Game loop
function startGameLoop() {
    setInterval(() => {
        updatePetNeeds();
        updateTimeAndWeather();
    }, 60000);
}

function updatePetNeeds() {
    const now = Date.now();
    const hoursPassed = {
        feed: (now - gameState.currentPet.lastFed) / (1000 * 60 * 60),
        play: (now - gameState.currentPet.lastPlayed) / (1000 * 60 * 60),
        clean: (now - gameState.currentPet.lastCleaned) / (1000 * 60 * 60),
        sleep: (now - gameState.currentPet.lastSlept) / (1000 * 60 * 60)
    };
    if (hoursPassed.feed > 1) {
        gameState.currentPet.hunger = Math.max(0, gameState.currentPet.hunger - 5);
    }
    if (hoursPassed.clean > 2) {
        gameState.currentPet.cleanliness = Math.max(0, gameState.currentPet.cleanliness - 3);
    }
    if (hoursPassed.sleep > 6) {
        gameState.currentPet.energy = Math.max(0, gameState.currentPet.energy - 10);
    }
    if (hoursPassed.play > 3) {
        gameState.currentPet.happiness = Math.max(0, gameState.currentPet.happiness - 8);
    }
    updatePetMood();
    updateUI();
}

function updateTimeAndWeather() {
    const hour = new Date().getHours();
    const dayNightCycle = document.getElementById('dayNightCycle');
    if (hour >= 6 && hour < 18) {
        gameState.timeOfDay = 'day';
        dayNightCycle.className = 'day-night-cycle day';
    } else {
        gameState.timeOfDay = 'night';
        dayNightCycle.className = 'day-night-cycle night';
    }
    if (Math.random() < 0.1) {
        const weathers = ['sunny', 'cloudy', 'rainy', 'snowy'];
        gameState.weather = weathers[Math.floor(Math.random() * weathers.length)];
        updateWeatherDisplay();
    }
}

function updateWeatherDisplay() {
    const weatherText = document.getElementById('weatherText');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherEffect = document.getElementById('weatherEffect');
    switch(gameState.weather) {
        case 'sunny':
            weatherText.textContent = 'Sunny';
            weatherIcon.className = 'fas fa-sun';
            weatherEffect.className = 'weather-effect';
            break;
        case 'cloudy':
            weatherText.textContent = 'Cloudy';
            weatherIcon.className = 'fas fa-cloud';
            weatherEffect.className = 'weather-effect';
            break;
        case 'rainy':
            weatherText.textContent = 'Rainy';
            weatherIcon.className = 'fas fa-cloud-rain';
            weatherEffect.className = 'weather-effect rain';
            break;
        case 'snowy':
            weatherText.textContent = 'Snowy';
            weatherIcon.className = 'fas fa-snowflake';
            weatherEffect.className = 'weather-effect';
            break;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggles();
    loadGameState();
    initializeGame();
    setupButtonListeners();
    startGameLoop();
    initializeCharts();
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('registerForm').addEventListener('submit', register);
});

function setupButtonListeners() {
    document.querySelectorAll('[onclick="feedPet()"]').forEach(btn => btn.onclick = feedPet);
    document.querySelectorAll('[onclick="playWithPet()"]').forEach(btn => btn.onclick = playWithPet);
    document.querySelectorAll('[onclick="cleanPet()"]').forEach(btn => btn.onclick = cleanPet);
    document.querySelectorAll('[onclick="sleepPet()"]').forEach(btn => btn.onclick = sleepPet);
    document.querySelectorAll('[onclick="takeToVet()"]').forEach(btn => btn.onclick = takeToVet);
    document.querySelectorAll('.navigation-tab').forEach(tab => {
        const section = tab.getAttribute('data-section');
        tab.onclick = () => showSection(section);
    });
    document.querySelectorAll('[onclick="logout()"]').forEach(btn => btn.onclick = logout);
}
