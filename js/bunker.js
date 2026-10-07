export class BunkerBuilder {
    constructor(scene) {
        this.scene = scene;
        this.colliders = []; // Duvar çarpışma kutuları (Bug önleyici)
        this.npcs = [];      // 3D Askerler
        this.officerMesh = null;
        this.eliteSoldiers = [];
    }

    build() {
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

        // Ana Zemin
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), floorMat);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // Tavan
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), wallMat);
        ceiling.position.y = 4;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Dış Duvarlar
        this.createWall(0, 2, -30, 30, 4, 1, wallMat);  // Ön
        this.createWall(0, 2, 30, 30, 4, 1, wallMat);   // Arka
        this.createWall(-15, 2, 0, 1, 4, 60, wallMat);  // Sol
        this.createWall(15, 2, 0, 1, 4, 60, wallMat);   // Sağ

        // İç Odalar ve Koridor Duvarları
        this.createWall(-5, 2, -10, 18, 4, 1, wallMat);
        this.createWall(5, 2, 10, 18, 4, 1, wallMat);

        // Aydınlatma
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        for (let z = -20; z <= 20; z += 10) {
            const light = new THREE.PointLight(0xff3300, 1.2, 12);
            light.position.set(0, 3.5, z);
            this.scene.add(light);
        }

        // 3D Askerlerin Oluşturulması (Erler, Elitler ve Subay)
        this.spawnNPCs();
    }

    createWall(x, y, z, w, h, d, mat) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        this.scene.add(mesh);

        // Çarpışma kontrolü için bounding box kaydı
        const box = new THREE.Box3().setFromObject(mesh);
        this.colliders.push(box);
    }

    spawnNPCs() {
        // Normal Erler (Gri/Yeşil Modeller)
        const soldierMat = new THREE.MeshStandardMaterial({ color: 0x4b5320 });
        const eliteMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a }); // Elit Askerler Siyah
        const officerMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 }); // Subay Koyu Kırmızı

        // 45 Er Modelini Odalara Dağıt
        for (let i = 0; i < 15; i++) {
            const soldier = this.createHumanMesh(soldierMat);
            soldier.position.set((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 40);
            this.scene.add(soldier);
            this.npcs.push(soldier);
        }

        // 2 Elit Asker (Siperlerinde Bekleyenler)
        for (let i = 0; i < 2; i++) {
            const elite = this.createHumanMesh(eliteMat);
            elite.position.set(-3 + (i * 6), 0, -18);
            this.scene.add(elite);
            this.eliteSoldiers.push(elite);
        }

        // 1 Subay (Sığınakta Gezen)
        this.officerMesh = this.createHumanMesh(officerMat);
        this.officerMesh.position.set(0, 0, -5);
        this.scene.add(this.officerMesh);
    }

    createHumanMesh(material) {
        const group = new THREE.Group();
        
        // Gövde
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.4, 8), material);
        body.position.y = 0.7;
        group.add(body);

        // Baş / Miğfer
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), material);
        head.position.y = 1.5;
        group.add(head);

        return group;
    }
}
