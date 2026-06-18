(function initCineflowCursor() {
    function start() {
        const cursor = document.querySelector('.cursor');
        const cursorGlow = document.querySelector('.cursor-glow');
        if (!cursor) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let glowX = mouseX;
        let glowY = mouseY;
        let ambientX = mouseX;
        let ambientY = mouseY;
        let lastT = performance.now();

        function expSmooth(k, dt) {
            return 1 - Math.exp(-k * dt);
        }

        function setAmbientCss(ax, ay) {
            const vx = (ax / window.innerWidth) * 100;
            const vy = (ay / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--cursor-ambient-x', `${vx}%`);
            document.documentElement.style.setProperty('--cursor-ambient-y', `${vy}%`);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function place(el, x, y) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }

        function tick(now) {
            const dt = Math.min((now - lastT) / 1000, 0.064);
            lastT = now;

            const fMain = expSmooth(26, dt);
            const fGlow = expSmooth(10, dt);
            const fAmbient = expSmooth(5.5, dt);

            cursorX += (mouseX - cursorX) * fMain;
            cursorY += (mouseY - cursorY) * fMain;
            glowX += (mouseX - glowX) * fGlow;
            glowY += (mouseY - glowY) * fGlow;
            ambientX += (mouseX - ambientX) * fAmbient;
            ambientY += (mouseY - ambientY) * fAmbient;

            place(cursor, cursorX, cursorY);
            if (cursorGlow) place(cursorGlow, glowX, glowY);
            setAmbientCss(ambientX, ambientY);

            requestAnimationFrame(tick);
        }

        setAmbientCss(ambientX, ambientY);
        requestAnimationFrame(tick);
        window.addEventListener('resize', () => setAmbientCss(ambientX, ambientY));

        const interactiveSelector =
            'a, button, [role="button"], .btn-primary, .btn-outline, .btn-smart, .filter-chip, .mood-card, .addon-card, .seat, .movie-card, .nav-links a, .theater-card, .ott-card, .booking-tab, .ticket-card, .tab-btn, .soc-btn, .control-btn, .btn-table, .payment-option, .parking-card, .tpicker-movie-item, .tpicker-time-slot, .date-item, .addon-action-btn, .reward-card, .notification-card, select, input[type="checkbox"], input[type="radio"]';

        function setHovering(on) {
            cursor.classList.toggle('hovering', on);
            if (cursorGlow) cursorGlow.classList.toggle('hovering', on);
        }

        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) setHovering(true);
        });

        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) setHovering(false);
        });

        function setActive(on) {
            cursor.classList.toggle('active', on);
            if (cursorGlow) cursorGlow.classList.toggle('active', on);
        }

        document.addEventListener('mousedown', () => setActive(true));
        document.addEventListener('mouseup', () => setActive(false));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
