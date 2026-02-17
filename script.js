document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.skill-card, .project-card, .section-title, .language-card, .timeline-item, .badge-card, .resume-preview, .resume-info, .location-card, .about-stat-card, .about-text-column');
    hiddenElements.forEach((el) => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    // --- Modal Logic ---
    const modal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-modal');

    if (openBtns.length > 0) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('open'), 10);
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            setTimeout(() => modal.style.display = 'none', 300);
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    });

    // --- Formspree / Email Handling ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            const data = new FormData(form);
            const action = form.action;

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    alert("Thanks! Your message has been sent.");
                    form.reset();
                    modal.classList.remove('open');
                    setTimeout(() => modal.style.display = 'none', 300);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your form");
                        }
                    });
                }
            }).catch(error => {
                alert("Oops! There was a problem submitting your form");
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- 3D Scene with Three.js ---
    initThreeJS();
});

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 8); // Position camera to look down at the desk
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 1, 100);
    pointLight.position.set(2, 5, 2);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const monitorLight = new THREE.PointLight(0x4facfe, 0.8, 5); // Glow from screen
    monitorLight.position.set(0, 1.5, 0.5);
    scene.add(monitorLight);

    // GROUP FOR THE WHOLE SETUP
    const deskGroup = new THREE.Group();
    scene.add(deskGroup);

    // 1. DESK
    const deskGeometry = new THREE.BoxGeometry(7, 0.2, 3);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.y = -0.1;
    desk.receiveShadow = true;
    deskGroup.add(desk);

    // 2. MONITOR STAND
    const standGeo = new THREE.BoxGeometry(0.3, 1, 0.3);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.5, -0.5);
    deskGroup.add(stand);

    // 3. MONITOR FRAME
    const monitorGeo = new THREE.BoxGeometry(3.2, 2, 0.2);
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const monitorFrame = new THREE.Mesh(monitorGeo, monitorMat);
    monitorFrame.position.set(0, 1.5, -0.5);
    monitorFrame.castShadow = true;
    deskGroup.add(monitorFrame);

    // 4. MONITOR SCREEN (DYNAMIC CANVAS TEXTURE)
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const ctx = screenCanvas.getContext('2d');

    // Initial Canvas State
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 256);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenGeo = new THREE.PlaneGeometry(3, 1.8);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.5, -0.39); // Slightly in front of frame
    deskGroup.add(screenMesh);

    // 5. KEYBOARD
    const kbGeo = new THREE.BoxGeometry(1.5, 0.1, 0.6);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(0, 0.1, 0.8);
    keyboard.rotation.x = 0.1; // Slight tilt
    deskGroup.add(keyboard);

    // 6. SIMPLE STUDENT (Abstract Low Poly)
    const bodyGroup = new THREE.Group();
    deskGroup.add(bodyGroup);

    // Body
    const torsoGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x3366cc }); // Blue shirt
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.5, 2.2);
    bodyGroup.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa }); // Skin tone
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.3, 2.2);
    bodyGroup.add(head);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x3366cc });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.5, 0.8, 2);
    leftArm.rotation.set(1.5, 0, -0.3); // Reaching for keyboard
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.5, 0.8, 2);
    rightArm.rotation.set(1.5, 0, 0.3);
    bodyGroup.add(rightArm);


    // TYPING ANIMATION STATE
    const codeLines = [
        "#include <stdio.h>",
        "int main() {",
        "  printf(\"Hello World\");",
        "  return 0;",
        "}"
    ];
    let lineIndex = 0;
    let charIndex = 0;
    let lastTypeTime = 0;
    const typeSpeed = 100; // ms per char

    function updateScreen(time) {
        if (time - lastTypeTime > typeSpeed && lineIndex < codeLines.length) {
            lastTypeTime = time;

            // Draw Background
            ctx.fillStyle = '#1e1e1e'; // VS Code dark
            ctx.fillRect(0, 0, 512, 256);

            // Draw Text
            ctx.fillStyle = '#00ff00'; // Green text
            ctx.font = '24px Consolas, monospace';
            ctx.textBaseline = 'top';

            let yOffset = 20;
            for (let i = 0; i <= lineIndex; i++) {
                let text = codeLines[i];
                if (i === lineIndex) {
                    text = text.substring(0, charIndex);
                    charIndex++;
                }
                ctx.fillText(text, 20, yOffset);
                yOffset += 30;
            }

            // Blinking Cursor
            if (lineIndex < codeLines.length) {
                const currentLine = codeLines[lineIndex].substring(0, charIndex);
                const width = ctx.measureText(currentLine).width;
                ctx.fillRect(20 + width, yOffset - 30, 2, 24);
            }

            // Move to next line if finished
            if (charIndex > codeLines[lineIndex].length) {
                lineIndex++;
                charIndex = 0;
            }

            // Reset loop if done
            if (lineIndex >= codeLines.length) {
                setTimeout(() => {
                    lineIndex = 0;
                    charIndex = 0;
                }, 3000); // Wait 3s before restart
            }

            screenTexture.needsUpdate = true;
        }
    }

    // ANIMATION LOOP
    function animate(time) {
        requestAnimationFrame(animate);

        updateScreen(time);

        // Subtle floating movement for the desk/camera feel
        camera.position.x = Math.sin(time * 0.0005) * 0.5;
        camera.position.y = 3 + Math.cos(time * 0.0005) * 0.2;
        camera.lookAt(0, 0, 0);

        // "Typing" motion for arms
        if (lineIndex < codeLines.length) {
            leftArm.position.y = 0.8 + Math.sin(time * 0.02) * 0.02;
            rightArm.position.y = 0.8 + Math.cos(time * 0.02) * 0.02;
        }

        renderer.render(scene, camera);
    }
    animate(0);

    // HANDLE RESIZE
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
