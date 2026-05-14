const output = document.getElementById('output');
const keys = document.querySelector('.keys');

let currentValue = '';
let previousValue = '';
let operator = null;
let shouldResetScreen = false;

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const buttonText = button.textContent;

  if (action === 'clear') {
    clearCalculator();
    return;
  }

  if (action === 'delete') {
    deleteLastDigit();
    return;
  }

  if (action === 'percent') {
    applyPercent();
    return;
  }

  if (action === 'decimal') {
    appendDecimal();
    return;
  }

  if (action === 'calculate') {
    calculateResult();
    return;
  }

  if (action === 'operator') {
    chooseOperator(buttonText);
    return;
  }

  appendNumber(buttonText);
});

function updateDisplay() {
  output.textContent = currentValue || '0';
}

function appendNumber(number) {
  if (shouldResetScreen) {
    currentValue = '';
    shouldResetScreen = false;
  }

  if (currentValue === '0' && number === '0') return;
  currentValue = `${currentValue}${number}`.replace(/^0+(?=\d)/, '');
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentValue = '0';
    shouldResetScreen = false;
  }

  if (!currentValue.includes('.')) {
    currentValue = currentValue === '' ? '0.' : `${currentValue}.`;
    updateDisplay();
  }
}

function chooseOperator(nextOperator) {
  if (currentValue === '' && previousValue !== '') {
    operator = nextOperator;
    return;
  }

  if (previousValue !== '') {
    calculateResult();
  }

  previousValue = currentValue || previousValue;
  operator = nextOperator;
  shouldResetScreen = true;
}

function calculateResult() {
  if (operator === null || currentValue === '' || previousValue === '') return;

  const firstNumber = parseFloat(previousValue);
  const secondNumber = parseFloat(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = firstNumber + secondNumber;
      break;
    case '-':
      result = firstNumber - secondNumber;
      break;
    case '*':
      result = firstNumber * secondNumber;
      break;
    case '/':
      result = secondNumber === 0 ? 'Error' : firstNumber / secondNumber;
      break;
    default:
      return;
  }

  currentValue = formatResult(result);
  previousValue = '';
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

function formatResult(value) {
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return String(Math.round(value * 100000000) / 100000000);
  }
  return String(value);
}

function deleteLastDigit() {
  if (shouldResetScreen) return;
  currentValue = currentValue.slice(0, -1);
  updateDisplay();
}

function clearCalculator() {
  currentValue = '';
  previousValue = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

function applyPercent() {
  if (currentValue === '') return;
  const number = parseFloat(currentValue);
  currentValue = String(number / 100);
  updateDisplay();
}

