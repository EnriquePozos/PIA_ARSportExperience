// ===== CAMERA INITIALIZATION =====
const video = document.getElementById('videoElement');
const cameraStatus = document.querySelector('.camera-status');

// Configuración de la cámara
const constraints = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment' // Usa la cámara trasera en móviles
    }
};

// Iniciar la cámara
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        cameraStatus.innerHTML = `
            <div class="status-indicator"></div>
            <span>Cámara activa</span>
        `;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        cameraStatus.innerHTML = `
            <div class="status-indicator" style="background: #ff0000;"></div>
            <span>Error de cámara</span>
        `;
        
        // Mostrar mensaje de error en el canvas
        const arCanvas = document.getElementById('arCanvas');
        arCanvas.innerHTML = `
            <div style="text-align: center; color: white; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; margin-bottom: 1rem; color: #ff3377;"></i>
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;">No se pudo acceder a la cámara</h3>
                <p>Por favor, permite el acceso a la cámara en tu navegador.</p>
                <button onclick="location.reload()" class="trivia-btn" style="margin-top: 1rem; padding: 0.8rem 2rem;">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }
}

// Detener la cámara cuando se navega a galería
function stopCamera() {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}

// Iniciar cámara al cargar la página
startCamera();

// ===== NAVIGATION FUNCTIONALITY =====
const navLinks = document.querySelectorAll('.nav-link');
const homePage = document.getElementById('homePage');
const galleryPage = document.getElementById('galleryPage');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show/hide pages
        const page = link.getAttribute('data-page');
        if (page === 'home') {
            homePage.style.display = 'block';
            galleryPage.style.display = 'none';
            // Reiniciar cámara al volver a home
            startCamera();
        } else if (page === 'gallery') {
            homePage.style.display = 'none';
            galleryPage.style.display = 'block';
            // Detener cámara al ir a galería
            stopCamera();
        }
    });
});

// ===== CONTROL BUTTONS FUNCTIONALITY =====
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');

let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const icon = playBtn.querySelector('i');
    
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
    
    console.log('Play/Pause toggled:', isPlaying);
});

prevBtn.addEventListener('click', () => {
    console.log('Previous model');
    // Aquí puedes agregar lógica para cambiar al modelo anterior
});

nextBtn.addEventListener('click', () => {
    console.log('Next model');
    // Aquí puedes agregar lógica para cambiar al siguiente modelo
});

// ===== TRIVIA FUNCTIONALITY =====
const triviaQuestions = [
    "¿Cuál es el diámetro oficial de un balón de fútbol profesional?",
    "¿En qué año se celebró el primer Mundial de Fútbol?",
    "¿Cuántos jugadores conforman un equipo de fútbol en el campo?",
    "¿Cuál es la duración oficial de un partido de fútbol?",
    "¿Quién es considerado el máximo goleador en la historia del fútbol?"
];

let currentQuestion = 0;
const triviaQuestion = document.getElementById('triviaQuestion');
const currentQSpan = document.getElementById('currentQ');
const totalQSpan = document.getElementById('totalQ');
const triviaPrev = document.getElementById('triviaPrev');
const triviaNext = document.getElementById('triviaNext');

totalQSpan.textContent = triviaQuestions.length;

function updateTrivia() {
    triviaQuestion.style.opacity = '0';
    setTimeout(() => {
        triviaQuestion.textContent = triviaQuestions[currentQuestion];
        currentQSpan.textContent = currentQuestion + 1;
        triviaQuestion.style.opacity = '1';
    }, 200);
}

// Agregar transición suave
triviaQuestion.style.transition = 'opacity 0.3s ease';

triviaPrev.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateTrivia();
    }
});

triviaNext.addEventListener('click', () => {
    if (currentQuestion < triviaQuestions.length - 1) {
        currentQuestion++;
        updateTrivia();
    }
});

// ===== SCAN DETECTION SIMULATION =====
function simulateScan(objectName, objectInfo) {
    const scanInfo = document.getElementById('scanInfo');
    scanInfo.innerHTML = `
        <div style="text-align: left;">
            <h4 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;">
                <i class="fas fa-check-circle" style="color: #00ff00;"></i> 
                ${objectName}
            </h4>
            <p style="font-size: 0.95rem; line-height: 1.6;">${objectInfo}</p>
        </div>
    `;
}

// Example: simulate scan after 3 seconds (for demonstration)
// Puedes comentar o eliminar esto cuando integres la detección real de AR
setTimeout(() => {
    simulateScan(
        'Balón Adidas Telstar',
        'El Telstar fue el primer balón diseñado específicamente para la Copa Mundial de la FIFA. Su diseño icónico de 32 paneles (12 pentágonos negros y 20 hexágonos blancos) lo convirtió en el balón más reconocible de la historia.'
    );
}, 3000);

// ===== FUNCIONES EXPORTABLES PARA AR =====
// Estas funciones pueden ser llamadas desde tu librería de AR

/**
 * Actualiza la información del objeto escaneado
 * @param {string} name - Nombre del objeto detectado
 * @param {string} description - Descripción del objeto
 */
function updateScanInfo(name, description) {
    simulateScan(name, description);
}

/**
 * Cambia al modelo anterior
 */
function previousModel() {
    prevBtn.click();
}

/**
 * Cambia al siguiente modelo
 */
function nextModel() {
    nextBtn.click();
}

/**
 * Alterna entre reproducir y pausar
 */
function togglePlayPause() {
    playBtn.click();
}

// Exportar funciones (opcional, para módulos ES6)
// export { updateScanInfo, previousModel, nextModel, togglePlayPause };