const form = document.getElementById('charForm');
const errorSummary = document.getElementById('errorSummary');
const charName = document.getElementById('charName');
const mainClass = document.getElementById('mainClass');
const subClass = document.getElementById('subClass');
const auraType = document.getElementById('auraType');
const auraToggle = document.getElementById('auraToggle');
const strength = document.getElementById('strength');
const magic = document.getElementById('magic');
const agility = document.getElementById('agility');
const totalPoints = document.getElementById('totalPoints');

const previewAura = document.getElementById('previewAura');
const previewSprite = document.getElementById('previewSprite');

const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const modalName = document.getElementById('modalName');
const modalClass = document.getElementById('modalClass');
const modalDesc = document.getElementById('modalDesc');
const modalStr = document.getElementById('modalStr');
const modalMag = document.getElementById('modalMag');
const modalAgi = document.getElementById('modalAgi');
const modalAura = document.getElementById('modalAura');
const modalSprite = document.getElementById('modalSprite');

const forbiddenNames = ["LUCID", "SHADOW", "ADMIN", "OMORI", "CAT"];

const classDescriptions = {
    "Holy Knight": "A righteous defender clad in radiant armor, sworn to protect the realm using sacred holy power.",
    "Demonic Knight": "A fallen warrior who embraced dark powers, wielding hellfire and dark steel to devastate foes.",
    "Sage": "A master of ancient scrolls and arcane wisdom, wielding immense elemental spells from afar.",
    "Warlock": "A dark spellcaster who commands void magic and ancient curses to weaken their victims.",
    "Assassin": "A deadly shadow stalker moving in silence, striking foes precisely before vanishing into darkness.",
    "Ranger": "A master hunter of the wild forests, armed with a bow and keen instincts to trap prey.",
    "Plague Doctor": "A researcher of mysterious toxins and alchemy, utilizing alchemical brews to survive.",
    "Mad Chemist": "An erratic alchemist who loves volatile explosions and unpredictable chemical reactions."
};

const subClassesMap = {
    "Knight": ["Holy Knight", "Demonic Knight"],
    "Mage": ["Sage", "Warlock"],
    "Rogue": ["Assassin", "Ranger"],
    "Alchemist": ["Plague Doctor", "Mad Chemist"]
};

const allowedAurasMap = {
    "Holy Knight": ["Holy"],
    "Demonic Knight": ["Demonic"],
    "Sage": ["Arcane"],
    "Warlock": ["Demonic", "Arcane"],
    "Assassin": ["Demonic"],
    "Ranger": ["Holy"],
    "Plague Doctor": ["Demonic"],
    "Mad Chemist": ["Arcane"]
};

const bgMusic = document.getElementById('bgMusic');

if (bgMusic) {
    bgMusic.volume = 0.4;

    const playAudio = () => {
        bgMusic.play().then(() => {
            ['click', 'keydown', 'touchstart'].forEach(event => {
                window.removeEventListener(event, playAudio);
            });
        }).catch(err => {
            console.log("Autoplay waiting for user gesture:", err);
        });
    };

    ['click', 'keydown', 'touchstart'].forEach(event => {
        window.addEventListener(event, playAudio, { once: true });
    });
}

mainClass.addEventListener('change', () => {
    const selectedMain = mainClass.value;
    subClass.innerHTML = '<option value="">Select Subclass...</option>';
    auraType.innerHTML = '<option value="">Select Subclass First...</option>';
    subClass.disabled = true;
    auraType.disabled = true;

    if (selectedMain && subClassesMap[selectedMain]) {
        subClass.disabled = false;
        subClassesMap[selectedMain].forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subClass.appendChild(opt);
        });
    }
    updatePreview();
    validateAll();
});

subClass.addEventListener('change', () => {
    const selectedSub = subClass.value;
    auraType.innerHTML = '<option value="">Select Aura...</option>';
    auraType.disabled = true;

    if (selectedSub && allowedAurasMap[selectedSub]) {
        auraType.disabled = false;
        allowedAurasMap[selectedSub].forEach(aura => {
            const opt = document.createElement('option');
            opt.value = aura;
            opt.textContent = aura + " Aura";
            auraType.appendChild(opt);
        });
    }
    updatePreview();
    validateAll();
});

function calculateTotal() {
    return parseInt(strength.value || 0) + parseInt(magic.value || 0) + parseInt(agility.value || 0);
}

function updatePreview() {
    totalPoints.textContent = calculateTotal();

    const sub = subClass.value;
    const aura = auraType.value;
    const isAuraActive = auraToggle.checked;
    let spriteImg = "";

    if (sub === "Holy Knight") spriteImg = "url('images/cat_holy_knight.png')";
    else if (sub === "Demonic Knight") spriteImg = "url('images/cat_demonic_knight.png')";
    else if (sub === "Sage") spriteImg = "url('images/cat_sage.png')";
    else if (sub === "Warlock") spriteImg = "url('images/cat_warlock.png')";
    else if (sub === "Assassin") spriteImg = "url('images/cat_assassin.png')";
    else if (sub === "Ranger") spriteImg = "url('images/cat_ranger.png')";
    else if (sub === "Plague Doctor") spriteImg = "url('images/cat_plague_doctor.png')";
    else if (sub === "Mad Chemist") spriteImg = "url('images/cat_mad_chemist.png')";
    else spriteImg = "";

    previewSprite.style.backgroundImage = spriteImg;

    if (isAuraActive && aura) {
        if (aura === "Holy") previewAura.style.backgroundImage = "url('images/aura_holy.jpg')";
        else if (aura === "Demonic") previewAura.style.backgroundImage = "url('images/aura_demonic.jpg')";
        else if (aura === "Arcane") previewAura.style.backgroundImage = "url('images/aura_arcane.jpg')";
        previewAura.classList.add('active');
    } else {
        previewAura.classList.remove('active');
    }
}

function validateName() {
    const val = charName.value.trim().toUpperCase();
    const errEl = document.getElementById('charNameError');
    if (!val) {
        errEl.textContent = "Name cannot be empty.";
        charName.setAttribute('aria-invalid', 'true');
        return false;
    }
    if (forbiddenNames.includes(val)) {
        errEl.textContent = "This name is forbidden or already taken.";
        charName.setAttribute('aria-invalid', 'true');
        return false;
    }
    errEl.textContent = "";
    charName.setAttribute('aria-invalid', 'false');
    return true;
}

function validateClasses() {
    const mainVal = mainClass.value;
    const subVal = subClass.value;
    const mainErr = document.getElementById('mainClassError');
    const subErr = document.getElementById('subClassError');

    let isValid = true;
    if (!mainVal) {
        mainErr.textContent = "Please select a main class.";
        mainClass.setAttribute('aria-invalid', 'true');
        isValid = false;
    } else {
        mainErr.textContent = "";
        mainClass.setAttribute('aria-invalid', 'false');
    }

    if (!subVal) {
        subErr.textContent = "Please select a subclass.";
        subClass.setAttribute('aria-invalid', 'true');
        isValid = false;
    } else {
        subErr.textContent = "";
        subClass.setAttribute('aria-invalid', 'false');
    }
    return isValid;
}

function validateAura() {
    const val = auraType.value;
    const errEl = document.getElementById('auraTypeError');
    if (!auraType.disabled && !val) {
        errEl.textContent = "Please select an aura type.";
        auraType.setAttribute('aria-invalid', 'true');
        return false;
    }
    errEl.textContent = "";
    auraType.setAttribute('aria-invalid', 'false');
    return true;
}

function validateStats() {
    const s = parseInt(strength.value || 0);
    const m = parseInt(magic.value || 0);
    const a = parseInt(agility.value || 0);
    const total = s + m + a;
    const sub = subClass.value;

    const strErr = document.getElementById('strengthError');
    const magErr = document.getElementById('magicError');
    const agiErr = document.getElementById('agilityError');

    strErr.textContent = "";
    magErr.textContent = "";
    agiErr.textContent = "";
    strength.setAttribute('aria-invalid', 'false');
    magic.setAttribute('aria-invalid', 'false');
    agility.setAttribute('aria-invalid', 'false');

    let isValid = true;

    if (s < 1 || s > 10) {
        strErr.textContent = "Strength must be between 1 and 10.";
        strength.setAttribute('aria-invalid', 'true');
        isValid = false;
    }

    if (m < 1 || m > 10) {
        magErr.textContent = "Magic must be between 1 and 10.";
        magic.setAttribute('aria-invalid', 'true');
        isValid = false;
    }

    if (a < 1 || a > 10) {
        agiErr.textContent = "Agility must be between 1 and 10.";
        agility.setAttribute('aria-invalid', 'true');
        isValid = false;
    }

    if (total !== 20) {
        agiErr.textContent = `Total skill points must be exactly 20 (Current: ${total}).`;
        agility.setAttribute('aria-invalid', 'true');
        isValid = false;
    }

    if (sub === "Holy Knight" && (s < 7 || m < 3)) {
        if (s < 7) {
            strErr.textContent = "Holy Knight requires Strength >= 7.";
            strength.setAttribute('aria-invalid', 'true');
        }
        if (m < 3) {
            magErr.textContent = "Holy Knight requires Magic >= 3.";
            magic.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Demonic Knight" && (s < 8 || a > 4)) {
        if (s < 8) {
            strErr.textContent = "Demonic Knight requires Strength >= 8.";
            strength.setAttribute('aria-invalid', 'true');
        }
        if (a > 4) {
            agiErr.textContent = "Demonic Knight requires Agility <= 4.";
            agility.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Sage" && (m < 7 || s > 3)) {
        if (m < 7) {
            magErr.textContent = "Sage requires Magic >= 7.";
            magic.setAttribute('aria-invalid', 'true');
        }
        if (s > 3) {
            strErr.textContent = "Sage requires Strength <= 3.";
            strength.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Warlock" && (m < 8 || a < 3)) {
        if (m < 8) {
            magErr.textContent = "Warlock requires Magic >= 8.";
            magic.setAttribute('aria-invalid', 'true');
        }
        if (a < 3) {
            agiErr.textContent = "Warlock requires Agility >= 3.";
            agility.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Assassin" && (a < 7 || s < 3)) {
        if (a < 7) {
            agiErr.textContent = "Assassin requires Agility >= 7.";
            agility.setAttribute('aria-invalid', 'true');
        }
        if (s < 3) {
            strErr.textContent = "Assassin requires Strength >= 3.";
            strength.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Ranger" && (a < 7 || m < 3)) {
        if (a < 7) {
            agiErr.textContent = "Ranger requires Agility >= 7.";
            agility.setAttribute('aria-invalid', 'true');
        }
        if (m < 3) {
            magErr.textContent = "Ranger requires Magic >= 3.";
            magic.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Plague Doctor" && (m < 5 || a < 5)) {
        if (m < 5) {
            magErr.textContent = "Plague Doctor requires Magic >= 5.";
            magic.setAttribute('aria-invalid', 'true');
        }
        if (a < 5) {
            agiErr.textContent = "Plague Doctor requires Agility >= 5.";
            agility.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }
    if (sub === "Mad Chemist" && (s < 5 || m < 5)) {
        if (s < 5) {
            strErr.textContent = "Mad Chemist requires Strength >= 5.";
            strength.setAttribute('aria-invalid', 'true');
        }
        if (m < 5) {
            magErr.textContent = "Mad Chemist requires Magic >= 5.";
            magic.setAttribute('aria-invalid', 'true');
        }
        isValid = false;
    }

    return isValid;
}

function validateAll() {
    const v1 = validateName();
    const v2 = validateClasses();
    const v3 = validateAura();
    const v4 = validateStats();
    return v1 && v2 && v3 && v4;
}

[charName, mainClass, subClass, auraType, strength, magic, agility, auraToggle].forEach(el => {
    el.addEventListener('blur', () => {
        validateAll();
        updatePreview();
    });
    el.addEventListener('input', () => {
        validateAll();
        updatePreview();
    });
    el.addEventListener('change', () => {
        validateAll();
        updatePreview();
    });
});

closeModal.addEventListener('click', () => {
    modalOverlay.classList.add('d-none');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add('d-none');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = validateAll();
    
    if (!isValid) {
        const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
        errorSummary.textContent = `Submission failed! Found ${invalidFields.length} error(s). Please fix them below.`;
        errorSummary.classList.remove('d-none');
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
        }
        return;
    }

    errorSummary.classList.add('d-none');

    modalName.textContent = charName.value.trim();
    modalClass.textContent = `${mainClass.value} - ${subClass.value}`;
    modalDesc.textContent = classDescriptions[subClass.value] || "";
    modalStr.textContent = strength.value;
    modalMag.textContent = magic.value;
    modalAgi.textContent = agility.value;

    modalSprite.style.backgroundImage = previewSprite.style.backgroundImage;

    if (auraToggle.checked && auraType.value) {
        modalAura.style.backgroundImage = previewAura.style.backgroundImage;
        modalAura.classList.add('active');
    } else {
        modalAura.classList.remove('active');
    }

    modalOverlay.classList.remove('d-none');

    form.reset();
    subClass.disabled = true;
    subClass.innerHTML = '<option value="">Select Main Class First...</option>';
    auraType.disabled = true;
    auraType.innerHTML = '<option value="">Select Subclass First...</option>';
    updatePreview();
});

updatePreview();