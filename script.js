document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn:not(.btn-diagramas)');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            irA(section);
        });
    });
});

function irA(seccion) {
    switch(seccion) {
        case 'quiz':
            alert('Redirigiendo al Quiz... Esta sección está en desarrollo.');
            // Aquí iría el código para redirigir a la página del quiz cuando esté lista
            break;
        case 'glosario':
            alert('Redirigiendo al Glosario... Esta sección está en desarrollo.');
            // Aquí iría el código para redirigir a la página del glosario cuando esté lista
            break;
    }
}
