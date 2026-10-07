export class TouchControls {
    constructor(camera, colliders) {
        this.camera = camera;
        this.colliders = colliders;
        this.moveVector = { x: 0, y: 0 };
        this.pitch = 0;
        this.yaw = 0;

        this.initJoystick();
        this.initTouchLook();
    }

    initJoystick() {
        const zone = document.getElementById('joystick-zone');
        const knob = document.getElementById('joystick-knob');
        let touchId = null;

        zone.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            this.updateKnob(touch, zone, knob);
        });

        zone.addEventListener('touchmove', (e) => {
            for (let touch of e.changedTouches) {
                if (touch.identifier === touchId) {
                    this.updateKnob(touch, zone, knob);
                }
            }
        });

        const reset = (e) => {
            for (let touch of e.changedTouches) {
                if (touch.identifier === touchId) {
                    knob.style.transform = `translate(0px, 0px)`;
                    this.moveVector = { x: 0, y: 0 };
                    touchId = null;
                }
            }
        };

        zone.addEventListener('touchend', reset);
        zone.addEventListener('touchcancel', reset);
    }

    updateKnob(touch, zone, knob) {
        const rect = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const radius = rect.width / 2;

        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
            dx = (dx / dist) * radius;
            dy = (dy / dist) * radius;
        }

        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        this.moveVector = { x: dx / radius, y: dy / radius };
    }

    // Kamera Çevirme (Bakış Kontrolü)
    initTouchLook() {
        let lastX = 0, lastY = 0;

        window.addEventListener('touchstart', (e) => {
            for (let touch of e.touches) {
                // Ekranın sağ tarafına dokunulduğunda bakışı çevir
                if (touch.clientX > window.innerWidth / 2) {
                    lastX = touch.clientX;
                    lastY = touch.clientY;
                }
            }
        });

        window.addEventListener('touchmove', (e) => {
            for (let touch of e.touches) {
                if (touch.clientX > window.innerWidth / 2) {
                    const dx = touch.clientX - lastX;
                    const dy = touch.clientY - lastY;

                    this.yaw -= dx * 0.004;
                    this.pitch -= dy * 0.004;

                    // Yukarı/Aşağı bakış sınırlandırması (Kamera kilitlenme bugını çözer)
                    this.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.pitch));

                    this.camera.rotation.set(0, 0, 0);
                    this.camera.rotation.y = this.yaw;
                    this.camera.rotation.x = this.pitch;

                    lastX = touch.clientX;
                    lastY = touch.clientY;
                }
            }
        });
    }

    updateMovement(speed = 0.08) {
        if (this.moveVector.x === 0 && this.moveVector.y === 0) return;

        const oldPos = this.camera.position.clone();

        // İleri / Geri ve Sağ / Sol Hareket
        this.camera.translateZ(this.moveVector.y * speed);
        this.camera.translateX(this.moveVector.x * speed);

        // Duvar Çarpışma Kontrolü (Duvarın içine girmeyi engeller)
        const playerBox = new THREE.Box3().setFromCenterAndSize(
            this.camera.position,
            new THREE.Vector3(0.6, 1.7, 0.6)
        );

        for (let collider of this.colliders) {
            if (playerBox.intersectsBox(collider)) {
                this.camera.position.copy(oldPos); // Çarparsa geri it
                break;
            }
        }
    }
}
