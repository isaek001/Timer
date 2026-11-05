const DURATION = 23 * 45 * 60 * 1000;

let endTime = null;
let remaining = DURATION;
let interval = null;
let running = false;

function display() {
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);

    document.getElementById('hours').textContent =
        String(h).padStart(2, '0');

    document.getElementById('minutes').textContent =
        String(m).padStart(2, '0');

    document.getElementById('seconds').textContent =
        String(s).padStart(2, '0');
}

function save() {
    localStorage.setItem('hackjosTimer', JSON.stringify({
        endTime,
        remaining,
        running
    }));
}

function update() {
    if (!running) return;

    remaining = Math.max(0, endTime - Date.now());
    display();

    if (remaining <= 0) {
        running = false;
        clearInterval(interval);
        interval = null;
        document.getElementById('statusText').textContent =
            '● EVENT COMPLETED';
        document.getElementById('finished').style.display = 'block';
        save();
    }
}

function startTimer() {
    if (running || remaining <= 0) return;

    running = true;
    endTime = Date.now() + remaining;

    document.getElementById('statusText').textContent =
        '● COUNTDOWN IN PROGRESS';

    clearInterval(interval);
    interval = setInterval(update, 250);

    update();
    save();
}

function pauseTimer() {
    if (!running) return;

    update();
    if (!running) return;

    running = false;
    clearInterval(interval);
    interval = null;

    document.getElementById('statusText').textContent =
        '● COUNTDOWN PAUSED';

    save();
}

function resetTimer() {
    if (!confirm('Reset the countdown to 48 hours?')) return;

    running = false;
    clearInterval(interval);
    interval = null;

    remaining = DURATION;
    endTime = null;

    document.getElementById('statusText').textContent =
        '● READY TO LAUNCH';

    document.getElementById('finished').style.display = 'none';

    display();
    save();
}

function fullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Restore timer after page refresh
function restore() {
    const saved = localStorage.getItem('hackjosTimer');

    if (saved) {
        const data = JSON.parse(saved);

        remaining = data.remaining;
        endTime = data.endTime;
        running = data.running;

        if (running) {
            update();

            if (running) {
                interval = setInterval(update, 250);
                document.getElementById('statusText').textContent =
                    '● COUNTDOWN IN PROGRESS';
            }
        } else if (remaining <= 0) {
            remaining = 0;
            document.getElementById('statusText').textContent =
                '● EVENT COMPLETED';
            document.getElementById('finished').style.display = 'block';
        } else {
            document.getElementById('statusText').textContent =
                '● COUNTDOWN PAUSED';
        }
    }

    display();
}

restore();