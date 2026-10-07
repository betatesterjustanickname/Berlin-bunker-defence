export class TouchControls {
    constructor(camera) {
        this.camera = camera;
        this.moveVector = { x: 0, y: 0 }; // Joystick hareket yönü
        
        this.initJoystick();
        this.initTouchLook();
    }

    // Sol Joystick İşlevselliği
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

        const resetKnob = (e) => {
            for (let touch of e.changedTouches) {
                if (touch.identifier === touchId) {
                    knob.style.transform = `translate(0px, 0px)`;
                    this.moveVector = { x: 0, y: 0 };
                    touchId = null;
                }
            }
        };

        zone.addEventListener('touchend', resetKnob);
        zone.addEventListener('touchcancel', resetKnob);
    }

    updateKnob(touch, zone, knob) {
        const rect = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const maxRadius = rect.width / 2;

        const distance = Math.hypot(dx, dy);
        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        // -1 ile +1 arasında normalize edilmiş hareket vektörü
        this.moveVector = { x: dx / maxRadius, y: dy / maxRadius };
    }

    // Ekranın Sağ Tarafından Dokunarak Kamerayı Çevirme
    initTouchLook() {
        let lastX = 0;
        let lastY = 0;

        window.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientX > window.innerWidth / 2) {
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        });

        window.addEventListener('touchmove', (e) => {
            for (let touch of e.touches) {
                if (touch.clientX > window.innerWidth / 2) {
                    const deltaX = touch.clientX - lastX;
                    const deltaY = touch.clientY - lastY;

                    this.camera.rotation.y -= deltaX * 0.005; // Hassasiyet
                    this.camera.rotation.x -= deltaY * 0.005;
                    this.camera.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.camera.rotation.x));

                    lastX = touch.clientX;
                    lastY = touch.clientY;
                }
            }
        });
    }

    updatePlayerMovement(camera, speed = 0.08) {
        if (this.moveVector.x !== 0 || this.moveVector.y !== 0) {
            camera.translateZ(this.moveVector.y * speed);
            camera.translateX(this.moveVector.x * speed);
            camera.position.y = 1.7; // Yüksekliği sabitle
        }
    }
}
