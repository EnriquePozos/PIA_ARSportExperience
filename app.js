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

// ===== INICIALIZAR AL CARGAR =====
window.addEventListener('load', () => {
    console.log('✅ Aplicación AR cargada');
    loadQuestion();
    if(homePage.style.display !== 'none') initAR();
});