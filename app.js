import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

// ===== CONFIGURACIÓN DE MODELOS 3D (9 ITEMS) =====
const models3D = [
    // Index 0
    {
        id: 'ball',
        name: 'Balón de Fútbol',
        description: 'Un balón de fútbol profesional oficial FIFA.',
        type: 'sphere',
        color: 0xFFFFFF,
        scale: 0.5
    },
    // Index 1
    {
        id: 'trophy',
        name: 'Trofeo de Campeonato',
        description: 'Copa dorada del campeonato.',
        type: 'cone',
        color: 0xFFD700,
        scale: 0.6
    },
    // Index 2
    {
        id: 'cube',
        name: 'Cubo Deportivo',
        description: 'Modelo 3D de ejemplo.',
        type: 'box',
        color: 0xFF3377,
        scale: 0.5
    },
    // Index 3
    {
        id: 'cylinder',
        name: 'Torre de Control',
        description: 'Representación cilíndrica de una estructura.',
        type: 'cylinder',
        color: 0x00FF00,
        scale: 0.6
    },
    // Index 4
    {
        id: 'torus',
        name: 'Anillo Olímpico',
        description: 'Geometría circular compleja.',
        type: 'torus',
        color: 0x00FFFF,
        scale: 0.4
    },
    // Index 5
    {
        id: 'icosahedron',
        name: 'Diamante',
        description: 'Figura multifacética brillante.',
        type: 'icosahedron',
        color: 0x9D00FF,
        scale: 0.5
    },
    // Index 6
    {
        id: 'capsule',
        name: 'Cápsula del Tiempo',
        description: 'Contenedor futurista.',
        type: 'capsule',
        color: 0xFF8800,
        scale: 0.5
    },
    // Index 7
    {
        id: 'dodecahedron',
        name: 'Balón Poligonal',
        description: 'Estructura matemática de 12 caras.',
        type: 'dodecahedron',
        color: 0xFF0055,
        scale: 0.55
    },
    // Index 8
    {
        id: 'octahedron',
        name: 'Pirámide Doble',
        description: 'Estructura de equilibrio perfecto.',
        type: 'octahedron',
        color: 0x0000FF,
        scale: 0.6
    }
];

// ===== VARIABLES GLOBALES =====
let mindarThree;
let isARStarted = false;
let currentObject = null;
let currentAnchor = null;
let isAnimating = false;
let manualRotation = 0;

// ===== INICIALIZACIÓN DE MIND AR =====
async function initAR() {
    const container = document.getElementById('container');
    const arStatus = document.getElementById('arStatus');
    
    // Limpieza: Evita duplicados si se reinicia la app
    if(container) container.innerHTML = '';

    try {
        updateStatus('Iniciando cámara AR...', 'loading');
        
        // Crear instancia de MindAR CON UI DESACTIVADO
        mindarThree = new MindARThree({
            container: container,
            imageTargetSrc: './banderas.mind',
            // ⭐ CLAVE: Desactivar el UI por defecto de MindAR
            uiLoading: "no",
            uiScanning: "no", 
            uiError: "no"
        });
        
        const { renderer, scene, camera } = mindarThree;
        
        // Fondo transparente para que se vea la cámara
        renderer.setClearColor(0x000000, 0);
        
        // Configurar luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);
        
        // Crear un anchor y modelo por cada imagen
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
        
        // Iniciar AR
        await mindarThree.start();
        updateStatus('AR activo - Apunta a un marcador', 'active');
        isARStarted = true;
        
        // Loop de renderizado
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
    
    const rotationAmount = Math.PI / 8; // 22.5 grados
    
    if (direction === 'left') {
        manualRotation -= rotationAmount;
    } else if (direction === 'right') {
        manualRotation += rotationAmount;
    }
    
    console.log(`Rotando: ${direction}, ángulo: ${(manualRotation * 180 / Math.PI).toFixed(1)}°`);
}

// ===== TOGGLE ANIMACIÓN =====
function toggleAnimation() {
    isAnimating = !isAnimating;
    console.log(`Animación ${isAnimating ? 'activada' : 'pausada'}`);
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
                <p style="margin-bottom: 1rem;">Posibles causas:</p>
                <ul style="text-align: left; max-width: 400px; margin: 0 auto 1.5rem;">
                    <li>Permisos de cámara no otorgados</li>
                    <li>Conexión a internet requerida</li>
                    <li>Navegador no compatible (usa Chrome o Safari)</li>
                    <li>Las librerías no se cargaron correctamente</li>
                </ul>
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
            if (!isARStarted) {
                initAR();
            }
        } else if (page === 'gallery') {
            homePage.style.display = 'none';
            galleryPage.style.display = 'block';
            stopAR();
        }
    });
});

// ===== BOTONES DE CONTROL =====
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');

prevBtn.addEventListener('click', () => {
    rotateModel('left');
});

playBtn.addEventListener('click', () => {
    toggleAnimation();
    const icon = playBtn.querySelector('i');
    
    if (isAnimating) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
});

nextBtn.addEventListener('click', () => {
    rotateModel('right');
});

// ===== TRIVIA =====
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
triviaQuestion.style.transition = 'opacity 0.3s ease';

function updateTrivia() {
    triviaQuestion.style.opacity = '0';
    setTimeout(() => {
        triviaQuestion.textContent = triviaQuestions[currentQuestion];
        currentQSpan.textContent = currentQuestion + 1;
        triviaQuestion.style.opacity = '1';
    }, 200);
}

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

// ===== INICIALIZAR AL CARGAR =====
window.addEventListener('load', () => {
    console.log('✅ Aplicación AR cargada');
    if(homePage.style.display !== 'none'){
        initAR();
    }
});