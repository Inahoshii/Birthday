document.addEventListener('DOMContentLoaded', () => {
    
    // --- KONFIGURASI LOGS ---
    const logs = [
        "> SYSTEM: O.F.A_V.9.0",
        "> USER: DEKU_VIGILANTE",
        "> CHECKING INTEGRITY...",
        "> ERROR: 15% CORRUPTION FOUND",
        "> OVERRIDING SAFETY...",
        "> INITIALIZING..."
    ];

    // --- DOM ELEMENTS ---
    const terminalDiv = document.getElementById('terminalLog');
    const titleStrip = document.getElementById('titleStrip');
    const mainPanel = document.getElementById('mainPanel');
    
    // --- STATE VARIABLES ---
    let lineIndex = 0;
    
    // --- FUNGSI UTAMA: MENGETIK BARIS DEMI BARIS ---
    function typeLine() {
        if (lineIndex < logs.length) {
            const line = logs[lineIndex];
            let charIndex = 0;
            
            // Buat elemen baris baru
            const lineElement = document.createElement('div');
            
            // Bersihkan kursor dari baris sebelumnya agar rapi
            const oldCursor = document.querySelector('.cursor');
            if(oldCursor) oldCursor.remove();
            
            terminalDiv.appendChild(lineElement);

            // Interval pengetikan per karakter
            const typingInterval = setInterval(() => {
                lineElement.textContent += line.charAt(charIndex);
                charIndex++;
                
                if (charIndex >= line.length) {
                    clearInterval(typingInterval);
                    lineIndex++;
                    // Tambahkan kursor di akhir baris yang baru selesai
                    lineElement.innerHTML += '<span class="cursor">_</span>';
                    // Delay sebelum baris berikutnya muncul
                    setTimeout(typeLine, 300); 
                }
            }, 30); // Kecepatan ketik (ms)
        } else {
            // Jika semua baris selesai -> Panggil animasi 'Impact'
            triggerImpact();
        }
    }

    // --- FUNGSI DAMPAK VISUAL (SLAM & SHAKE) ---
    function triggerImpact() {
        setTimeout(() => {
            // 1. Munculkan Strip Judul (Slam)
            titleStrip.classList.add('slam-active');
            
            // 2. Getarkan Panel Utama
            setTimeout(() => {
                mainPanel.classList.add('shake-active');
            }, 200); // Sinkronisasi waktu tumbukan

        }, 500); // Jeda dramatis setelah ketikan terakhir
    }

    // --- START SEQUENCE ---
    // Mulai setelah 1 detik agar user siap melihat
    setTimeout(typeLine, 1000);

});