// Character stats
let character = {
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    strength: 10,
    agility: 10
};

// Task system
const tasks = [
    {
        id: 1,
        title: "Morning Training",
        description: "Complete 10 push-ups",
        reward: 20,
        completed: false
    },
    {
        id: 2,
        title: "Study Session",
        description: "Study for 30 minutes",
        reward: 25,
        completed: false
    },
    {
        id: 3,
        title: "Meditation",
        description: "Meditate for 15 minutes",
        reward: 15,
        completed: false
    }
];

// DOM Elements
const levelElement = document.getElementById('level');
const expElement = document.getElementById('exp');
const strengthElement = document.getElementById('strength');
const agilityElement = document.getElementById('agility');
const levelUpNotification = document.getElementById('levelUpNotification');
const gainExpBtn = document.getElementById('gainExpBtn');
const tasksList = document.getElementById('tasksList');

// GSAP animations
const levelUpTimeline = gsap.timeline({paused: true});

// Initialize tasks
function initializeTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-info">
                <span class="task-title">${task.title}</span>
                <span class="task-description">${task.description}</span>
            </div>
            <div class="task-reward">+${task.reward} EXP</div>
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   data-task-id="${task.id}" onchange="toggleTask(${task.id})">
        `;
        tasksList.appendChild(taskElement);
    });
    updateGainExpButton();
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`).parentElement;
        taskElement.classList.toggle('completed');
        updateGainExpButton();
    }
}

// Update gain experience button state
function updateGainExpButton() {
    const allTasksCompleted = tasks.every(task => task.completed);
    gainExpBtn.disabled = !allTasksCompleted;
    gainExpBtn.textContent = allTasksCompleted ? 
        "Gain Experience" : 
        "Complete All Tasks to Gain Experience";
}

// Initialize level up animation
function initLevelUpAnimation() {
    levelUpTimeline
        .to(levelUpNotification, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
        .to(".stats-increase p", {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.5
        })
        .to(levelUpNotification, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 2,
            ease: "back.in(1.7)"
        });
}

// Create particle effects
function createParticles() {
    const container = document.querySelector('.container');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);

        const size = Math.random() * 5 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        gsap.set(particle, {
            x: x,
            y: y,
            width: size,
            height: size,
            opacity: 1
        });

        gsap.to(particle, {
            x: x + (Math.random() - 0.5) * 200,
            y: y + (Math.random() - 0.5) * 200,
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onComplete: () => particle.remove()
        });
    }
}

// Update character stats
function updateStats() {
    levelElement.textContent = character.level;
    expElement.textContent = `${character.exp}/${character.expToNextLevel}`;
    strengthElement.textContent = character.strength;
    agilityElement.textContent = character.agility;
}

// Level up the character
function levelUp() {
    character.level++;
    character.strength += 5;
    character.agility += 5;
    character.exp = 0;
    character.expToNextLevel = Math.floor(character.expToNextLevel * 1.5);

    // Show level up animation
    levelUpNotification.classList.add('active');
    createParticles();
    levelUpTimeline.restart();

    // Update stats display
    updateStats();
}

// Gain experience
function gainExperience() {
    // Calculate total experience from completed tasks
    const totalExp = tasks.reduce((sum, task) => {
        return sum + (task.completed ? task.reward : 0);
    }, 0);

    character.exp += totalExp;

    if (character.exp >= character.expToNextLevel) {
        levelUp();
    } else {
        updateStats();
    }

    // Reset tasks after gaining experience
    tasks.forEach(task => task.completed = false);
    initializeTasks();
}

// Event Listeners
gainExpBtn.addEventListener('click', gainExperience);

// Initialize
initLevelUpAnimation();
initializeTasks();
updateStats(); 