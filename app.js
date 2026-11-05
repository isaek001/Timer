(() => {
    const TARGET_DATE = '2026-11-06T10:30:18+01:00';
    const targetTime = new Date(TARGET_DATE).getTime();

    function initialize() {
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');
        const status = document.getElementById('statusText');
        const finished = document.getElementById('finished');
        let interval = null;

        function update() {
            const remaining = Math.max(0, targetTime - Date.now());
            const totalSeconds = Math.ceil(remaining / 1000);

            hours.textContent = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            seconds.textContent = String(totalSeconds % 60).padStart(2, '0');

            if (remaining === 0) {
                status.textContent = '● EVENT COMPLETED';
                finished.style.display = 'block';
                clearInterval(interval);
                interval = null;
            } else {
                status.textContent = '● COUNTDOWN IN PROGRESS';
                finished.style.display = 'none';
            }
        }

        if (!Number.isFinite(targetTime)) {
            status.textContent = '● INVALID EVENT DATE';
            return;
        }

        update();
        if (targetTime > Date.now()) {
            interval = setInterval(update, 250);
        }

        async function enterFullscreen() {
            if (document.fullscreenElement || typeof document.documentElement.requestFullscreen !== 'function') return;

            try {
                await document.documentElement.requestFullscreen();
                document.removeEventListener('pointerdown', enterFullscreen);
                document.removeEventListener('keydown', enterFullscreen);
            } catch {
            }
        }

        document.addEventListener('pointerdown', enterFullscreen);
        document.addEventListener('keydown', enterFullscreen);
        enterFullscreen();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
