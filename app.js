import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

// ===== CONFIGURACIÓN DE MODELOS 3D (9 ITEMS) =====
const models3D = [
    {
        id: 'ball',
        name: 'Balón de Fútbol',
        description: 'Un balón de fútbol profesional oficial FIFA.',
        type: 'sphere',
        color: 0xFFFFFF,
        scale: 0.5
    },
    {
        id: 'trophy',
        name: 'Trofeo de Campeonato',
        description: 'Copa dorada del campeonato.',
        type: 'cone',
        color: 0xFFD700,
        scale: 0.6
    },
    {
        id: 'cube',
        name: 'Cubo Deportivo',
        description: 'Modelo 3D de ejemplo.',
        type: 'box',
        color: 0xFF3377,
        scale: 0.5
    },
    {
        id: 'cylinder',
        name: 'Torre de Control',
        description: 'Representación cilíndrica de una estructura.',
        type: 'cylinder',
        color: 0x00FF00,
        scale: 0.6
    },
    {
        id: 'torus',
        name: 'Anillo Olímpico',
        description: 'Geometría circular compleja.',
        type: 'torus',
        color: 0x00FFFF,
        scale: 0.4
    },
    {
        id: 'icosahedron',
        name: 'Diamante',
        description: 'Figura multifacética brillante.',
        type: 'icosahedron',
        color: 0x9D00FF,
        scale: 0.5
    },
    {
        id: 'capsule',
        name: 'Cápsula del Tiempo',
        description: 'Contenedor futurista.',
        type: 'capsule',
        color: 0xFF8800,
        scale: 0.5
    },
    {
        id: 'dodecahedron',
        name: 'Balón Poligonal',
        description: 'Estructura matemática de 12 caras.',
        type: 'dodecahedron',
        color: 0xFF0055,
        scale: 0.55
    },
    {
        id: 'octahedron',
        name: 'Pirámide Doble',
        description: 'Estructura de equilibrio perfecto.',
        type: 'octahedron',
        color: 0x0000FF,
        scale: 0.6
    }
];

// ===== CONFIGURACIÓN DE TRIVIA (15 PREGUNTAS) =====
const triviaQuestions = [
    {
        question: "¿Cuál es el diámetro oficial de un balón de fútbol profesional?",
        options: ["68-70 cm", "60-62 cm", "72-74 cm", "65-67 cm"],
        correct: 0
    },
    {
        question: "¿En qué año se celebró el primer Mundial de Fútbol?",
        options: ["1928", "1930", "1934", "1926"],
        correct: 1
    },
    {
        question: "¿Cuántos jugadores conforman un equipo de fútbol en el campo?",
        options: ["9 jugadores", "10 jugadores", "11 jugadores", "12 jugadores"],
        correct: 2
    },
    {
        question: "¿Cuál es la duración oficial de un partido de fútbol?",
        options: ["80 minutos", "90 minutos", "100 minutos", "120 minutos"],
        correct: 1
    },
    {
        question: "¿Quién es considerado el máximo goleador en la historia del fútbol?",
        options: ["Pelé", "Lionel Messi", "Cristiano Ronaldo", "Josef Bican"],
        correct: 3
    },
    {
        question: "¿Qué país ha ganado más Copas del Mundo?",
        options: ["Alemania", "Argentina", "Brasil", "Italia"],
        correct: 2
    },
    {
        question: "¿En qué año se fundó la FIFA?",
        options: ["1900", "1904", "1910", "1920"],
        correct: 1
    },
    {
        question: "¿Cuánto mide un campo de fútbol profesional de largo?",
        options: ["90-120 metros", "100-110 metros", "80-100 metros", "110-120 metros"],
        correct: 1
    },
    {
        question: "¿Qué jugador tiene el récord de más goles en un Mundial?",
        options: ["Ronaldo", "Miroslav Klose", "Pelé", "Gerd Müller"],
        correct: 1
    },
    {
        question: "¿Cuál es el tiempo de un medio tiempo en el fútbol?",
        options: ["40 minutos", "45 minutos", "50 minutos", "60 minutos"],
        correct: 1
    },
    {
        question: "¿Qué país organizó el primer Mundial de Fútbol?",
        options: ["Brasil", "Argentina", "Uruguay", "Italia"],
        correct: 2
    },
    {
        question: "¿Cuántos cambios se permiten en un partido oficial de fútbol?",
        options: ["3 cambios", "5 cambios", "7 cambios", "Sin límite"],
        correct: 1
    },
    {
        question: "¿Qué color de tarjeta expulsa directamente a un jugador?",
        options: ["Amarilla", "Roja", "Verde", "Azul"],
        correct: 1
    },
    {
        question: "¿Cuántos pentágonos tiene un balón de fútbol tradicional?",
        options: ["10", "12", "15", "20"],
        correct: 1
    },
    {
        question: "¿En qué año se introdujo el VAR en el fútbol?",
        options: ["2014", "2016", "2018", "2020"],
        correct: 2
    }
];

// ===== VARIABLES GLOBALES =====
let mindarThree;
let isARStarted = false;
let currentObject = null;
let currentAnchor = null;
let isAnimating = false;
let manualRotation = 0;

// Variables de trivia
let currentQuestion = 0;
let correctAnswers = 0;
let answeredQuestions = new Set();

// ===== INICIALIZACIÓN DE MIND AR =====
async function initAR() {
    const container = document.getElementById('container');
    const arStatus = document.getElementById('arStatus');
    
    if(container) container.innerHTML = '';

    try {
        updateStatus('Iniciando cámara AR...', 'loading');
        
        mindarThree = new MindARThree({
            container: container,
            imageTargetSrc: './banderas.mind',
            uiLoading: "no",
            uiScanning: "no", 
            uiError: "no"
        });
        
        const { renderer, scene, camera } = mindarThree;
        renderer.setClearColor(0x000000, 0);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);
        
        models3D.forEach((item, index) => {
            const anchor = mindarThree.addAnchor(index);
            const mesh = createModel(item);
            anchor.group.add(mesh);
            
            anchor.onTargetFound = () => {
                console.log(`¡Marcador ${index} (${item.name}) detectado!`);
                currentObject = mesh;
                currentAnchor = anchor;
                updateStatus(`¡${item.name} detectado!`, 'active');
                updateScanInfo(item);
            };
            
            anchor.onTargetLost = () => {
                console.log(`Marcador ${index} perdido`);
                updateStatus('Buscando marcador...', 'searching');
                resetScanInfo();
            };
        });
        
        await mindarThree.start();
        updateStatus('AR activo - Apunta a un marcador', 'active');
        isARStarted = true;
        
        renderer.setAnimationLoop(() => {
            if (currentObject && currentAnchor && currentAnchor.visible) {
                if (isAnimating) {
                    manualRotation += 0.02;
                }
                currentObject.rotation.y = manualRotation;
            }
            renderer.render(scene, camera);
        });
        
    } catch (error) {
        console.error('Error al iniciar AR:', error);
        updateStatus('Error al iniciar AR', 'error');
        showARError(error.message);
    }
}

// ===== CREAR MODELOS 3D =====
function createModel(modelData) {
    let geometry, material, mesh;
    
    const baseMaterial = new THREE.MeshBasicMaterial({
        color: modelData.color,
        transparent: true,
        opacity: 0.9,
    });

    switch(modelData.type) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(modelData.scale, 32, 32);
            material = baseMaterial;
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(modelData.scale * 0.5, modelData.scale * 1.5, 32);
            material = baseMaterial;
            break;
        case 'box':
            geometry = new THREE.BoxGeometry(modelData.scale, modelData.scale, modelData.scale);
            material = baseMaterial;
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(modelData.scale * 0.4, modelData.scale * 0.4, modelData.scale * 1.2, 32);
            material = baseMaterial;
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(modelData.scale, modelData.scale * 0.3, 16, 100);
            material = baseMaterial;
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(modelData.scale, 0);
            material = baseMaterial;
            break;
        case 'capsule':
            geometry = new THREE.CapsuleGeometry(modelData.scale * 0.3, modelData.scale * 0.8, 4, 8);
            material = baseMaterial;
            break;
        case 'dodecahedron':
            geometry = new THREE.DodecahedronGeometry(modelData.scale, 0);
            material = baseMaterial;
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(modelData.scale, 0);
            material = baseMaterial;
            break;
        default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            material = baseMaterial;
    }

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0.3);
    
    return mesh;
}

// ===== ROTAR MODELO =====
function rotateModel(direction) {
    if (!isARStarted || !currentObject) return;
    
    const rotationAmount = Math.PI / 8;
    
    if (direction === 'left') {
        manualRotation -= rotationAmount;
    } else if (direction === 'right') {
        manualRotation += rotationAmount;
    }
}

// ===== TOGGLE ANIMACIÓN =====
function toggleAnimation() {
    isAnimating = !isAnimating;
}

// ===== ACTUALIZAR UI =====
function updateStatus(message, status) {
    const arStatus = document.getElementById('arStatus');
    if (!arStatus) return;
    
    const statusIndicator = arStatus.querySelector('.status-indicator');
    const statusText = arStatus.querySelector('span');
    
    statusText.textContent = message;
    
    switch(status) {
        case 'loading':
            statusIndicator.style.background = '#FFA500';
            break;
        case 'active':
            statusIndicator.style.background = '#00ff00';
            break;
        case 'searching':
            statusIndicator.style.background = '#00ffff';
            break;
        case 'error':
            statusIndicator.style.background = '#ff0000';
            break;
    }
}

function updateScanInfo(modelData) {
    const scanInfo = document.getElementById('scanInfo');
    scanInfo.innerHTML = `
        <div style="text-align: left;">
            <h4 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;">
                <i class="fas fa-check-circle" style="color: #00ff00;"></i> 
                ${modelData.name}
            </h4>
            <p style="font-size: 0.95rem; line-height: 1.6;">${modelData.description}</p>
        </div>
    `;
}

function resetScanInfo() {
    const scanInfo = document.getElementById('scanInfo');
    scanInfo.innerHTML = `
        <div class="scan-placeholder">
            <i class="fas fa-qrcode"></i>
            <p>Apunta la cámara a un marcador para ver el objeto en AR</p>
        </div>
    `;
}

function showARError(errorMessage = '') {
    const container = document.getElementById('container');
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align: center; color: white; padding: 2rem; background: rgba(0,0,0,0.8);">
            <div>
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; margin-bottom: 1rem; color: #ff3377;"></i>
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;">No se pudo iniciar AR</h3>
                ${errorMessage ? `<p style="color: #ff8888; margin-bottom: 1rem; font-family: monospace; font-size: 0.9rem;">${errorMessage}</p>` : ''}
                <button onclick="location.reload()" class="trivia-btn" style="margin-top: 1.5rem; padding: 0.8rem 2rem;">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        </div>
    `;
}

// ===== DETENER AR =====
function stopAR() {
    if (mindarThree) {
        mindarThree.stop();
        if(mindarThree.renderer) {
            mindarThree.renderer.setAnimationLoop(null);
        }
        mindarThree = null;
        isARStarted = false;
        const container = document.getElementById('container');
        if (container) container.innerHTML = '';
    }
}

// ===== NAVEGACIÓN =====
const navLinks = document.querySelectorAll('.nav-link');
const homePage = document.getElementById('homePage');
const galleryPage = document.getElementById('galleryPage');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const page = link.getAttribute('data-page');
        if (page === 'home') {
            homePage.style.display = 'block';
            galleryPage.style.display = 'none';
            if (!isARStarted) initAR();
        } else if (page === 'gallery') {
            homePage.style.display = 'none';
            galleryPage.style.display = 'block';
            stopAR();
        }
    });
});

// ===== BOTONES DE CONTROL AR =====
document.getElementById('prevBtn').addEventListener('click', () => rotateModel('left'));
document.getElementById('nextBtn').addEventListener('click', () => rotateModel('right'));
document.getElementById('playBtn').addEventListener('click', () => {
    toggleAnimation();
    const icon = document.getElementById('playBtn').querySelector('i');
    if (isAnimating) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
});

// ===== SISTEMA DE TRIVIA =====
const triviaQuestion = document.getElementById('triviaQuestion');
const triviaOptions = document.getElementById('triviaOptions');
const currentQSpan = document.getElementById('currentQ');
const totalQSpan = document.getElementById('totalQ');
const triviaPrev = document.getElementById('triviaPrev');
const triviaNext = document.getElementById('triviaNext');
const triviaScore = document.getElementById('triviaScore');

totalQSpan.textContent = triviaQuestions.length;

// Cargar pregunta
function loadQuestion() {
    const question = triviaQuestions[currentQuestion];
    
    triviaQuestion.textContent = question.question;
    currentQSpan.textContent = currentQuestion + 1;
    updateScore();
    
    triviaOptions.innerHTML = '';
    const wasAnswered = answeredQuestions.has(currentQuestion);
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'trivia-option-btn';
        button.textContent = option;
        
        if (wasAnswered) {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('disabled');
            }
        } else {
            button.addEventListener('click', () => checkAnswer(index, button));
        }
        
        triviaOptions.appendChild(button);
    });
}

// Verificar respuesta
function checkAnswer(selectedIndex, button) {
    const question = triviaQuestions[currentQuestion];
    const allButtons = triviaOptions.querySelectorAll('.trivia-option-btn');
    
    answeredQuestions.add(currentQuestion);
    allButtons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === question.correct) {
        button.classList.add('correct');
        correctAnswers++;
    } else {
        button.classList.add('incorrect');
        allButtons[question.correct].classList.add('correct');
    }
    
    updateScore();
    
    // Auto-avanzar después de 1.5 segundos
    setTimeout(() => {
        if (currentQuestion < triviaQuestions.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }, 1500);
}

// Actualizar puntuación
function updateScore() {
    const answered = answeredQuestions.size;
    triviaScore.textContent = `${correctAnswers}/${answered} correctas`;
}

// Navegar preguntas
triviaPrev.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

triviaNext.addEventListener('click', () => {
    if (currentQuestion < triviaQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
});

// ===== MODAL DE ESTADÍSTICAS =====

// Mock data de selecciones de fútbol
const footballTeamsData = [
    {
        rank: 1,
        name: "Argentina",
        flag: "🇦🇷",
        continent: "Sudamérica",
        worldCups: 3,
        copaAmerica: 15,
        totalMatches: 1056,
        wins: 593,
        goals: 2346
    },
    {
        rank: 2,
        name: "Francia",
        flag: "🇫🇷",
        continent: "Europa",
        worldCups: 2,
        copaAmerica: 0,
        totalMatches: 954,
        wins: 553,
        goals: 2145
    },
    {
        rank: 3,
        name: "Brasil",
        flag: "🇧🇷",
        continent: "Sudamérica",
        worldCups: 5,
        copaAmerica: 9,
        totalMatches: 1120,
        wins: 739,
        goals: 2653
    },
    {
        rank: 4,
        name: "Inglaterra",
        flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        continent: "Europa",
        worldCups: 1,
        copaAmerica: 0,
        totalMatches: 1024,
        wins: 598,
        goals: 2198
    },
    {
        rank: 5,
        name: "Bélgica",
        flag: "🇧🇪",
        continent: "Europa",
        worldCups: 0,
        copaAmerica: 0,
        totalMatches: 812,
        wins: 417,
        goals: 1534
    },
    {
        rank: 6,
        name: "Países Bajos",
        flag: "🇳🇱",
        continent: "Europa",
        worldCups: 0,
        copaAmerica: 0,
        totalMatches: 897,
        wins: 532,
        goals: 1956
    },
    {
        rank: 7,
        name: "Portugal",
        flag: "🇵🇹",
        continent: "Europa",
        worldCups: 0,
        copaAmerica: 0,
        totalMatches: 782,
        wins: 456,
        goals: 1632
    },
    {
        rank: 8,
        name: "España",
        flag: "🇪🇸",
        continent: "Europa",
        worldCups: 1,
        copaAmerica: 0,
        totalMatches: 896,
        wins: 543,
        goals: 1998
    }
];

// Mock data de goleadores históricos
const topScorersData = [
    { position: 1, name: "Cristiano Ronaldo", team: "Portugal", goals: 128 },
    { position: 2, name: "Lionel Messi", team: "Argentina", goals: 106 },
    { position: 3, name: "Ali Daei", team: "Irán", goals: 109 },
    { position: 4, name: "Sunil Chhetri", team: "India", goals: 94 },
    { position: 5, name: "Mokhtar Dahari", team: "Malasia", goals: 89 },
    { position: 6, name: "Pelé", team: "Brasil", goals: 77 },
    { position: 7, name: "Godfrey Chitalu", team: "Zambia", goals: 79 },
    { position: 8, name: "Hussein Saeed", team: "Irak", goals: 78 }
];

// Elementos del modal
const statsModal = document.getElementById('statsModal');
const statsBtn = document.getElementById('statsBtn');
const statsModalClose = document.getElementById('statsModalClose');
const statsModalBody = document.getElementById('statsModalBody');

// Abrir modal
statsBtn.addEventListener('click', () => {
    statsModal.classList.add('active');
    renderStatsContent();
});

// Cerrar modal
statsModalClose.addEventListener('click', () => {
    statsModal.classList.remove('active');
});

// Cerrar modal al hacer click en el overlay
statsModal.querySelector('.stats-modal-overlay').addEventListener('click', () => {
    statsModal.classList.remove('active');
});

// Prevenir que el click en el contenido cierre el modal
statsModal.querySelector('.stats-modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && statsModal.classList.contains('active')) {
        statsModal.classList.remove('active');
    }
});

// Renderizar contenido del modal
function renderStatsContent() {
    let html = '<h3 class="section-title"><i class="fas fa-globe"></i> Ranking FIFA - Top 8 Selecciones</h3>';
    
    // Renderizar selecciones
    footballTeamsData.forEach(team => {
        html += `
            <div class="team-card">
                <div class="team-card-header">
                    <div class="team-rank">#${team.rank}</div>
                    <div class="team-flag">${team.flag}</div>
                    <div class="team-info">
                        <div class="team-name">${team.name}</div>
                        <div class="team-continent">${team.continent}</div>
                    </div>
                </div>
                <div class="team-stats">
                    <div class="stat-item">
                        <div class="stat-value">${team.worldCups}</div>
                        <div class="stat-label">Mundiales</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${team.totalMatches}</div>
                        <div class="stat-label">Partidos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${team.wins}</div>
                        <div class="stat-label">Victorias</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${team.goals}</div>
                        <div class="stat-label">Goles</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Sección de goleadores
    html += '<h3 class="section-title"><i class="fas fa-star"></i> Máximos Goleadores Históricos</h3>';
    
    topScorersData.forEach(player => {
        html += `
            <div class="player-card">
                <div class="player-position">${player.position}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-team">${player.team}</div>
                </div>
                <div>
                    <div class="player-goals">${player.goals}</div>
                    <div class="player-goals-label">goles</div>
                </div>
            </div>
        `;
    });
    
    statsModalBody.innerHTML = html;
}

// ===== SISTEMA DE TUTORIAL =====

// Pasos del tutorial
const tutorialSteps = [
    {
        id: 'welcome',
        target: null, // Sin elemento específico
        title: '¡Bienvenido a AR Sports!',
        description: 'Esta aplicación te permite explorar el mundo del fútbol con Realidad Aumentada. Te mostraremos cómo usarla.',
        icon: 'fa-rocket',
        position: 'center'
    },
    {
        id: 'ar-canvas',
        target: '#arCanvas',
        title: 'Visor de Realidad Aumentada',
        description: 'Apunta tu cámara a un marcador para ver objetos 3D flotando en el espacio real. Los objetos aparecerán automáticamente.',
        icon: 'fa-camera',
        position: 'top'
    },
    {
        id: 'controls',
        target: '.controls',
        title: 'Controles 3D',
        description: 'Usa los botones izquierdo/derecho para rotar el modelo. El botón central activa la rotación automática.',
        icon: 'fa-gamepad',
        position: 'top'
    },
    {
        id: 'trivia',
        target: '.trivia-card',
        title: 'Trivia Interactiva',
        description: 'Responde preguntas sobre fútbol. Selecciona una respuesta y descubre si es correcta. ¡Acumula puntos!',
        icon: 'fa-brain',
        position: 'left'
    },
    {
        id: 'scan-info',
        target: '.scan-info',
        title: 'Información del Objeto',
        description: 'Cuando detectes un marcador, aquí verás información detallada sobre el objeto 3D que estás visualizando.',
        icon: 'fa-info-circle',
        position: 'left'
    },
    {
        id: 'gallery',
        target: '[data-page="gallery"]',
        title: 'Galería de Videos',
        description: 'Accede a una colección de videos deportivos. Explora contenido multimedia relacionado con el fútbol.',
        icon: 'fa-video',
        position: 'bottom'
    },
    {
        id: 'stats',
        target: '#statsBtn',
        title: 'Estadísticas Mundiales',
        description: '¡Haz clic aquí para ver ranking FIFA, goleadores históricos y datos de selecciones! ¡Ya estás listo para usar la app!',
        icon: 'fa-chart-bar',
        position: 'bottom'
    }
];

// Variables del tutorial
let currentTutorialStep = 0;
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialSpotlight = document.getElementById('tutorialSpotlight');
const tutorialTooltip = document.getElementById('tutorialTooltip');
const tutorialProgress = document.getElementById('tutorialProgress');
const tutorialTitle = document.getElementById('tutorialTitle');
const tutorialDescription = document.getElementById('tutorialDescription');
const tutorialIcon = document.getElementById('tutorialIcon');
const tutorialPrev = document.getElementById('tutorialPrev');
const tutorialNext = document.getElementById('tutorialNext');
const tutorialSkip = document.getElementById('tutorialSkip');
const helpBtn = document.getElementById('helpBtn');

// Verificar si es la primera vez
function checkFirstTime() {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
        // Esperar a que todo cargue
        setTimeout(() => {
            startTutorial();
        }, 1000);
    }
}

// Iniciar tutorial
function startTutorial() {
    currentTutorialStep = 0;
    tutorialOverlay.classList.add('active');
    showTutorialStep(currentTutorialStep);
}

// Mostrar paso del tutorial
function showTutorialStep(stepIndex) {
    const step = tutorialSteps[stepIndex];
    
    // Actualizar progreso
    tutorialProgress.textContent = `Paso ${stepIndex + 1}/${tutorialSteps.length}`;
    
    // Actualizar contenido
    tutorialTitle.textContent = step.title;
    tutorialDescription.textContent = step.description;
    tutorialIcon.innerHTML = `<i class="fas ${step.icon}"></i>`;
    
    // Actualizar botones
    tutorialPrev.disabled = stepIndex === 0;
    tutorialNext.textContent = stepIndex === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    
    // Posicionar spotlight y tooltip
    if (step.target) {
        const target = document.querySelector(step.target);
        if (target) {
            positionSpotlight(target);
            positionTooltip(target, step.position);
        }
    } else {
        // Sin spotlight, tooltip centrado
        tutorialSpotlight.style.display = 'none';
        centerTooltip();
    }
}

// Posicionar spotlight
function positionSpotlight(element) {
    const rect = element.getBoundingClientRect();
    tutorialSpotlight.style.display = 'block';
    tutorialSpotlight.style.top = `${rect.top - 10}px`;
    tutorialSpotlight.style.left = `${rect.left - 10}px`;
    tutorialSpotlight.style.width = `${rect.width + 20}px`;
    tutorialSpotlight.style.height = `${rect.height + 20}px`;
}

// Posicionar tooltip
function positionTooltip(element, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tutorialTooltip.getBoundingClientRect();
    
    // Remover todas las clases de flecha
    tutorialTooltip.classList.remove('arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right');
    
    let top, left;
    
    switch(position) {
        case 'top':
            top = rect.bottom + 20;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tutorialTooltip.classList.add('arrow-top');
            break;
        case 'bottom':
            top = rect.top - tooltipRect.height - 20;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tutorialTooltip.classList.add('arrow-bottom');
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 20;
            tutorialTooltip.classList.add('arrow-left');
            break;
        case 'right':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 20;
            tutorialTooltip.classList.add('arrow-right');
            break;
        default:
            centerTooltip();
            return;
    }
    
    // Ajustar si se sale de la pantalla
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = window.innerHeight - tooltipRect.height - 10;
    }
    
    tutorialTooltip.style.top = `${top}px`;
    tutorialTooltip.style.left = `${left}px`;
}

// Centrar tooltip
function centerTooltip() {
    tutorialTooltip.classList.remove('arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right');
    tutorialTooltip.style.top = '50%';
    tutorialTooltip.style.left = '50%';
    tutorialTooltip.style.transform = 'translate(-50%, -50%)';
}

// Navegar hacia adelante
tutorialNext.addEventListener('click', () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
        currentTutorialStep++;
        showTutorialStep(currentTutorialStep);
    } else {
        finishTutorial();
    }
});

// Navegar hacia atrás
tutorialPrev.addEventListener('click', () => {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep(currentTutorialStep);
    }
});

// Saltar tutorial
tutorialSkip.addEventListener('click', () => {
    finishTutorial();
});

// Finalizar tutorial
function finishTutorial() {
    tutorialOverlay.classList.remove('active');
    localStorage.setItem('hasSeenTutorial', 'true');
}

// Botón de ayuda para reactivar tutorial
helpBtn.addEventListener('click', () => {
    startTutorial();
});

// Reposicionar en resize
window.addEventListener('resize', () => {
    if (tutorialOverlay.classList.contains('active')) {
        showTutorialStep(currentTutorialStep);
    }
});

// ===== INICIALIZAR AL CARGAR =====
window.addEventListener('load', () => {
    console.log('✅ Aplicación AR cargada');
    loadQuestion();
    if(homePage.style.display !== 'none') initAR();
    
    // Verificar si mostrar tutorial
    checkFirstTime();
});