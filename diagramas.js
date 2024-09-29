document.addEventListener('DOMContentLoaded', function() {
    const setAInput = document.getElementById('setA');
    const setBInput = document.getElementById('setB');
    const operationButtons = document.querySelectorAll('.btn-operation');
    const resultDiv = document.getElementById('result');
    const vennDiagramDiv = document.getElementById('venn-diagram');

    operationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const operation = this.getAttribute('data-operation');
            const setA = new Set(setAInput.value.split(',').map(item => item.trim()));
            const setB = new Set(setBInput.value.split(',').map(item => item.trim()));
            const result = performOperation(setA, setB, operation);
            displayResult(result, operation);
            drawVennDiagram(setA, setB, operation);
        });
    });

    function performOperation(setA, setB, operation) {
        switch(operation) {
            case 'AUB':
                return new Set([...setA, ...setB]);
            case 'AnB':
                return new Set([...setA].filter(x => setB.has(x)));
            case 'A-B':
                return new Set([...setA].filter(x => !setB.has(x)));
            case 'B-A':
                return new Set([...setB].filter(x => !setA.has(x)));
            case 'AΔB':
                return new Set(
                    [...setA].filter(x => !setB.has(x)).concat([...setB].filter(x => !setA.has(x)))
                );
        }
    }

    function displayResult(result, operation) {
        resultDiv.textContent = `${operation} = ${[...result].join(', ')}`;
    }

    function drawVennDiagram(setA, setB, operation) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 900 600");
        
        const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle1.setAttribute("cx", "300");
        circle1.setAttribute("cy", "300");
        circle1.setAttribute("r", "225");
        circle1.setAttribute("fill", "rgba(181, 166, 66, 0.7)");
        
        const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle2.setAttribute("cx", "600");
        circle2.setAttribute("cy", "300");
        circle2.setAttribute("r", "225");
        circle2.setAttribute("fill", "rgba(76, 187, 23, 0.7)");
        
        svg.appendChild(circle1);
        svg.appendChild(circle2);

        addText(150, 150, "A", "white", 30);
        addText(750, 150, "B", "white", 30);

        function addText(x, y, content, color = "white", fontSize = 20) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.setAttribute("fill", color);
            text.setAttribute("font-size", fontSize);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.textContent = content;
            svg.appendChild(text);
        }

        function addSetText(x, y, elements) {
            const text = elements.join(', ');  // Eliminamos los corchetes aquí
            addText(x, y, text, "white", 24);
        }

        const elementsOnlyInA = [...setA].filter(elem => !setB.has(elem));
        const elementsOnlyInB = [...setB].filter(elem => !setA.has(elem));
        const intersectionElements = [...setA].filter(elem => setB.has(elem));

        addSetText(200, 300, elementsOnlyInA);
        addSetText(700, 300, elementsOnlyInB);
        addSetText(450, 300, intersectionElements);

        switch(operation) {
            case 'AUB':
                break;
            case 'AnB':
                circle1.setAttribute("fill", "rgba(181, 166, 66, 0.3)");
                circle2.setAttribute("fill", "rgba(76, 187, 23, 0.3)");
                const intersection = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                intersection.setAttribute("cx", "450");
                intersection.setAttribute("cy", "300");
                intersection.setAttribute("r", "105");
                intersection.setAttribute("fill", "rgba(128, 128, 0, 0.7)");
                svg.appendChild(intersection);
                break;
            case 'A-B':
                circle2.setAttribute("fill", "rgba(76, 187, 23, 0.1)");
                break;
            case 'B-A':
                circle1.setAttribute("fill", "rgba(181, 166, 66, 0.1)");
                break;
            case 'AΔB':
                const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                clipPath.setAttribute("id", "clip");
                const clipCircle1 = circle1.cloneNode();
                const clipCircle2 = circle2.cloneNode();
                clipPath.appendChild(clipCircle1);
                clipPath.appendChild(clipCircle2);
                svg.appendChild(clipPath);

                const symdiff = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                symdiff.setAttribute("x", "0");
                symdiff.setAttribute("y", "0");
                symdiff.setAttribute("width", "900");
                symdiff.setAttribute("height", "600");
                symdiff.setAttribute("fill", "rgba(128, 128, 128, 0.7)");
                symdiff.setAttribute("clip-path", "url(#clip)");
                svg.insertBefore(symdiff, svg.firstChild);
                break;
        }

        vennDiagramDiv.innerHTML = '';
        vennDiagramDiv.appendChild(svg);
    }
});