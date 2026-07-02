const state = {
    currentValue: '0',
    previousValue: null,
    operation: null,
    shouldReset: false
};

const MAX_DIGITS = 15;

const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

let audioCtx = null;

function playClick() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 1200;
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
}

function formatDisplay(value) {
    if (value === 'Error') return 'Error';
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    const str = String(num);
    if (str.length > 15) {
        return num.toExponential(6);
    }
    return str;
}

function adjustFontSize() {
    const len = display.textContent.length;
    if (len <= 6) {
        display.style.fontSize = '';
    } else if (len <= 9) {
        display.style.fontSize = '44px';
    } else if (len <= 12) {
        display.style.fontSize = '34px';
    } else {
        display.style.fontSize = '26px';
    }
}

function updateDisplay() {
    display.textContent = formatDisplay(state.currentValue);
    adjustFontSize();
}

function inputNumber(num) {
    if (state.shouldReset) {
        state.currentValue = num;
        state.shouldReset = false;
    } else {
        const digitCount = state.currentValue.replace(/[^0-9]/g, '').length;
        if (digitCount >= MAX_DIGITS) return;
        if (state.currentValue === '0') {
            state.currentValue = num;
        } else {
            state.currentValue += num;
        }
    }
    updateDisplay();
}

function inputDecimal() {
    if (state.shouldReset) {
        state.currentValue = '0.';
        state.shouldReset = false;
        updateDisplay();
        return;
    }
    if (!state.currentValue.includes('.')) {
        state.currentValue += '.';
    }
    updateDisplay();
}

function clearAll() {
    state.currentValue = '0';
    state.previousValue = null;
    state.operation = null;
    state.shouldReset = false;
    updateDisplay();
}

function toggleSign() {
    if (state.currentValue !== '0') {
        state.currentValue = state.currentValue.startsWith('-')
            ? state.currentValue.slice(1)
            : '-' + state.currentValue;
    }
    updateDisplay();
}

function percent() {
    const num = parseFloat(state.currentValue);
    if (!isNaN(num)) {
        state.currentValue = String(num / 100);
    }
    updateDisplay();
}

function setOperation(op) {
    if (state.operation && !state.shouldReset) {
        calculate();
    }
    state.previousValue = state.currentValue;
    state.operation = op;
    state.shouldReset = true;
}

function calculate() {
    if (!state.operation || state.previousValue === null) return;
    const prev = parseFloat(state.previousValue);
    const curr = parseFloat(state.currentValue);
    if (isNaN(prev) || isNaN(curr)) return;
    let result;
    switch (state.operation) {
        case 'add': result = prev + curr; break;
        case 'subtract': result = prev - curr; break;
        case 'multiply': result = prev * curr; break;
        case 'divide': result = curr !== 0 ? prev / curr : 'Error'; break;
        default: return;
    }
    state.currentValue = String(result);
    state.operation = null;
    state.previousValue = null;
    state.shouldReset = true;
    updateDisplay();
}

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const btnLater = document.getElementById('btnLater');

function showModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', hideModal);
btnLater.addEventListener('click', hideModal);

document.querySelector('.btn-upgrade').addEventListener('click', function() {
    this.classList.add('pressed');
    setTimeout(() => this.classList.remove('pressed'), 300);
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideModal();
});

buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    playClick();

    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 100);

    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value !== undefined) {
        if (value === 'decimal') {
            inputDecimal();
        } else {
            inputNumber(value);
        }
    } else if (action) {
        switch (action) {
            case 'ac': clearAll(); break;
            case 'sign': toggleSign(); break;
            case 'percent': percent(); break;
            case 'divide':
            case 'multiply':
            case 'subtract':
            case 'add': setOperation(action); break;
            case 'equals': showModal(); break;
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (modalOverlay.classList.contains('active')) {
        if (e.key === 'Escape') {
            hideModal();
        }
        return;
    }

    if (e.key === 'Escape') {
        clearAll();
        playClick();
        return;
    }

    playClick();

    if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
    } else if (e.key === '.') {
        inputDecimal();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        showModal();
    } else if (e.key === 'Backspace') {
        if (state.currentValue.length > 1) {
            state.currentValue = state.currentValue.slice(0, -1);
        } else {
            state.currentValue = '0';
        }
        updateDisplay();
    } else if (e.key === '/' || e.key === '÷') {
        setOperation('divide');
    } else if (e.key === '*' || e.key === '×') {
        setOperation('multiply');
    } else if (e.key === '-') {
        setOperation('subtract');
    } else if (e.key === '+') {
        setOperation('add');
    } else if (e.key === '%') {
        percent();
    }
});

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-label', `Switch to ${next} mode`);
    playClick();
});
