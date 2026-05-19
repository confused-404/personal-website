const projects = [
    {
        title: 'RRR Scouting App',
        summary: 'A full-stack scouting platform used by Red Rock Robotics to collect, analyze, and export FRC match data during competition.',
        how: 'Led core development and system design across a React/Vite frontend, Node/Express backend, Firebase storage/auth, real-time data entry, visualization, filtering, and export workflows.',
        why: 'The app supports live strategy work for a top-ranked robotics team, handling concurrent scouts and unreliable competition Wi-Fi while keeping match data usable for drive team prep and alliance selection.',
        tags: ['React', 'Node.js', 'Express', 'Firebase', 'FRC'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/rrr-scouting-app'
            }
        ]
    },
    {
        title: 'Siren Detector',
        summary: 'A TSA software development project: a real-time embedded audio system that detects emergency sirens and car honks for deaf drivers.',
        how: 'Built around a Raspberry Pi 5 with dual I2S microphones, a Python/FastAPI backend, log-spectrogram CNN inference, and GCC-PHAT direction estimation.',
        why: 'Won first place in Software Development at the 2026 Utah TSA State Conference and will be presented at the national conference in June 2026.',
        tags: ['Python', 'FastAPI', 'Raspberry Pi', 'TFLite', 'TSA'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/siren-detector'
            }
        ]
    },
    {
        title: 'SeaGC',
        summary: 'A from-scratch garbage collector experiment in C, currently implemented as a small stop-the-world exact collector.',
        how: 'Built page-based allocation, explicit root sets, exact tracing, page-local livemaps, sweeping, page reuse, sparse-page evacuation, forwarding, and pointer repair.',
        why: 'The project is a way to understand memory management from the inside by building the machinery a runtime needs to find live objects, move them, and repair references.',
        tags: ['C', 'Garbage Collection', 'Memory Management', 'Runtime Systems'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/seagc'
            }
        ]
    },
    {
        title: 'Path Tracer',
        summary: 'A small CPU path tracer written in C as a learning project around the math behind ray tracing.',
        how: 'Implemented spheres, planes, triangles, diffuse/metal/glass materials, reflection, refraction, Moller-Trumbore intersections, AABB tests, BVH acceleration, and multithreaded rendering.',
        why: 'The project grew out of a math investigation into ray tracing and turned vector algebra, ray-object intersections, and acceleration structures into a working renderer.',
        tags: ['C', 'Rendering', 'Ray Tracing', 'BVH', 'Multithreading'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/path-tracer'
            }
        ]
    }
];

const createElement = (tag, options = {}) => {
    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }

    if (options.text) {
        element.textContent = options.text;
    }

    return element;
};

const renderProjects = () => {
    const projectList = document.querySelector('[data-projects]');

    if (!projectList) {
        return;
    }

    projects.forEach((project) => {
        const article = createElement('article', { className: 'project reveal' });
        const title = createElement('h3', { text: project.title });
        const details = createElement('div', { className: 'project-details' });
        const tags = createElement('ul', { className: 'project-meta' });
        const links = createElement('div', { className: 'project-links' });

        [
            ['What', project.summary],
            ['Built', project.how],
            ['Purpose', project.why]
        ].forEach(([label, text]) => {
            const row = createElement('p', { className: 'project-detail' });
            const labelElement = createElement('span', { text: label });

            row.append(labelElement, document.createTextNode(text));
            details.append(row);
        });

        project.tags.forEach((tag) => {
            tags.append(createElement('li', { text: tag }));
        });

        project.links.forEach((link) => {
            const anchor = createElement('a', { text: link.label });
            anchor.href = link.url;
            anchor.target = '_blank';
            anchor.rel = 'noreferrer';
            links.append(anchor);
        });

        article.append(title, details, tags);

        if (project.links.length > 0) {
            article.append(links);
        }

        projectList.append(article);
    });
};

const setupEmailButtons = () => {
    const emailButtons = document.querySelectorAll('[data-user][data-domain]');
    const emailStatus = document.querySelector('.email-status');

    emailButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const address = `${button.dataset.user}@${button.dataset.domain}`;
            button.textContent = address;

            if (emailStatus) {
                emailStatus.textContent = address;
            }

            window.location.href = `mailto:${address}`;
        });
    });
};

const setupReveals = () => {
    const revealElements = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach((element) => observer.observe(element));
};

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupEmailButtons();
    setupReveals();
});
