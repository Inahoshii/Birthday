document.addEventListener("DOMContentLoaded", () => {
    const bgmAction = document.getElementById('bgm-action');
    const sfxRadio = document.getElementById('sfx-radio');
    const sfxType = document.getElementById('sfx-type');
    const sfxGun = document.getElementById('sfx-gun');
    const sfxBeep = document.getElementById('sfx-beep');
    const sfxWin = document.getElementById('sfx-win');
    const sfxSniper = document.getElementById('sfx-sniper');
    bgmAction.volume = 0.4;
    
    const screenGlitch = document.getElementById('screen-glitch');

    function triggerGlitch() {
        screenGlitch.style.opacity = '1';
        sfxRadio.currentTime = 0; sfxRadio.play().catch(()=>{});
        setTimeout(() => screenGlitch.style.opacity = '0', 150);
    }

    // Pembersihan kelas super aman agar tidak tumpuk
 function deployToMission(hideId, showId) {
        const transOverlay = document.getElementById('tactical-transition');
        
        // Suara radio statis saat mulai transisi
        sfxRadio.currentTime = 0; sfxRadio.play().catch(()=>{});

        // 1. Layar Hitam (Loading) turun menutupi
        transOverlay.classList.add('wipe-in');

        // 2. Ganti halaman misi di belakang layar hitam
        setTimeout(() => {
            document.querySelectorAll('.mission-section').forEach(sec => {
                sec.classList.remove('active-mission');
                sec.classList.add('hidden');
            });
            
            const target = document.getElementById(showId);
            target.classList.remove('hidden');

            // 3. Layar Hitam naik (membuka), Misi baru nge-zoom in
            setTimeout(() => {
                transOverlay.classList.remove('wipe-in');
                target.classList.add('active-mission');
                window.scrollTo(0, 0);
            }, 300); // Waktu jeda "Loading Intel" dibaca

        }, 500); // Sinkron dengan kecepatan layar hitam turun
    }

    // --- TITLE SCREEN ---
    document.getElementById('mission-start').addEventListener('pointerdown', () => {
        bgmAction.play().catch(()=>{});
        deployToMission('mission-start', 'mission-briefing');
        setTimeout(typeWriterPrice, 1000);
    });

    // --- BRIEFING ---
    const priceTextStr = "Listen up, Agent Nell. The target 'Aging' is advancing. Before you hit the Bomb Site, you must pass Security and survive the Gulag. Show us your aim.";
    const priceTextElement = document.getElementById('price-text');
    let typeIndex = 0;

    function typeWriterPrice() {
        if (typeIndex < priceTextStr.length) {
            priceTextElement.innerHTML += priceTextStr.charAt(typeIndex);
            if (typeIndex % 2 === 0) { sfxType.currentTime = 0; sfxType.play().catch(()=>{}); }
            typeIndex++;
            setTimeout(typeWriterPrice, 30);
        } else {
            document.getElementById('btn-deploy').classList.remove('hidden');
        }
    }

    document.getElementById('btn-deploy').addEventListener('pointerdown', () => {
        sfxGun.play();
        deployToMission('mission-briefing', 'mission-terminal');
    });

    // --- TERMINAL HACK ---
    const hackInput = document.getElementById('hack-input');
    const hackMsg = document.getElementById('hack-msg');
    const SECRET_PASSWORD = "NELL";

    document.getElementById('btn-hack').addEventListener('pointerdown', () => {
        sfxType.currentTime = 0; sfxType.play();
        if (hackInput.value.trim().toUpperCase() === SECRET_PASSWORD) {
            hackMsg.innerText = "ACCESS GRANTED. DEPLOYING...";
            hackMsg.style.color = "#00ff00";
            setTimeout(() => { deployToMission('mission-terminal', 'mission-gulag'); setTimeout(startGulag, 800); }, 1000);
        } else {
            hackMsg.innerText = "ACCESS DENIED.";
            hackMsg.style.color = "#ff3333";
            hackInput.value = "";
            document.querySelector('.intel-box').classList.add('shake-hard');
            setTimeout(() => document.querySelector('.intel-box').classList.remove('shake-hard'), 400);
        }
    });

    // --- THE GULAG ---
    const aimArena = document.getElementById('aim-arena');
    const gulagScoreText = document.getElementById('gulag-score');
    let gulagScore = 0; const maxGulagScore = 5;
    let targetElement = null; let totalShots = 0; let totalReactionTime = 0; let targetSpawnTime = 0;

    aimArena.addEventListener('pointerdown', (e) => {
        if (e.target === aimArena) {
            totalShots++; sfxGun.currentTime = 0; sfxGun.play();
            const bulletHole = document.createElement('div');
            bulletHole.classList.add('bullet-hole');
            const rect = aimArena.getBoundingClientRect();
            bulletHole.style.left = `${e.clientX - rect.left}px`;
            bulletHole.style.top = `${e.clientY - rect.top}px`;
            aimArena.appendChild(bulletHole);
        }
    });

    function spawnTarget() {
        if (targetElement) targetElement.remove();
        targetElement = document.createElement('div');
        targetElement.classList.add('target-enemy');
        const x = Math.random() * (aimArena.clientWidth - 60);
        const y = Math.random() * (aimArena.clientHeight - 60);
        targetElement.style.left = `${x}px`; targetElement.style.top = `${y}px`;
        targetSpawnTime = Date.now();
        
        targetElement.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            totalShots++; sfxGun.currentTime = 0; sfxGun.play();
            totalReactionTime += (Date.now() - targetSpawnTime);
            targetElement.remove();
            gulagScore++; gulagScoreText.innerText = gulagScore;
            
            if (gulagScore < maxGulagScore) spawnTarget();
            else showAAR();
        });
        aimArena.appendChild(targetElement);
    }

    function showAAR() {
        aimArena.classList.add('hidden');
        document.getElementById('gulag-score-board').classList.add('hidden');
        const accuracy = totalShots > 0 ? Math.round((maxGulagScore / totalShots) * 100) : 0;
        document.getElementById('stat-acc').innerText = accuracy;
        document.getElementById('stat-rt').innerText = Math.round(totalReactionTime / maxGulagScore);
        const comment = document.getElementById('stat-comment');
        if (accuracy >= 80) { comment.innerText = '"Good aim."'; comment.style.color = "#00ff00"; }
        else { comment.innerText = '"You shoot like a bot! Move on!"'; comment.style.color = "#ff3333"; }
        document.getElementById('gulag-aar').classList.remove('hidden');
    }

    function startGulag() {
        gulagScore = 0; totalShots = 0; totalReactionTime = 0;
        gulagScoreText.innerText = gulagScore;
        document.querySelectorAll('.bullet-hole').forEach(hole => hole.remove());
        spawnTarget();
    }

    document.getElementById('btn-to-snd').addEventListener('pointerdown', () => {
        sfxRadio.play();
        deployToMission('mission-gulag', 'mission-snd');
        startBombTimer();
    });

    // --- SEARCH & DESTROY ---
    const bombTimerText = document.getElementById('bomb-timer');
    const defuseInputDisplay = document.getElementById('defuse-input');
    const bombUI = document.getElementById('bomb-ui');
    let currentInput = ""; let bombInterval; let timeLeft = 15;

    function startBombTimer() {
        clearInterval(bombInterval); // Pastikan bersih
        bombInterval = setInterval(() => {
            timeLeft--;
            bombTimerText.innerText = `00:00:${timeLeft < 10 ? '0'+timeLeft : timeLeft}`;
            sfxBeep.currentTime = 0; sfxBeep.play();

            if (timeLeft <= 0) {
                clearInterval(bombInterval);
                bombTimerText.innerText = "DETONATED";
                triggerGlitch();
                setTimeout(() => { timeLeft = 15; currentInput = ""; defuseInputDisplay.innerText = "_ _ _"; defuseInputDisplay.style.color = "#00ff00"; startBombTimer(); }, 2000);
            }
        }, 1000);
    }

    document.querySelectorAll('.key-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
            if (currentInput.length < 3 && timeLeft > 0) {
                sfxType.currentTime = 0; sfxType.play();
                currentInput += e.target.getAttribute('data-num');
                let displayStr = currentInput.split('').join(' ');
                while (displayStr.length < 5) displayStr += " _";
                defuseInputDisplay.innerText = displayStr;

                if (currentInput.length === 3) {
                    clearInterval(bombInterval);
                    if (currentInput === "141") {
                        defuseInputDisplay.innerText = "DEFUSED";
                        defuseInputDisplay.style.color = "#00ccff";
                        sfxWin.play();
                        
                        // MULAI QTE
                        setTimeout(() => {
                            bgmAction.pause(); sfxSniper.play(); 
                            deployToMission('mission-snd', 'mission-qte');
                            startQTE();
                        }, 1500);
                    } else {
                        defuseInputDisplay.innerText = "ERROR";
                        defuseInputDisplay.style.color = "#ff3333";
                        bombUI.classList.add('shake-hard');
                        setTimeout(() => bombUI.classList.remove('shake-hard'), 400);
                        setTimeout(() => { currentInput = ""; defuseInputDisplay.innerText = "_ _ _"; defuseInputDisplay.style.color = "#00ff00"; startBombTimer(); }, 1000);
                    }
                }
            }
        });
    });

    // --- QTE AMBUSH (FIXED LOGIC) ---
    const btnEvade = document.getElementById('btn-evade');
    const deathScreen = document.getElementById('death-screen');
    const qteUI = document.getElementById('qte-ui');
    let qteTimeout;
    let isDead = false;

    function startQTE() {
        isDead = false;
        qteUI.classList.remove('hidden');
        deathScreen.classList.add('hidden');

        qteTimeout = setTimeout(() => {
            isDead = true;
            qteUI.classList.add('hidden');
            deathScreen.classList.remove('hidden');
            sfxGun.play();
            
            // RESET SETELAH MATI
            setTimeout(() => {
                deathScreen.classList.add('hidden');
                qteUI.classList.remove('hidden');
                bgmAction.play();
                timeLeft = 15; currentInput = ""; defuseInputDisplay.innerText = "_ _ _"; defuseInputDisplay.style.color = "#00ff00";
                deployToMission('mission-qte', 'mission-snd');
                startBombTimer();
            }, 3000);
        }, 1500); // Waktu reaksi 1.5 detik
    }

    btnEvade.addEventListener('pointerdown', (e) => {
        e.preventDefault(); // Mencegah klik bocor
        if (isDead) return; // Kalau telat, tombol mati
        
        clearTimeout(qteTimeout); // Hentikan timer mati
        sfxWin.play();
        bgmAction.play(); 
        deployToMission('mission-qte', 'mission-victory');
    });

    // --- LOOT BOX & VICTORY ---
    const carePackage = document.getElementById('care-package');
    const supplyDropPhase = document.getElementById('supply-drop-phase');
    const realVictoryContent = document.getElementById('real-victory-content');
    let crateTaps = 0; const maxTaps = 10;

    carePackage.addEventListener('pointerdown', () => {
        if (crateTaps < maxTaps) {
            crateTaps++;
            document.getElementById('crate-counter').innerText = `${crateTaps} / 10 TAPS`;
            sfxType.currentTime = 0; sfxType.play();
            carePackage.classList.add('crate-hit');
            setTimeout(() => carePackage.classList.remove('crate-hit'), 200);

            if (crateTaps === maxTaps) {
                sfxSniper.currentTime = 0; sfxSniper.play(); 
                triggerGlitch();
                setTimeout(() => {
                    supplyDropPhase.classList.add('hidden');
                    realVictoryContent.classList.remove('hidden');
                }, 500);
            }
        }
    });
});