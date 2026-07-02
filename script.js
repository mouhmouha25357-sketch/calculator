const state = {
    currentValue: '0',
    previousValue: null,
    operation: null,
    shouldReset: false
};

const MAX_DIGITS = 15;

const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

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

buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

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
            case 'equals': calculate(); break;
        }
    }
});
