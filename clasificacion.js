const elements = [
    { name: 'Manzana', category: 'frutas' },
    { name: 'Zanahoria', category: 'vegetales' },
    { name: 'Tomate', category: 'ambos' },
    { name: 'Lechuga', category: 'vegetales' },
    { name: 'Frutilla', category: 'frutas' },
    { name: 'Pimiento', category: 'vegetales' },
    { name: 'Palta', category: 'ambos' },
    { name: 'Uva', category: 'frutas' },
    { name: 'Pepino', category: 'vegetales' },
    { name: 'Calabaza', category: 'ambos' }
];

let currentElement;
let score = 0;
let canProceed = true;

function startGame() {
    shuffleArray(elements);
    nextElement();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function nextElement() {
    if (elements.length > 0) {
        currentElement = elements.pop();
        displayElementToClassify();
        document.getElementById('message').textContent = '';
        canProceed = true;
    } else {
        alert(`Juego terminado. Tu puntuación final es: ${score}`);
    }
}

function displayElementToClassify() {
    const elementToClassify = document.getElementById('element-to-classify');
    elementToClassify.textContent = currentElement.name;
    elementToClassify.setAttribute('draggable', true);
    elementToClassify.style.display = 'block';  // Asegura que el elemento sea visible
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const targetSet = ev.target.closest('.set').id;
    classifyElement(targetSet);
}

function classifyElement(targetSet) {
    if (checkClassification(targetSet)) {
        score += 10;
        showMessage('¡Correcto! +10 puntos', 'correct');
        addToSet(currentElement.name, currentElement.category);
        canProceed = true;
        document.getElementById('element-to-classify').style.display = 'none';  // Oculta el elemento clasificado
        setTimeout(nextElement, 1000);  // Espera 1 segundo antes de pasar al siguiente
    } else {
        showMessage('Incorrecto. Inténtalo de nuevo.', 'incorrect');
        canProceed = false;  // Permite intentar de nuevo
    }

    document.getElementById('score').textContent = `Puntuación: ${score}`;
}

function checkClassification(targetSet) {
    if (targetSet === 'set-a' && currentElement.category === 'frutas') return true;
    if (targetSet === 'set-b' && currentElement.category === 'vegetales') return true;
    if (targetSet === 'set-c' && currentElement.category === 'ambos') return true;
    return false;
}

function addToSet(element, category) {
    const setId = category === 'frutas' ? 'set-a' : (category === 'vegetales' ? 'set-b' : 'set-c');
    const setElement = document.createElement('div');
    setElement.textContent = element;
    setElement.className = 'element';
    document.querySelector(`#${setId}`).appendChild(setElement);
}

function showMessage(text, className) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = className;
    if (className === 'incorrect') {
        document.getElementById('element-to-classify').classList.add('shake');
        setTimeout(() => {
            document.getElementById('element-to-classify').classList.remove('shake');
        }, 500);
    }
}

document.getElementById('next-element').addEventListener('click', () => {
    if (canProceed) nextElement();
});

// Añadir event listeners para el arrastre a cada conjunto
document.querySelectorAll('.set').forEach(set => {
    set.addEventListener('drop', drop);
    set.addEventListener('dragover', allowDrop);
});

document.getElementById('element-to-classify').addEventListener('dragstart', drag);

startGame();
