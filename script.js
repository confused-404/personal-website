document.addEventListener('DOMContentLoaded', () => {
    const fullHeader = document.querySelector('.full-header');
    const miniHeader = document.querySelector('.mini-header');
    const hamburger = document.querySelector('.hamburger');
    const miniNav = document.querySelector('.mini-nav');

    document.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            fullHeader.style.opacity = '0';
            fullHeader.style.visibility = 'hidden';
            miniHeader.classList.add('visible');
        } else {
            fullHeader.style.opacity = '1';
            fullHeader.style.visibility = 'visible';
            miniHeader.classList.remove('visible');
        }
    });

    hamburger.addEventListener('click', () => {
        miniNav.classList.toggle('active');
    });
});
