const universe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let currentMission;
let currentLevel = 0;

const missions = [
    {
        description: "Crea dos conjuntos A y B, luego encuentra su unión (A ∪ B). A debe contener números pares y B números impares.",
        check: (setA, setB, result) => {
            const isAPar = setA.every(num => num % 2 === 0);
            const isBImpar = setB.every(num => num % 2 !== 0);
            const correctUnion = new Set([...setA, ...setB]);
            return isAPar && isBImpar && JSON.stringify([...result].sort()) === JSON.stringify([...correctUnion].sort());
        }
    },
    {
        description: "Crea dos conjuntos A y B, luego encuentra su intersección (A ∩ B). A debe contener números menores que 10 y B números mayores que 5.",
        check: (setA, setB, result) => {
            const isAMenor10 = setA.every(num => num < 10);
            const isBMayor5 = setB.every(num => num > 5);
            const correctIntersection = setA.filter(num => setB.includes(num));
            return isAMenor10 && isBMayor5 && JSON.stringify(result.sort()) === JSON.stringify(correctIntersection.sort());
        }
    },
    {
        description: "Crea dos conjuntos A y B, luego encuentra la diferencia A - B. A debe contener números primos y B números pares.",
        check: (setA, setB, result) => {
            const isPrime = num => {
                for(let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++)
                    if(num % i === 0) return false; 
                return num > 1;
            };
            const isAPrimo = setA.every(isPrime);
            const isBPar = setB.every(num => num % 2 === 0);
            const correctDifference = setA.filter(num => !setB.includes(num));
            return isAPrimo && isBPar && JSON.stringify(result.sort()) === JSON.stringify(correctDifference.sort());
        }
    }
];

function initGame() {
    createUniverseElements();
    setNextMission();
    addEventListeners();
}

function createUniverseElements() {
    const universeContainer = document.getElementById('universe');
    universeContainer.innerHTML = '';
    universe.forEach(num => {
        const element = document.createElement('div');
        element.textContent = num;
        element.className = 'element';
        element.draggable = true;
        element.addEventListener('dragstart', drag);
        universeContainer.appendChild(element);
    });
}

function setNextMission() {
    if (currentLevel < missions.length) {
        currentMission = missions[currentLevel];
        document.getElementById('mission').textContent = currentMission.description;
        currentLevel++;
    } else {
        document.getElementById('mission').textContent = "¡Felicidades! Has completado todos los niveles.";
        document.getElementById('check').style.display = 'none';
    }
}

function addEventListeners() {
    document.querySelectorAll('.set-items').forEach(container => {
        container.addEventListener('drop', drop);
        container.addEventListener('dragover', allowDrop);
    });
    document.getElementById('universe').addEventListener('drop', drop);
    document.getElementById('universe').addEventListener('dragover', allowDrop);
    document.getElementById('union').addEventListener('click', () => performOperation('union'));
    document.getElementById('intersection').addEventListener('click', () => performOperation('intersection'));
    document.getElementById('difference-ab').addEventListener('click', () => performOperation('difference-ab'));
    document.getElementById('difference-ba').addEventListener('click', () => performOperation('difference-ba'));
    document.getElementById('check').addEventListener('click', checkResult);
    document.getElementById('reset').addEventListener('click', resetLevel);
    document.getElementById('next-level').addEventListener('click', nextLevel);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.textContent);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const element = document.createElement('div');
    element.textContent = data;
    element.className = 'element';
    ev.target.closest('.set-items').appendChild(element);
}

function performOperation(operation) {
    const setA = Array.from(document.querySelector('#set-a .set-items').getElementsByClassName('element')).map(el => parseInt(el.textContent));
    const setB = Array.from(document.querySelector('#set-b .set-items').getElementsByClassName('element')).map(el => parseInt(el.textContent));
    let result;

    switch (operation) {
        case 'union':
            result = [...new Set([...setA, ...setB])];
            break;
        case 'intersection':
            result = setA.filter(x => setB.includes(x));
            break;
        case 'difference-ab':
            result = setA.filter(x => !setB.includes(x));
            break;
        case 'difference-ba':
            result = setB.filter(x => !setA.includes(x));
            break;
    }

    displayResult(result);
}

function displayResult(result) {
    const resultContainer = document.querySelector('#result .set-items');
    resultContainer.innerHTML = '';
    result.forEach(num => {
        const element = document.createElement('div');
        element.textContent = num;
        element.className = 'element';
        resultContainer.appendChild(element);
    });
}

function checkResult() {
    const setA = Array.from(document.querySelector('#set-a .set-items').getElementsByClassName('element')).map(el => parseInt(el.textContent));
    const setB = Array.from(document.querySelector('#set-b .set-items').getElementsByClassName('element')).map(el => parseInt(el.textContent));
    const result = Array.from(document.querySelector('#result .set-items').getElementsByClassName('element')).map(el => parseInt(el.textContent));
    const feedback = document.getElementById('feedback');
    
    if (currentMission.check(setA, setB, result)) {
        feedback.textContent = "¡Correcto! Has completado la misión.";
        feedback.style.color = "green";
        document.getElementById('next-level').style.display = 'inline-block';
        document.getElementById('check').style.display = 'none';
    } else {
        feedback.textContent = "Incorrecto. Revisa tus conjuntos y la operación realizada.";
        feedback.style.color = "red";
    }
}

function resetLevel() {
    createUniverseElements();
    document.querySelector('#set-a .set-items').innerHTML = '';
    document.querySelector('#set-b .set-items').innerHTML = '';
    document.querySelector('#result .set-items').innerHTML = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('check').style.display = 'inline-block';
    document.getElementById('next-level').style.display = 'none';
    document.getElementById('mission').textContent = currentMission.description;
}

function nextLevel() {
    currentLevel--;
    resetLevel();
    setNextMission();
}

initGame();
