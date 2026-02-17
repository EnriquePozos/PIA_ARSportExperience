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
        color: 0x00FF00, // Verde
        scale: 0.6
    },
    // Index 4
    {
        id: 'torus',
        name: 'Anillo Olímpico',
        description: 'Geometría circular compleja.',
        type: 'torus',
        color: 0x00FFFF, // Cyan
        scale: 0.4
    },
    // Index 5
    {
        id: 'icosahedron',
        name: 'Diamante',
        description: 'Figura multifacética brillante.',
        type: 'icosahedron',
        color: 0x9D00FF, // Morado
        scale: 0.5
    },
    // Index 6
    {
        id: 'capsule',
        name: 'Cápsula del Tiempo',
        description: 'Contenedor futurista.',
        type: 'capsule', // Usaremos geometría personalizada para esto
        color: 0xFF8800, // Naranja
        scale: 0.5
    },
    // Index 7
    {
        id: 'dodecahedron',
        name: 'Balón Poligonal',
        description: 'Estructura matemática de 12 caras.',
        type: 'dodecahedron',
        color: 0xFF0055, // Rojo
        scale: 0.55
    },
    // Index 8
    {
        id: 'octahedron',
        name: 'Pirámide Doble',
        description: 'Estructura de equilibrio perfecto.',
        type: 'octahedron',
        color: 0x0000FF, // Azul
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
    
    // LIMPIEZA CRÍTICA: Evita duplicados si se reinicia la app
    if(container) container.innerHTML = '';

    try {
        updateStatus('Iniciando cámara AR...', 'loading');
        
        // Crear instancia de MindAR
        mindarThree = new MindARThree({
            container: container,
            // Asegúrate que este archivo tiene las imágenes en el mismo orden que tu array models3D
            imageTargetSrc: './banderas.mind', 
            // Opcional: Si quieres detectar 2 imágenes al mismo tiempo, descomenta esto:
            // maxTrack: 2,
        });
        
        const { renderer, scene, camera } = mindarThree;
        
        // CORRECCIÓN DE PANTALLA NEGRA
        renderer.setClearColor(0x000000, 0); // Fondo transparente
        
        // Configurar luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);
        
        // === BUCLE PARA MÚLTIPLES OBJETIVOS ===
        // Recorremos el array de modelos para crear un anchor por cada uno
        models3D.forEach((item, index) => {
            
            // 1. Crear anchor para el índice actual (0, 1, 2...)
            const anchor = mindarThree.addAnchor(index);
            
            // 2. Crear el modelo 3D correspondiente
            const mesh = createModel(item);
            anchor.group.add(mesh);
            
            // 3. Evento: Cuando se encuentra ESTA imagen
            anchor.onTargetFound = () => {
                console.log(`¡Marcador ${index} (${item.name}) detectado!`);
                
                // Actualizamos las variables globales para que los botones de rotación funcionen con este objeto
                currentObject = mesh;
                currentAnchor = anchor;
                
                // Actualizamos la UI
                updateStatus(`¡${item.name} detectado!`, 'active');
                updateScanInfo(item);
            };
            
            // 4. Evento: Cuando se pierde ESTA imagen
            anchor.onTargetLost = () => {
                console.log(`Marcador ${index} perdido`);
                updateStatus('Buscando marcador...', 'searching');
                resetScanInfo();
            };
        });
        // ======================================
   for (let i = 0; i < 9; i++) {
    const debugAnchor = mindarThree.addAnchor(i);
    
    debugAnchor.onTargetFound = () => {
        console.log(`🔥 ¡DIAGNÓSTICO! Se detectó la imagen número: ${i}`);
        console.log(`   (Esta imagen corresponde a la pestaña 'Image ${i+1}' del compilador)`);
        
        // Alerta visual temporal para que sepas que funciona
        updateStatus(`DEBUG: Detectada img #${i}`, 'searching'); 
    };
}     
        // Iniciar AR
        await mindarThree.start();

// === CÓDIGO DE DIAGNÓSTICO ===
// Esto imprimirá en la consola cuántas imágenes detectó realmente el sistema
// Accedemos al controlador interno de MindAR para verificar
const totalTargets = mindarThree.controller.getNumTargets ? mindarThree.controller.getNumTargets() : "No disponible";
console.log("------------------------------------------------");
console.log(`🔍 DIAGNÓSTICO:`);
console.log(`📦 Imágenes en el archivo .mind: ${totalTargets}`);
console.log(`📝 Modelos en tu código: ${models3D.length}`);

if (models3D.length > totalTargets) {
    console.error("❌ ERROR: Tienes más modelos definidos en JS que imágenes en el archivo .mind");
    console.warn("SOLUCIÓN: Vuelve a compilar el archivo .mind asegurándote de subir TODAS las imágenes juntas.");
} else {
    console.log("✅ La cantidad de imágenes coincide.");
}
console.log("------------------------------------------------");

        updateStatus('AR activo - Apunta a un marcador', 'active');
        isARStarted = true;
        
        // Loop de renderizado
        renderer.setAnimationLoop(() => {
            // Nota: currentObject se actualiza automáticamente en onTargetFound
            if (currentObject && currentAnchor && currentAnchor.visible) {
                // Si está animando, rotar automáticamente
                if (isAnimating) {
                    manualRotation += 0.02;
                }
                // Aplicar rotación (manual + automática)
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
    
    // TRUCO 1: Usamos MeshBasicMaterial en lugar de Standard.
    // Este material NO necesita luces, brilla con su propio color.
    // Así descartamos problemas de iluminación.
    const baseMaterial = new THREE.MeshBasicMaterial({
        color: modelData.color,
        transparent: true,
        opacity: 0.9,
    });

    // Geometrías (sin cambios, solo agregando los faltantes)
    switch(modelData.type) {
        case 'sphere':
            geometry = new THREE.SphereGeometry(modelData.scale, 32, 32);
            break; 
        case 'cone':
            geometry = new THREE.ConeGeometry(modelData.scale * 0.5, modelData.scale * 1.5, 32);
            break;
        case 'box':
            geometry = new THREE.BoxGeometry(modelData.scale, modelData.scale, modelData.scale);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(modelData.scale * 0.5, modelData.scale * 0.5, modelData.scale * 1.2, 32);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(modelData.scale * 0.6, modelData.scale * 0.2, 16, 50);
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(modelData.scale, 0);
            break;
        case 'dodecahedron':
            geometry = new THREE.DodecahedronGeometry(modelData.scale, 0);
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(modelData.scale, 0);
            break;
        default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }
    
    // Clonamos el material para que cada figura tenga su propio color
    material = baseMaterial.clone();
    material.color.setHex(modelData.color);
    
    // TRUCO 2: Wireframe (Malla de alambre) opcional
    // Si descomentas la siguiente línea, verás la estructura del objeto. Ayuda mucho a depurar.
    // material.wireframe = true;

    mesh = new THREE.Mesh(geometry, material);
    
    // TRUCO 3: POSICIÓN Z (CRUCIAL)
    // Levantamos el objeto 0.5 unidades sobre la imagen para que no quede "enterrado"
    // El eje Z sale perpendicular de la imagen hacia la cámara.
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
    
    console.log(`Rotando modelo: ${direction}, rotación actual: ${(manualRotation * 180 / Math.PI).toFixed(1)}°`);
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

        // Limpieza del DOM para evitar conflictos al reiniciar
        const container = document.getElementById('container');
        if (container) container.innerHTML = '';
    }
}

// ===== NAVIGATION FUNCTIONALITY =====
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

// ===== CONTROL BUTTONS =====
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');

// Botón Anterior: Rotar a la izquierda
prevBtn.addEventListener('click', () => {
    rotateModel('left');
});

// Botón Play/Pause: Controlar animación
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

// Botón Siguiente: Rotar a la derecha
nextBtn.addEventListener('click', () => {
    rotateModel('right');
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

// ===== INICIALIZAR AL CARGAR =====
window.addEventListener('load', () => {
    console.log('Aplicación AR cargada');
    // Solo inicia si estamos en la home
    if(homePage.style.display !== 'none'){
        initAR();
    }
});