import { SoundEngine } from './audio.js';
import { BunkerBuilder } from './bunker.js';
import { OfficerAI } from './officer.js';
import { ShermanBreachManager } from './sherman.js';
import { TouchControls } from './touchControls.js';

class MobileGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });

        this.sound = new SoundEngine();
        this.bunker = new BunkerBuilder(this.scene);
        this.officer = new OfficerAI(this.sound);
        this.sherman = new ShermanBreachManager(this.scene, this.bunker, this.sound);
        this.touch = new TouchControls(this.camera);

        this.gameTime = 0;
        this.soldierCount = 50;
        this.isGameOver = false;

        this.init();
    }

    init() {
        // Mobil GPU Performansı için Düşük Çözünürlük Ölçeği (Pixel Ratio Sabitleme)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.set(0, 1.7, 5);

        this.bunker.buildBunker();

        // Mobil Buton Olayları
        document.getElementById('start-btn').addEventListener('click', () => this.start());

        document.getElementById('btn-crouch').addEventListener('click', () => {
            // Emre uyulduğunu bildir
            this.officer.complianceTimer = 4.0;
        });

        document.getElementById('btn-fire').addEventListener('click', () => {
            this.sound.playGunshot();
        });
    }

    start() {
        this.sound.init();
        document.getElementById('overlay').classList.add('hidden');
        this.lastTime = performance.now();
        this.animate();
    }

    triggerGameOver(reasonTitle, reasonDetail) {
        this.isGameOver = true;
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('death-reason').innerText = reasonTitle;
        document.getElementById('death-detail').innerText = reasonDetail;
    }

    animate() {
        if (this.isGameOver) return;

        requestAnimationFrame(() => this.animate());

        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.gameTime += delta;
        
        // Dokunmatik Joystick Hareketini Uygula
        this.touch.updatePlayerMovement(this.camera);

        // Mantık Turları
        this.officer.update(delta, this.camera.position, this.isGameOver, (t, d) => this.triggerGameOver(t, d));
        this.sherman.checkTimer(this.gameTime, (deadCount) => {
            this.soldierCount = Math.max(0, this.soldierCount - deadCount);
            document.getElementById('soldier-count').innerText = `${this.soldierCount} / 50`;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

new MobileGame();
