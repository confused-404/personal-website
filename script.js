const projects = [
    {
        title: 'YADQN',
        summary: 'A from-scratch Deep Q-Network experiment for solving CartPole in Gymnasium.',
        how: 'Implemented the neural network and training loop without PyTorch to better understand the mechanics behind reinforcement learning.',
        why: 'The project made abstract ML concepts concrete by exposing each part of the agent, environment loop, and optimization process.',
        tags: ['Python', 'Reinforcement Learning', 'Neural Networks'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/yadqn'
            }
        ]
    },
    {
        title: 'C++ Chat App with Winsock',
        summary: 'A terminal chat server built to explore networking fundamentals and concurrent client handling.',
        how: 'Used C++ and Winsock for the server implementation, then wrote a Python script to test client behavior.',
        why: 'The project helped connect socket APIs, protocol flow, and real-time communication behavior in a small system.',
        tags: ['C++', 'Winsock', 'Networking', 'Python'],
        links: [
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/chat-app'
            }
        ]
    },
    {
        title: 'Water Watcher',
        summary: 'A hackathon project focused on encouraging water conservation through lightweight gamification.',
        how: 'Collaborated with a teammate to design and build the project quickly within a short event timeline.',
        why: 'The project was useful practice in turning an open-ended problem into a focused prototype under time pressure.',
        tags: ['Hackathon', 'Web App', 'Collaboration'],
        links: [
            {
                label: 'Devpost',
                url: 'https://devpost.com/software/water-watcher'
            },
            {
                label: 'GitHub',
                url: 'https://github.com/confused-404/water-watcher'
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
        const summary = createElement('p', { text: project.summary });
        const how = createElement('p', { text: project.how });
        const why = createElement('p', { text: project.why });
        const tags = createElement('ul', { className: 'project-meta' });
        const links = createElement('div', { className: 'project-links' });

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

        article.append(title, summary, how, why, tags, links);
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
