/* ==========================================
   SANKET PAWAR - PORTFOLIO SCRIPTS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Page Loader ----------
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide loader after 3 seconds
    setTimeout(() => loader.classList.add('hidden'), 3000);

    // ---------- Typing Effect ----------
    const typedEl = document.getElementById('typed-text');
    const phrases = [
        'Full Stack Developer',
        'React.js Enthusiast',
        'Python Developer',
        'Problem Solver',
        'Tech Explorer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeDelay = 300;
        }

        setTimeout(typeEffect, typeDelay);
    }

    if (typedEl) typeEffect();

    // ---------- Scroll Progress Bar ----------
    const scrollProgress = document.getElementById('scroll-progress');
    function updateScrollProgress() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateScrollProgress();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Active Nav Link on Scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---------- Mobile Menu ----------
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // ---------- Theme Toggle ----------
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ---------- Scroll Reveal ----------
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Skill Bars Animation ----------
    const skillFills = document.querySelectorAll('.skill-fill');
    const languageFills = document.querySelectorAll('.language-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(fill => barObserver.observe(fill));
    languageFills.forEach(fill => barObserver.observe(fill));

    // ---------- Skill Tabs ----------
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Re-trigger bar animations for newly visible panel
            document.getElementById(target).querySelectorAll('.skill-fill').forEach(fill => {
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = fill.getAttribute('data-width') + '%';
                }, 100);
            });
        });
    });

    // ---------- Contact Modal ----------
    const modal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // ---------- Contact Form ----------
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            const data = new FormData(form);
            const action = form.action;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch(action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    form.reset();
                    closeModal();
                    showToast('Message sent successfully!', 'success');
                } else {
                    response.json().then(data => {
                        if (data.errors) {
                            showToast(data.errors.map(e => e.message).join(', '), 'error');
                        } else {
                            showToast('Something went wrong. Please try again.', 'error');
                        }
                    });
                }
            }).catch(() => {
                showToast('Network error. Please try again.', 'error');
            }).finally(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            });
        });
    }

    // ---------- Toast Notification ----------
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            padding: 0.8rem 1.5rem;
            background: ${type === 'success' ? '#00d4aa' : '#ff4757'};
            color: #fff;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            font-family: var(--font-main);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ---------- Particle Background ----------
    initParticles();
});

// ---------- Particle Canvas Animation ----------
function initParticles() {
    const container = document.getElementById('particles-canvas');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height, particles, mouse;

    function resize() {
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    mouse = { x: null, y: null };
    container.style.pointerEvents = 'none';

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }
        }

        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'light' ? '108, 99, 255' : '108, 99, 255';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(Math.floor((width * height) / 8000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const theme = document.documentElement.getAttribute('data-theme');
        const lineColor = theme === 'light' ? '108, 99, 255' : '108, 99, 255';

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}
