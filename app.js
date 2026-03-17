import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';
// Importamos la nueva herramienta para cargar modelos 3D reales
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ===== CONFIGURACIÓN DE MODELOS 3D Y DATOS CURIOSOS (9 SELECCIONES) =====
const models3D = [
    { id: 'mexico', name: 'México', description: 'Único país en ser sede de tres Copas del Mundo (1970, 1986 y 2026).', url: './models/mexico.glb', scale: 5 },
    { id: 'sudafrica', name: 'Sudáfrica', description: 'Primer país africano en albergar una Copa del Mundo de la FIFA (2010).', url: './models/sudafrica.glb', scale: 5 },
    { id: 'tunez', name: 'Túnez', description: 'Primera selección africana en ganar un partido mundialista (contra México en 1978).', url: './models/tunez.glb', scale: 5 },
    { id: 'uruguay', name: 'Uruguay', description: 'Primer campeón del mundo en la historia (1930) y protagonista del épico Maracanazo.', url: './models/uruguay.glb', scale: 5 },
    { id: 'uzbekistan', name: 'Uzbekistán', description: 'Potencia emergente de Asia, recientes campeones de la Copa Asiática Sub-20.', url: './models/uzbekistan.glb', scale: 5 },
    { id: 'colombia', name: 'Colombia', description: 'Su mejor participación histórica fue llegar a Cuartos de Final en Brasil 2014.', url: './models/colombia.glb', scale: 5 },
    { id: 'corea', name: 'Corea del Sur', description: 'Único país asiático en alcanzar las Semifinales de un Mundial (2002).', url: './models/korea.glb', scale: 5 },
    { id: 'espana', name: 'España', description: 'Campeones en 2010 deslumbrando al mundo con su icónico estilo "Tiki-Taka".', url: './models/espania.glb', scale: 5 },
    { id: 'japon', name: 'Japón', description: 'Famosos por dejar su vestidor impecable y con grullas de origami tras cada partido.', url: './models/japon.glb', scale: 5 }
];

// ===== CONFIGURACIÓN DE TRIVIA (15 PREGUNTAS) =====
const triviaQuestions = [
    { question: "¿Cuál es el diámetro oficial de un balón de fútbol profesional?", options: ["68-70 cm", "60-62 cm", "72-74 cm", "65-67 cm"], correct: 0 },
    { question: "¿En qué año se celebró el primer Mundial de Fútbol?", options: ["1928", "1930", "1934", "1926"], correct: 1 },
    { question: "¿Cuántos jugadores conforman un equipo de fútbol en el campo?", options: ["9 jugadores", "10 jugadores", "11 jugadores", "12 jugadores"], correct: 2 },
    { question: "¿Cuál es la duración oficial de un partido de fútbol?", options: ["80 minutos", "90 minutos", "100 minutos", "120 minutos"], correct: 1 },
    { question: "¿Quién es considerado el máximo goleador en la historia del fútbol?", options: ["Pelé", "Lionel Messi", "Cristiano Ronaldo", "Josef Bican"], correct: 3 },
    { question: "¿Qué país ha ganado más Copas del Mundo?", options: ["Alemania", "Argentina", "Brasil", "Italia"], correct: 2 },
    { question: "¿En qué año se fundó la FIFA?", options: ["1900", "1904", "1910", "1920"], correct: 1 },
    { question: "¿Cuánto mide un campo de fútbol profesional de largo?", options: ["90-120 metros", "100-110 metros", "80-100 metros", "110-120 metros"], correct: 1 },
    { question: "¿Qué jugador tiene el récord de más goles en un Mundial?", options: ["Ronaldo", "Miroslav Klose", "Pelé", "Gerd Müller"], correct: 1 },
    { question: "¿Cuál es el tiempo de un medio tiempo en el fútbol?", options: ["40 minutos", "45 minutos", "50 minutos", "60 minutos"], correct: 1 },
    { question: "¿Qué país organizó el primer Mundial de Fútbol?", options: ["Brasil", "Argentina", "Uruguay", "Italia"], correct: 2 },
    { question: "¿Cuántos cambios se permiten en un partido oficial de fútbol?", options: ["3 cambios", "5 cambios", "7 cambios", "Sin límite"], correct: 1 },
    { question: "¿Qué color de tarjeta expulsa directamente a un jugador?", options: ["Amarilla", "Roja", "Verde", "Azul"], correct: 1 },
    { question: "¿Cuántos pentágonos tiene un balón de fútbol tradicional?", options: ["10", "12", "15", "20"], correct: 1 },
    { question: "¿En qué año se introdujo el VAR en el fútbol?", options: ["2014", "2016", "2018", "2020"], correct: 2 }
];

// ===== VARIABLES GLOBALES =====
let mindarThree;
let isARStarted = false;
let currentObject = null;
let currentAnchor = null;
let isAnimating = false;
let manualRotation = 0;

let currentQuestion = 0;
let correctAnswers = 0;
let answeredQuestions = new Set();

// ===== VARIABLES DE GALERÍA =====
let isGalleryUnlocked = false;
let currentGalleryCountry = -1;

// ===== INICIALIZACIÓN DE MIND AR =====
async function initAR() {
    const container = document.getElementById('container');
    const arStatus = document.getElementById('arStatus');
    
    if(container) container.innerHTML = '';

    try {
        updateStatus('Iniciando cámara AR...', 'loading');
        
        mindarThree = new MindARThree({
            container: container,
            imageTargetSrc: './banderasrelieve.mind',
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
        
        // --- NUEVO SISTEMA DE CARGA DE MODELOS ---
        const loader = new GLTFLoader();

        models3D.forEach((item, index) => {
            const anchor = mindarThree.addAnchor(index);
            
            // Cargar el modelo 3D asíncronamente
            loader.load(
                item.url,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Ajustar tamaño del modelo
                    model.scale.set(item.scale, item.scale, item.scale);
                    
                    // Ajustar posición inicial (ligeramente elevado)
                    model.position.set(0, 0, 0.1);
                    
                    // Centrar el modelo si su ancla original viene desfasada
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    model.position.sub(center); 
                    
                    // Guardamos la referencia al modelo para poder rotarlo después
                    item.mesh = model;
                    
                    anchor.group.add(model);
                },
                (xhr) => {
                    // Opcional: ver progreso en consola
                    console.log(`${item.name} cargando: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                (error) => {
                    console.error(`Error al cargar el modelo de ${item.name}:`, error);
                }
            );
            
            anchor.onTargetFound = () => {
                console.log(`¡Marcador ${index} (${item.name}) detectado!`);
                
                // Asignamos el modelo cargado a la variable global para los controles
                if(item.mesh) {
                    currentObject = item.mesh; 
                }
                currentAnchor = anchor;
                
                updateStatus(`¡${item.name} detectado!`, 'active');
                updateScanInfo(item);
                
                // Desbloquear galería al escanear marcador
                unlockGalleryForCountry(index, item.name);
            };
            
            anchor.onTargetLost = () => {
                console.log(`Marcador ${index} perdido`);
                updateStatus('Buscando marcador...', 'searching');
                resetScanInfo();
                currentObject = null; // Limpiar selección al perder el marcador
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

// ===== ROTAR MODELO =====
function rotateModel(direction) {
    if (!isARStarted || !currentObject) return;
    const rotationAmount = Math.PI / 8;
    if (direction === 'left') manualRotation -= rotationAmount;
    else if (direction === 'right') manualRotation += rotationAmount;
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
        case 'loading': statusIndicator.style.background = '#FFA500'; break;
        case 'active': statusIndicator.style.background = '#00ff00'; break;
        case 'searching': statusIndicator.style.background = '#00ffff'; break;
        case 'error': statusIndicator.style.background = '#ff0000'; break;
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
        if(mindarThree.renderer) mindarThree.renderer.setAnimationLoop(null);
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
        const page = link.getAttribute('data-page');
        
        // Bloqueo de Galería
        if (page === 'gallery' && !isGalleryUnlocked) {
            e.preventDefault();
            alert("🔒 ¡Galería Bloqueada!\n\nDebes escanear la bandera de alguna selección en la cámara AR para desbloquear su contenido exclusivo.");
            return;
        }
        
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
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
            if (index === question.correct) button.classList.add('correct');
            else button.classList.add('disabled');
        } else {
            button.addEventListener('click', () => checkAnswer(index, button));
        }
        
        triviaOptions.appendChild(button);
    });
}

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
    
    setTimeout(() => {
        if (currentQuestion < triviaQuestions.length - 1) {
            currentQuestion++;
            loadQuestion();
        }
    }, 1500);
}

function updateScore() {
    const answered = answeredQuestions.size;
    triviaScore.textContent = `${correctAnswers}/${answered} correctas`;
}

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
const footballTeamsData = [
    { rank: 1, name: "Argentina", flag: "🇦🇷", continent: "Sudamérica", worldCups: 3, copaAmerica: 15, totalMatches: 1056, wins: 593, goals: 2346 },
    { rank: 2, name: "Francia", flag: "🇫🇷", continent: "Europa", worldCups: 2, copaAmerica: 0, totalMatches: 954, wins: 553, goals: 2145 },
    { rank: 3, name: "Brasil", flag: "🇧🇷", continent: "Sudamérica", worldCups: 5, copaAmerica: 9, totalMatches: 1120, wins: 739, goals: 2653 },
    { rank: 4, name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent: "Europa", worldCups: 1, copaAmerica: 0, totalMatches: 1024, wins: 598, goals: 2198 },
    { rank: 5, name: "Bélgica", flag: "🇧🇪", continent: "Europa", worldCups: 0, copaAmerica: 0, totalMatches: 812, wins: 417, goals: 1534 },
    { rank: 6, name: "Países Bajos", flag: "🇳🇱", continent: "Europa", worldCups: 0, copaAmerica: 0, totalMatches: 897, wins: 532, goals: 1956 },
    { rank: 7, name: "Portugal", flag: "🇵🇹", continent: "Europa", worldCups: 0, copaAmerica: 0, totalMatches: 782, wins: 456, goals: 1632 },
    { rank: 8, name: "España", flag: "🇪🇸", continent: "Europa", worldCups: 1, copaAmerica: 0, totalMatches: 896, wins: 543, goals: 1998 }
];

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

const statsModal = document.getElementById('statsModal');
const statsBtn = document.getElementById('statsBtn');
const statsModalClose = document.getElementById('statsModalClose');
const statsModalBody = document.getElementById('statsModalBody');

statsBtn.addEventListener('click', () => {
    statsModal.classList.add('active');
    renderStatsContent();
});

statsModalClose.addEventListener('click', () => {
    statsModal.classList.remove('active');
});

statsModal.querySelector('.stats-modal-overlay').addEventListener('click', () => {
    statsModal.classList.remove('active');
});

statsModal.querySelector('.stats-modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && statsModal.classList.contains('active')) {
        statsModal.classList.remove('active');
    }
});

function renderStatsContent() {
    let html = '<h3 class="section-title"><i class="fas fa-globe"></i> Ranking FIFA - Top 8 Selecciones</h3>';
    
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

// ===== SISTEMA DE TUTORIAL (MODAL FIJO Y SCROLL) =====
const tutorialSteps = [
    { id: 'welcome', target: null, title: '¡Bienvenido a AR Sports!', description: 'Esta aplicación te permite explorar el mundo del fútbol con Realidad Aumentada. Te mostraremos cómo usarla.', icon: 'fa-rocket' },
    { id: 'ar-canvas', target: '#arCanvas', title: 'Visor de Realidad Aumentada', description: 'Apunta tu cámara a un marcador para ver objetos 3D flotando en el espacio real. Los objetos aparecerán automáticamente.', icon: 'fa-camera' },
    { id: 'controls', target: '.controls', title: 'Controles 3D', description: 'Usa los botones izquierdo/derecho para rotar el modelo. El botón central activa la rotación automática.', icon: 'fa-gamepad' },
    { id: 'trivia', target: '.trivia-card', title: 'Trivia Interactiva', description: 'Responde preguntas sobre fútbol. Selecciona una respuesta y descubre si es correcta. ¡Acumula puntos!', icon: 'fa-brain' },
    { id: 'scan-info', target: '.scan-info', title: 'Información del Objeto', description: 'Cuando detectes un marcador, aquí verás información detallada sobre el objeto 3D que estás visualizando.', icon: 'fa-info-circle' },
    { id: 'gallery', target: '[data-page="gallery"]', title: 'Galería de Videos', description: 'Accede a una colección de videos deportivos. Explora contenido multimedia relacionado con el fútbol.', icon: 'fa-video' },
    { id: 'stats', target: '#statsBtn', title: 'Estadísticas Mundiales', description: '¡Haz clic aquí para ver ranking FIFA, goleadores históricos y datos de selecciones! ¡Ya estás listo para usar la app!', icon: 'fa-chart-bar' }
];

let currentTutorialStep = 0;
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialTooltip = document.getElementById('tutorialTooltip');
const tutorialProgress = document.getElementById('tutorialProgress');
const tutorialTitle = document.getElementById('tutorialTitle');
const tutorialDescription = document.getElementById('tutorialDescription');
const tutorialIcon = document.getElementById('tutorialIcon');
const tutorialPrev = document.getElementById('tutorialPrev');
const tutorialNext = document.getElementById('tutorialNext');
const tutorialSkip = document.getElementById('tutorialSkip');
const helpBtn = document.getElementById('helpBtn');

function checkFirstTime() {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
        setTimeout(() => {
            startTutorial();
        }, 1000);
    }
}

function startTutorial() {
    currentTutorialStep = 0;
    tutorialOverlay.classList.add('active');
    showTutorialStep(currentTutorialStep);
}

function showTutorialStep(stepIndex) {
    const step = tutorialSteps[stepIndex];
    
    tutorialProgress.textContent = `Paso ${stepIndex + 1}/${tutorialSteps.length}`;
    tutorialTitle.textContent = step.title;
    tutorialDescription.textContent = step.description;
    tutorialIcon.innerHTML = `<i class="fas ${step.icon}"></i>`;
    
    tutorialPrev.disabled = stepIndex === 0;
    tutorialNext.textContent = stepIndex === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    if (step.target) {
        const target = document.querySelector(step.target);
        if (target) {
            target.classList.add('tutorial-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

tutorialNext.addEventListener('click', () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
        currentTutorialStep++;
        showTutorialStep(currentTutorialStep);
    } else {
        finishTutorial();
    }
});

tutorialPrev.addEventListener('click', () => {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep(currentTutorialStep);
    }
});

tutorialSkip.addEventListener('click', () => {
    finishTutorial();
});

function finishTutorial() {
    tutorialOverlay.classList.remove('active');
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    localStorage.setItem('hasSeenTutorial', 'true');
}

helpBtn.addEventListener('click', () => {
    startTutorial();
});

// ===== FUNCIONES PARA LA GALERÍA Y FILTROS =====
// Base de datos de videos locales (Mapeados del 0 al 8)
const galleryData = {
    0: [ // México
        { title: "Momentos inolvidables", meta: "Selección Mexicana", icon: "fa-star", src: "./video/mexico1.mp4" },
        { title: "Top 10 Goles", meta: "El Tri en Mundiales", icon: "fa-futbol", src: "./video/mexico2.mp4" }
    ],
    1: [ // Sudáfrica
        { title: "Sudáfrica vs México", meta: "Mundial 2010", icon: "fa-play-circle", src: "./video/sudafrica1.mp4" },
        { title: "Francia vs Sudáfrica", meta: "Mundial 2010", icon: "fa-play-circle", src: "./video/sudafrica2.mp4" }
    ],
    2: [ // Túnez
        { title: "Túnez vs Inglaterra", meta: "Mundial 2018", icon: "fa-play-circle", src: "./video/tunez1.mp4" },
        { title: "Panamá vs Túnez", meta: "Mundial 2018", icon: "fa-play-circle", src: "./video/tunez2.mp4" }
    ],
    3: [ // Uruguay
        { title: "Goles Memorables", meta: "Uruguay en Mundiales", icon: "fa-star", src: "./video/uruguay1.mp4" },
        { title: "Uruguay vs Portugal", meta: "Mundial 2018", icon: "fa-play-circle", src: "./video/uruguay2.mp4" }
    ],
    4: [ // Uzbekistán (Solo 1 video)
        { title: "Historic Campaign", meta: "Uzbekistán vs Qatar", icon: "fa-trophy", src: "./video/uzbekistan1.mp4" }
    ],
    5: [ // Colombia
        { title: "Mejores Goles (2012-2022)", meta: "Parte 1", icon: "fa-futbol", src: "./video/colombia1.mp4" },
        { title: "Mejores Goles (2012-2022)", meta: "Parte 2", icon: "fa-futbol", src: "./video/colombia2.mp4" }
    ],
    6: [ // Corea del Sur
        { title: "Goles Memorables", meta: "Corea en Mundiales", icon: "fa-star", src: "./video/corea1.mp4" },
        { title: "Corea vs Alemania", meta: "Mundial 2018", icon: "fa-play-circle", src: "./video/corea2.mp4" }
    ],
    7: [ // España
        { title: "Goles Memorables", meta: "España en Mundiales", icon: "fa-star", src: "./video/espania1.mp4" },
        { title: "Todos los goles 2010", meta: "Villa, Iniesta & Puyol", icon: "fa-trophy", src: "./video/espania2.mp4" }
    ],
    8: [ // Japón
        { title: "Todos los goles 2022", meta: "Japón en Qatar", icon: "fa-futbol", src: "./video/japon1.mp4" },
        { title: "Japón vs España", meta: "Comeback Win 2022", icon: "fa-fire", src: "./video/japon2.mp4" }
    ]
};

function unlockGalleryForCountry(index, countryName) {
    isGalleryUnlocked = true;
    currentGalleryCountry = index;
    
    const galleryTitle = document.getElementById('galleryTitle');
    if(galleryTitle) galleryTitle.innerHTML = `<i class="fas fa-flag"></i> Videos: ${countryName}`;
    
    const videoListContainer = document.getElementById('videoListContainer');
    if(!videoListContainer) return;
    
    videoListContainer.innerHTML = ''; 
    
    // Obtener los videos correspondientes al índice del marcador
    const videosData = galleryData[index] || [];
    const videoPlayer = document.getElementById('mainVideoPlayer');
    
    videosData.forEach((vid, i) => {
        const videoEl = document.createElement('div');
        videoEl.className = `video-list-item d-flex gap-3 mb-3 ${i === 0 ? 'active-video' : ''}`;
        videoEl.innerHTML = `
            <div class="video-thumbnail">
                <i class="fas ${vid.icon}" style="font-size: 1.5rem; color: rgba(0,0,0,0.3);"></i>
            </div>
            <div class="video-info flex-grow-1">
                <h5 class="video-title" style="font-size: 0.9rem;">${vid.title}</h5>
                <p class="video-meta">${vid.meta}</p>
            </div>
            <i class="fas fa-play-circle mt-2 text-muted" style="font-size: 1.2rem; color: var(--neon-cyan) !important;"></i>
        `;
        
        videoEl.addEventListener('click', () => {
            document.querySelectorAll('.video-list-item').forEach(el => el.classList.remove('active-video'));
            videoEl.classList.add('active-video');
            videoPlayer.src = vid.src;
            videoPlayer.play();
        });
        
        videoListContainer.appendChild(videoEl);
    });
    
    // Cargar el primer video automáticamente en el reproductor (sin auto-play)
    if (videosData.length > 0) {
        videoPlayer.src = videosData[0].src;
    } else {
        videoPlayer.src = "";
    }
}

// Configuración de los botones de filtros
const videoPlayer = document.getElementById('mainVideoPlayer');
const filterBtns = document.querySelectorAll('.filter-container button');

function resetFilterButtons() {
    filterBtns.forEach(btn => btn.classList.remove('correct'));
}

document.getElementById('btnFilterNone').addEventListener('click', function() {
    resetFilterButtons(); this.classList.add('correct');
    videoPlayer.style.filter = 'none';
});

document.getElementById('btnFilterBlur').addEventListener('click', function() {
    resetFilterButtons(); this.classList.add('correct');
    videoPlayer.style.filter = 'blur(6px)';
});

document.getElementById('btnFilterPixel').addEventListener('click', function() {
    resetFilterButtons(); this.classList.add('correct');
    videoPlayer.style.filter = 'url(#pixelate)';
});

document.getElementById('btnFilterThermal').addEventListener('click', function() {
    resetFilterButtons(); this.classList.add('correct');
    videoPlayer.style.filter = 'invert(100%) sepia(100%) saturate(700%) hue-rotate(180deg) contrast(1.5)';
});

document.getElementById('btnFilterCustom').addEventListener('click', function() {
    resetFilterButtons(); this.classList.add('correct');
    videoPlayer.style.filter = 'saturate(250%) contrast(1.2) sepia(40%) hue-rotate(320deg)';
});

// ===== INICIALIZAR AL CARGAR =====
window.addEventListener('load', () => {
    console.log('✅ Aplicación AR cargada');
    loadQuestion();
    if(homePage.style.display !== 'none') initAR();
    checkFirstTime();
});