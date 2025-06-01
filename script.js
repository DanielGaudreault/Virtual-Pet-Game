let gameState = {
    currentPet: {
        name: "Whiskers",
        emoji: "🐱",
        age: 3,
        health: 85,
        hunger: 60,
        happiness: 75,
        mood: "happy"
    }
};

function initializeGame() {
    updateUI();
}

function feedPet() {
    if (gameState.currentPet.hunger < 100) {
        gameState.currentPet.hunger = Math.min(100, gameState.currentPet.hunger + 25);
        gameState.currentPet.happiness = Math.min(100, gameState.currentPet.happiness + 10);
        showNotification(gameState.currentPet.name + ' enjoyed the meal!');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is not hungry.');
    }
}

function playWithPet() {
    if (gameState.currentPet.happiness < 100) {
        gameState.currentPet.happiness = Math.min(100, gameState.currentPet.happiness + 20);
        showNotification(gameState.currentPet.name + ' had fun playing!');
        updatePetMood();
        updateUI();
        saveGameState();
    } else {
        showNotification(gameState.currentPet.name + ' is already very happy!');
    }
}

function updatePetMood() {
    const avg = (gameState.currentPet.health + gameState.currentPet.hunger + gameState.currentPet.happiness) / 3;
    const moodElement = document.getElementById('currentPetMood');
    if (avg >= 80) {
        gameState.currentPet.mood = 'happy';
        moodElement.textContent = '😊';
    } else if (avg >= 60) {
        gameState.currentPet.mood = 'neutral';
        moodElement.textContent = '😐';
    } else {
        gameState.currentPet.mood = 'sad';
        moodElement.textContent = '😢';
    }
}

function updateUI() {
    document.getElementById('currentPetName').textContent = gameState.currentPet.name;
    document.getElementById('currentPetAvatar').textContent = gameState.currentPet.emoji;
    document.getElementById('currentPetAge').textContent = 'Age: ' + gameState.currentPet.age + ' months';
    document.getElementById('healthValue').textContent = gameState.currentPet.health + '/100';
    document.getElementById('hungerValue').textContent = gameState.currentPet.hunger + '/100';
    document.getElementById('happinessValue').textContent = gameState.currentPet.happiness + '/100';
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName + 'Section').classList.add('active');
    document.querySelectorAll('.navigation-tab').forEach(tab => tab.classList.remove('active'));
    const activeTab = Array.from(document.querySelectorAll('.navigation-tab')).find(
        tab => tab.getAttribute('data-section') === sectionName
    );
    if (activeTab) activeTab.classList.add('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.getElementById('notificationArea').appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function saveGameState() {
    localStorage.setItem('petGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('petGameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
}

function login(event) {
    event.preventDefault();
    showSection('main');
    showNotification('Logged in!');
}

document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    initializeGame();
    document.getElementById('loginForm').addEventListener('submit', login);
    document.querySelectorAll('.navigation-tab').forEach(tab => {
        const section = tab.getAttribute('data-section');
        tab.onclick = () => showSection(section);
    });
});
