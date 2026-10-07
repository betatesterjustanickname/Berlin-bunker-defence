import { SoundEngine } from './audio.js';
import { BunkerBuilder } from './bunker.js';
import { TouchControls } from './touchControls.js';
import { OfficerAI } from './officer.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });

        this.sound = new SoundEngine();
        this.bunker = new BunkerBuilder(this.scene);
        this.bunker.build();

        this.controls = new TouchControls(this.camera, this.bunker.colliders);
        this.officer = new OfficerAI(this.bunker, this.sound);

        this.gameTime = 0;
        this.isGameOver = false;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.set(0, 1.7, 10);

        // Buton Dinleyicileri
        document.getElementById('start-btn').addEventListener('click', () => {
            this.sound.init();
            document.getElementById('overlay').classList.add('hidden');
            this.lastTime = performance.now();
            this.animate();
        });

        // Aksiyon Butonları
        document.getElementById('btn-fire').addEventListener('click', () => this.sound.playGunshot());
        document.getElementById('btn-crouch').addEventListener('click', () => {
            this.camera.position.y = 1.0; // Eğil
            this.officer.complyWithOrder();
        });
        document.getElementById('btn-prone').addEventListener('click', () => {
            this.camera.position.y = 0.4; // Yat
            this.officer.complyWithOrder();
        });
        document.getElementById('btn-bayonet').addEventListener('click', () => this.officer.complyWithOrder());
        document.getElementById('btn-reload').addEventListener('click', () => this.officer.complyWithOrder());
    }

    triggerGameOver(title, detail) {
        this.isGameOver = true;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('death-reason').innerText = title;
        document.getElementById('death-detail').innerText = detail;
    }

    animate() {
        if (this.isGameOver) return;

        requestAnimationFrame(() => this.animate());

        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.gameTime += delta;
        
        // Süre HUD
        const mins = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(this.gameTime % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerText = `${mins}:${secs}`;

        // Güncellemeler
        this.controls.updateMovement();
        this.officer.update(delta, this.camera.position, (t, d) => this.triggerGameOver(t, d));

        this.renderer.render(this.scene, this.camera);
    }
}

new Game();
