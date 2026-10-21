const MAX_HP = 100;
const HERO_MIN_ATK = 8;
const HERO_MAX_ATK = 15;
const ENEMY_MIN_ATK = 5;
const ENEMY_MAX_ATK = 14;
const HEAL_AMOUNT = 20;
const MAX_HEALS = 3;
const CRIT_CHANCE = 0.1;

let heroHp = MAX_HP;
let enemyHp = MAX_HP;
let healsLeft = MAX_HEALS;
let isDefending = false;

const heroHpText = document.getElementById('heroHpText');
const heroHpBar = document.getElementById('heroHpBar');
const enemyHpText = document.getElementById('enemyHpText');
const enemyHpBar = document.getElementById('enemyHpBar');
const logBox = document.getElementById('logBox');
const healCountSpan = document.getElementById('healCount');
const actionButtons = document.getElementById('actionButtons');
const restartContainer = document.getElementById('restartContainer');
const heroImage = document.getElementById('heroImage');
const enemyImage = document.getElementById('enemyImage');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
    heroHpText.textContent = `${heroHp}/100`;
    heroHpBar.style.width = `${Math.max(0, heroHp)}%`;
    
    enemyHpText.textContent = `${enemyHp}/100`;
    enemyHpBar.style.width = `${Math.max(0, enemyHp)}%`;
    
    healCountSpan.textContent = healsLeft;

    if (heroHp <= 30 && heroHp > 0) {
        heroImage.src = 'images/omori_hurt.png';
    } else if (heroHp > 30) {
        heroImage.src = 'images/omori.png';
    }
}

function pushLog(message) {
    logBox.textContent = message;
}

function shakeElement(element) {
    element.classList.add('shake-animation');
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, 400);
}

function enemyTurn() {
    if (checkGameOver()) return;

    enemyImage.classList.add('enemy-scale');
    enemyImage.src = 'images/enemy_attack.png';

    setTimeout(() => {
        enemyImage.classList.remove('enemy-scale');
        enemyImage.src = 'images/enemy.png';

        let damage = getRandomInt(ENEMY_MIN_ATK, ENEMY_MAX_ATK);
        let isCrit = Math.random() < CRIT_CHANCE;

        if (isCrit && !isDefending) {
            damage *= 2;
            pushLog(`[CRITICAL HIT!] The enemy lands a fierce blow for ${damage} damage!`);
        } else if (isDefending) {
            damage = Math.floor(damage / 2);
            pushLog(`OMORI defended! Damage reduced to ${damage}.`);
        } else {
            pushLog(`The enemy attacks and deals ${damage} damage.`);
        }

        shakeElement(heroImage);

        heroHp -= damage;
        if (heroHp < 0) heroHp = 0;

        isDefending = false;
        updateUI();

        if (heroHp <= 0) {
            heroImage.src = 'images/omori_hurt.png';
        }
        checkGameOver();
    }, 500);
}

function checkGameOver() {
    if (heroHp <= 0 || enemyHp <= 0) {
        if (heroHp <= 0 && enemyHp <= 0) {
            pushLog("A draw... You both fell into darkness.");
        } else if (heroHp <= 0) {
            pushLog("You lost... Overcome your fear.");
        } else if (enemyHp <= 0) {
            pushLog("VICTORY! The enemy has been defeated.");
            enemyImage.src = 'images/enemy_dead.png';
        }
        
        actionButtons.classList.add('d-none');
        restartContainer.classList.remove('d-none');
        return true;
    }
    return false;
}

document.getElementById('attackBtn').addEventListener('click', () => {
    let damage = getRandomInt(HERO_MIN_ATK, HERO_MAX_ATK);
    
    enemyImage.src = 'images/enemy_hurt.png';
    shakeElement(enemyImage);

    enemyHp -= damage;
    if (enemyHp < 0) enemyHp = 0;

    pushLog(`OMORI attacks and deals ${damage} damage.`);
    updateUI();

    setTimeout(() => {
        if (enemyHp > 0) enemyImage.src = 'images/enemy.png';
        
        if (!checkGameOver()) {
            setTimeout(enemyTurn, 500);
        }
    }, 400);
});

document.getElementById('defendBtn').addEventListener('click', () => {
    isDefending = true;
    pushLog("OMORI takes a defensive stance.");

    if (!checkGameOver()) {
        setTimeout(enemyTurn, 400);
    }
});

document.getElementById('healBtn').addEventListener('click', () => {
    if (healsLeft > 0 && heroHp < MAX_HP) {
        heroHp += HEAL_AMOUNT;
        if (heroHp > MAX_HP) heroHp = MAX_HP;
        healsLeft--;
        pushLog(`OMORI restored ${HEAL_AMOUNT} HP. Heals remaining: ${healsLeft}`);
        updateUI();

        if (!checkGameOver()) {
            setTimeout(enemyTurn, 400);
        }
    } else {
        pushLog("Cannot heal: HP is full or no charges remain!");
    }
});

document.getElementById('restartBtn').addEventListener('click', () => {
    heroHp = MAX_HP;
    enemyHp = MAX_HP;
    healsLeft = MAX_HEALS;
    isDefending = false;
    
    heroImage.src = 'images/omori.png';
    enemyImage.src = 'images/enemy.png';

    restartContainer.classList.add('d-none');
    actionButtons.classList.remove('d-none');
    pushLog("You wake up again. Begin the battle.");
    updateUI();
});
updateUI();