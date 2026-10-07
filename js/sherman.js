export class ShermanBreachManager {
    constructor(scene, bunkerBuilder, soundEngine) {
        this.scene = scene;
        this.bunkerBuilder = bunkerBuilder;
        this.soundEngine = soundEngine;
        this.hasBreached = false;
    }

    checkTimer(gameTimeSeconds, updateSoldierCountCallback) {
        // Tam 10:00 Dakika (600 saniye) Dolduğunda
        if (gameTimeSeconds >= 600 && !this.hasBreached) {
            this.executeBreach(updateSoldierCountCallback);
        }
    }

    executeBreach(updateSoldierCountCallback) {
        this.hasBreached = true;

        // 1. Ağır Patlama Sesi
        this.soundEngine.playArtilleryBoom();

        // 2. Ana Kapıyı Yık / Ortadan Kaldır
        if (this.bunkerBuilder.mainDoor) {
            this.scene.remove(this.bunkerBuilder.mainDoor);
        }

        // 3. Kapıdaki 2 Dost Asker Anında Şehit Olur
        updateSoldierCountCallback(2);

        // 4. Ekrana Kırmızı / Duman Etkisi
        document.getElementById('current-order').innerText = "KAPI ÇÖKTÜ! KORİDORLARI SAVUNUN!";
        document.getElementById('order-box').style.borderColor = "#ff0000";
    }
}
