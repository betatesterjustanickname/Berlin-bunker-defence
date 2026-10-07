export class OfficerAI {
    constructor(soundEngine) {
        this.soundEngine = soundEngine;
        this.currentOrder = "SIĞINAK SAVUNMASINA GEÇ!";
        this.complianceTimer = 4.0;
        this.isComplying = true;
    }

    update(deltaTime, playerPosition, isGameOver, triggerGameOverCallback) {
        if (isGameOver) return;

        // Zamanlayıcıyı Düşür
        this.complianceTimer -= deltaTime;
        document.getElementById('execution-timer').innerText = Math.max(0, this.complianceTimer).toFixed(1);

        // İnfaz Kontrolü: 4 saniye doldu ve oyuncu emre uymuyorsa
        if (this.complianceTimer <= 0) {
            this.soundEngine.playGunshot();
            triggerGameOverCallback(
                "KOMUTANA İTAATSİZLİKTEN İNFAZ EDİLDİNİZ",
                "Subay ve Elit Askerler verilen emri süresi içinde uygulamadığınız için kafanıza sıktı."
            );
        }
    }

    issueOrder(newOrderText) {
        this.currentOrder = newOrderText;
        this.complianceTimer = 4.0;
        document.getElementById('current-order').innerText = newOrderText;
    }
}
