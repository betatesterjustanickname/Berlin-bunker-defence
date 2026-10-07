export class BunkerBuilder {
    constructor(scene) {
        this.scene = scene;
        this.mainDoor = null;
    }

    buildBunker() {
        // Sığınak Malzemesi (Koyu Beton)
        const concreteMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.4 });

        // Zemin ve Tavan
        const floorGeo = new THREE.PlaneGeometry(20, 40);
        const floor = new THREE.Mesh(floorGeo, concreteMat);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        const ceiling = new THREE.Mesh(floorGeo, concreteMat);
        ceiling.position.y = 5;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Yan Duvarlar
        const wallGeo = new THREE.BoxGeometry(1, 5, 40);
        const leftWall = new THREE.Mesh(wallGeo, concreteMat);
        leftWall.position.set(-10, 2.5, 0);
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(wallGeo, concreteMat);
        rightWall.position.set(10, 2.5, 0);
        this.scene.add(rightWall);

        // Ana Sığınak Giriş Kapısı (10. Dakikada Sherman'ın Vuracağı Kapı)
        const doorGeo = new THREE.BoxGeometry(8, 4.5, 0.5);
        this.mainDoor = new THREE.Mesh(doorGeo, doorMat);
        this.mainDoor.position.set(0, 2.25, -19.75);
        this.scene.add(this.mainDoor);

        // Kırmızı Acil Durum Işıkları
        const redLight1 = new THREE.PointLight(0xff0000, 1.5, 15);
        redLight1.position.set(0, 4, -10);
        this.scene.add(redLight1);

        const redLight2 = new THREE.PointLight(0xff0000, 1.5, 15);
        redLight2.position.set(0, 4, 10);
        this.scene.add(redLight2);

        // Ortam Aydınlatması (Zayıf Karanlık Sığınak Hissiyatı)
        const ambientLight = new THREE.AmbientLight(0x222222);
        this.scene.add(ambientLight);
    }
}
