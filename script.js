
/* ===== PARTICLE BACKGROUND ===== */
(function () {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COLORS = ['#4f8ef7', '#a855f7', '#00d4ff', '#ec4899'];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.5 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#4f8ef7';
                    ctx.globalAlpha = 0.05 * (1 - dist / 100);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ===== TYPEWRITER EFFECT ===== */
(function () {
    const roles = ['AI Developer', 'Web Developer', 'ML Enthusiast', 'Problem Solver', 'Tech Explorer'];
    let roleIdx = 0, charIdx = 0, deleting = false;
    const el = document.getElementById('type-text');
    function type() {
        const current = roles[roleIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
        }
        setTimeout(type, deleting ? 60 : 100);
    }
    type();
})();

/* ===== SKILLS DATA + RENDER ===== */
(function () {
    const skills = [
        { name: 'HTML', icon: '<i class="fab fa-html5" style="color:#e44d26"></i>', level: 'Advanced', pct: 90, bg: 'rgba(228,77,38,0.1)' },
        { name: 'CSS', icon: '<i class="fab fa-css3-alt" style="color:#264de4"></i>', level: 'Advanced', pct: 88, bg: 'rgba(38,77,228,0.1)' },
        { name: 'JavaScript', icon: '<i class="fab fa-js-square" style="color:#f7df1e"></i>', level: 'Intermediate', pct: 78, bg: 'rgba(247,223,30,0.1)' },
        { name: 'Artificial AI', icon: '<i class="fas fa-brain" style="color:#a855f7"></i>', level: 'Learning', pct: 70, bg: 'rgba(168,85,247,0.1)' },
        { name: 'SQL', icon: '<i class="fas fa-database" style="color:#00d4ff"></i>', level: 'Intermediate', pct: 75, bg: 'rgba(0,212,255,0.1)' },
        { name: 'Java', icon: '<i class="fab fa-java" style="color:#f89820"></i>', level: 'Intermediate', pct: 72, bg: 'rgba(248,152,32,0.1)' },
    ];
    const grid = document.getElementById('skills-grid');
    skills.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'skill-card reveal';
        card.style.transitionDelay = (i * 0.08) + 's';
        card.innerHTML = `
        <div class="skill-icon" style="background:${s.bg}">${s.icon}</div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-level">${s.level}</div>
        <div class="skill-bar-wrap">
          <div class="skill-bar" data-pct="${s.pct}" style="width:0%"></div>
        </div>`;
        grid.appendChild(card);
    });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate skill bars
                entry.target.querySelectorAll('.skill-bar').forEach(bar => {
                    bar.style.width = bar.dataset.pct + '%';
                });
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== MOBILE NAV TOGGLE ===== */
document.getElementById('nav-toggle').addEventListener('click', () => {
    const links = document.getElementById('nav-links');
    links.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

/* ===== CONTACT FORM (Web3Forms) ===== */
document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const successEl = document.getElementById('form-success');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: new FormData(this)
        });
        const data = await res.json();
        if (data.success) {
            this.reset();
            btn.style.display = 'none';
            successEl.style.display = 'block';
        } else {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
            alert('Something went wrong. Please try again.');
        }
    } catch {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        alert('Network error. Please try again later.');
    }
});
