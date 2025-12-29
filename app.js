const goal = 2000;
const drinkAmount = 250; // Size of one drink (1 cup)
let currentAmount = 0;

// DOM Elements
const currentEl = document.getElementById('current-amount');
const countGlassEl = document.getElementById('count-glass');
// const percentageEl = document.getElementById('percentage'); // Removed from DOM in this version
const waveContainer = document.querySelector('.app-container');
const drinkBtn = document.getElementById('drink-btn');
const bubblesContainer = document.getElementById('bubbles-container');
const aquaticContainer = document.getElementById('aquatic-container');
const waves = document.querySelectorAll('.wave');

// --- INIT ---
function init() {
    loadProgress();
    spawnBubbles();
    // Start aquatic life cycle
    setInterval(spawnAquaticLife, 8000);
    updateUI();
}

// --- STATE MANAGEMENT ---
function loadProgress() {
    const saved = localStorage.getItem('waterProgress');
    const savedDate = localStorage.getItem('waterDate');
    const today = new Date().toDateString();

    if (saved && savedDate === today) {
        currentAmount = parseInt(saved, 10);
    } else {
        currentAmount = 0;
        localStorage.setItem('waterDate', today);
    }
}

function saveProgress() {
    localStorage.setItem('waterProgress', currentAmount);
    localStorage.setItem('waterDate', new Date().toDateString());
}

function addWater(event) {
    currentAmount += drinkAmount;

    // Cap at reasonable max for visuals? No, let them overflow! 

    saveProgress();
    updateUI();

    // Effects
    createRipple(event);
    triggerSurge();
    addFloatingText(event.clientX, event.clientY);

    celebrate();
}

function updateUI() {
    // Math
    let percent = Math.min((currentAmount / goal) * 100, 100);
    let glasses = Math.floor(currentAmount / drinkAmount);

    // Update Text
    currentEl.innerHTML = `${currentAmount}<small>ml</small>`;
    if (countGlassEl) countGlassEl.innerHTML = `${glasses}<small>cups</small>`;

    // Update Wave Height
    document.documentElement.style.setProperty('--wave-height', `${percent}%`);

    // Update aquatic positions
    document.documentElement.style.setProperty('--water-level', `${percent}%`);
}

// --- VISUALS ---

// Surge Effect: Waves go fast!
function triggerSurge() {
    waves.forEach(w => w.classList.add('surge'));
    setTimeout(() => {
        waves.forEach(w => w.classList.remove('surge'));
    }, 1000);
}

// Floating Text Effect
function addFloatingText(x, y) {
    const el = document.createElement('div');
    el.classList.add('floating-text');
    el.innerText = "+1 Cup!";

    // Randomize slightly
    const randomX = (Math.random() - 0.5) * 40;

    el.style.left = `${x + randomX}px`;
    el.style.top = `${y - 50}px`;

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1500);
}

// Button Ripple Effect
function createRipple(e) {
    const circle = document.createElement('span');
    const diameter = Math.max(drinkBtn.clientWidth, drinkBtn.clientHeight);
    const radius = diameter / 2;

    const rect = drinkBtn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = drinkBtn.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    drinkBtn.appendChild(circle);
}

// Reset Functionality
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to drain the ocean? 🌊\nYour progress will be lost!")) {
        currentAmount = 0;
        localStorage.removeItem('waterProgress'); // Or set to 0
        updateUI();

        // Remove visuals
        waves.forEach(w => w.classList.remove('surge'));
        document.getElementById('bubbles-container').innerHTML = ''; // Clear bubbles

        // Maybe a sad sound?
    }
});

drinkBtn.addEventListener('click', addWater);

// Floating Bubbles Background
function spawnBubbles() {
    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        // Randomize
        const size = Math.random() * 40 + 10 + 'px';
        const left = Math.random() * 100 + '%';
        const duration = Math.random() * 5 + 5 + 's';

        bubble.style.setProperty('--size', size);
        bubble.style.setProperty('--left', left);
        bubble.style.setProperty('--duration', duration);

        bubblesContainer.appendChild(bubble);

        setTimeout(() => bubble.remove(), 10000);
    }, 800);
}

// Aquatic Life
const animals = ['🐠', '🐟', '🐡', '🦆', '🦢', '⛵'];
function spawnAquaticLife() {
    // Only spawn if there is water
    if (currentAmount === 0) return;

    const animal = document.createElement('div');
    animal.classList.add('aquatic-animal');
    animal.innerText = animals[Math.floor(Math.random() * animals.length)];

    // Random duration
    const duration = Math.random() * 10 + 10 + 's'; // 10-20s
    animal.style.setProperty('--duration', duration);

    aquaticContainer.appendChild(animal);

    // Remove after animation
    setTimeout(() => animal.remove(), 20000);
}

function celebrate() {
    const stats = document.querySelector('.stats');
    stats.style.transform = 'scale(1.1)';
    setTimeout(() => stats.style.transform = 'scale(1)', 200);

    if (currentAmount >= goal && currentAmount - drinkAmount < goal) {
        // Create many confetti-like bubbles?
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const b = document.createElement('div');
                b.classList.add('bubble');
                b.style.setProperty('--size', '30px');
                b.style.setProperty('--left', Math.random() * 100 + '%');
                b.style.setProperty('--duration', '3s');
                bubblesContainer.appendChild(b);
            }, i * 100);
        }
        alert("🎉 Goal Reached! You are hydrated! 🎉");
    }
}

// Start
init();
