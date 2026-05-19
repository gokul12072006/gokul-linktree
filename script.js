document.addEventListener('DOMContentLoaded', () => {

    /* =======================================
       1. CINEMATIC INTRO SEQUENCE
       ======================================= */
    const startBtn = document.getElementById('start-btn');
    const introScreen = document.getElementById('intro-screen');
    const introFlash = document.getElementById('intro-flash');
    const linktreeHub = document.getElementById('linktree-hub');

    startBtn.addEventListener('click', () => {
        // Build a GSAP timeline for the "Genshin Startup" feel
        const tl = gsap.timeline();

        // 1. Flash of light, hide elements
        tl.to(introFlash, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
            .set('.crystal-core, .intro-text', { display: 'none' })
            .set(introScreen, { background: 'transparent' })

            // 2. Reveal the main hub under the flash
            .set(linktreeHub, { autoAlpha: 1, visibility: 'visible', className: '' })

            // 3. Fade out the flash rapidly
            .to(introFlash, { opacity: 0, duration: 1.5, ease: 'power2.out' })
            .set(introScreen, { display: 'none' }, "-=1") // Clean up completely

            // 4. Safely stagger animate the Linktree items with fromTo to guarantee visibility
            .fromTo('.profile-section',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' },
                "-=1.2"
            )
            .fromTo('.tree-link',
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
                "-=0.8"
            );
    });

    /* =======================================
       2. LINKTREE MODAL SYSTEM
       ======================================= */
    const treeLinks = document.querySelectorAll('.tree-link');
    const modalContainer = document.getElementById('modal-container');
    const modalInner = document.getElementById('modal-inner');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCloseBg = document.getElementById('modal-close-bg');
    const modalBodies = document.querySelectorAll('.modal-body');

    let modalActive = false;

    // Open Modal
    treeLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (modalActive) return;
            modalActive = true;

            const targetId = link.getAttribute('data-modal');

            // Hide all bodies, show target
            modalBodies.forEach(b => b.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Show container
            modalContainer.classList.remove('hidden');

            // GSAP Popup Animation
            gsap.fromTo(modalCloseBg, { opacity: 0 }, { opacity: 1, duration: 0.4 });
            gsap.fromTo(modalInner,
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }
            );
        });
    });

    // Close Modal Function
    const closeModal = () => {
        if (!modalActive) return;

        // GSAP Close Animation
        gsap.to(modalInner, { scale: 0.9, opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' });
        gsap.to(modalCloseBg, {
            opacity: 0, duration: 0.4, onComplete: () => {
                modalContainer.classList.add('hidden');
                modalBodies.forEach(b => b.classList.remove('active'));
                modalActive = false;

                // Reset modal inner inline styles injected by GSAP so it can open again clean
                gsap.set(modalInner, { clearProps: 'all' });
            }
        });
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalCloseBg.addEventListener('click', closeModal);

});
