export class OfficerAI {
    constructor(bunkerBuilder, soundEngine) {
        this.bunker = bunkerBuilder;
        this.sound = soundEngine;
        this.complianceTimer = 25.0; // Uzun Emir Süresi
        this.currentOrder = "SIĞINAK SAVUNMASINA GEÇ!";
        this.isExecuting = false;
        this.patrolTargetZ = 15;
    }

    update(delta, playerPos, triggerGameOverCallback) {
        if (this.isExecuting) return;

        // 1. Subay Devriye Hareketi
        if (this.bunker.officerMesh) {
            const officer = this.bunker.officerMesh;
            officer.position.z += (this.patrolTargetZ - officer.position.z) * 0.01;
            if (Math.abs(officer.position.z - this.patrolTargetZ) < 1) {
                this.patrolTargetZ *= -1; // Yön Değiştir
            }
        }

        // 2. Emir Süresi Sayacı
        this.complianceTimer -= delta;
        document.getElementById('execution-timer').innerText = Math.max(0, this.complianceTimer).toFixed(1);

        // 3. İtaatsizlik Durumu (Süre Doldu)
        if (this.complianceTimer <= 0) {
            this.startExecutionSequence(playerPos, triggerGameOverCallback);
        }
    }

    startExecutionSequence(playerPos, triggerGameOverCallback) {
        this.isExecuting = true;
        document.getElementById('current-order').innerText = "İTAATSİZLİK! İNFAZ EDİLİYOR!";

        // Elit Askerlerin Oyuncunun Üzerine Yürümesi
        const interval = setInterval(() => {
            let reached = 0;
            this.bunker.eliteSoldiers.forEach((elite) => {
                elite.position.lerp(playerPos, 0.05);
                if (elite.position.distanceTo(playerPos) < 1.2) {
                    reached++;
                }
            });

            if (reached >= 1) {
                clearInterval(interval);
                this.sound.playGunshot();
                triggerGameOverCallback(
                    "KOMUTANA İTAATSİZLİKTEN İNFAZ EDİLDİNİZ",
                    "Emre uymadığınız için 2 Elit Asker tarafından yakalanıp kafanıza sıkıldı."
                );
            }
        }, 30);
    }

    complyWithOrder() {
        this.complianceTimer = 25.0; // Süreyi yenile
    }
}
