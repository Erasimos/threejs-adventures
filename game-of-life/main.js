import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

import { GameOfLife } from './gameOfLife';

let paused = false;

let lastUpdate = 0;
const updateInterval = 100; // 500ms

const gridSize = 50;
const cells = [];
const game = new GameOfLife(gridSize, cells);
 
camera.position.z = gridSize

// Create The Grid
for (let x = 0; x < gridSize; x++) {
    cells[x] = []
    for (let y = 0; y < gridSize; y++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x - gridSize / 2, y - gridSize / 2, 0);
        scene.add(cube);

        let alive = false;
        let r = Math.random()
        if (r > 0.3) {
            alive = true;
        }

        cells[x][y] = {mesh: cube, alive: alive};
    }
}

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = true;
controls.maxDistance = 200;
controls.minDistance = 10;
controls.enabled = false;
controls.enablePan = false;
controls.enableZoom = false;


function onKeyDown(event) {
    if (event.key === 'Shift') {
        controls.enabled = !controls.enabled;
        controls.enablePan = !controls.enablePan;
        controls.enableZoom = !controls.enableZoom;
    }
}


window.addEventListener('keydown', onKeyDown);

function pause(event) {
    if (event.code === 'Space') {
        paused = !paused;
    }
}

window.addEventListener('keydown', pause);

let isDragging = false;

function onMouseDown(event) {
    isDragging = true;
    updateCellState(event);
}

function onMouseUp() {
    isDragging = false;
}

function onMouseMove(event) {
    if (isDragging) {
        updateCellState(event);
    }
}

function updateCellState(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const cell = intersects[0].object;
        cell.alive = !cell.alive;
        cell.material.color.set(cell.alive ? 0xffffff : 0x000000);

        const x = Math.floor((cell.position.x + gridSize / 2));
        const y = Math.floor((cell.position.y + gridSize / 2));
        cells[x][y].alive = cell.alive;
    }
}

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);

function gameLoop(currentTime) {

    // Run Game of Life simulation
    if (!paused && currentTime - lastUpdate > updateInterval) {
        game.computeNextState();
        game.updateGridColors();
        lastUpdate = currentTime;
    }

    // Update orbit camera
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

gameLoop(0);