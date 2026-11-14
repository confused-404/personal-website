const project = window.projects[document.body.dataset.project];
const scene = document.getElementById('run');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const last = project.stops.length - 1;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const locations = ['Trailhead', 'The lookout', 'Equipment hut', 'Ridge overlook', 'Lower lift station'];
const stationTypes = ['briefing', 'marker', 'hut', 'overlook', 'lift'];
let stop = 0;
let moving = false;
let arrival;

// The trees belong to a single strip of terrain, shared by every stop.
const forest = document.getElementById('forest');
for (let i = 0; i < 38; i++) {
  const tree = document.createElement('span');
  tree.className = 'pine';
  tree.style.left = `${i * 15 + 5}vw`;
  tree.style.height = `${75 + (i * 37) % 110}px`;
  tree.style.bottom = `${(i * 23) % 55}px`;
  forest.append(tree);
}

function readStop() {
  const value = Number(new URL(location.href).searchParams.get('stop') || 0);
  return Number.isInteger(value) ? Math.max(0, Math.min(last, value)) : 0;
}

function setTerrain(target) {
  scene.style.setProperty('--distance', `${target * window.innerWidth * .65}px`);
}

function render() {
  stop = readStop();
  const [title, copy, image, imageAlt] = project.stops[stop];
  document.getElementById('stop-title').textContent = title;
  document.getElementById('stop-copy').textContent = copy;
  const stopImage = document.getElementById('stop-image');
  if (stopImage) {
    stopImage.hidden = !image;
    if (image) {
      if (stopImage.getAttribute('src') !== image) stopImage.src = image;
      stopImage.alt = imageAlt || '';
    }
  }
  document.getElementById('stop-label').textContent = stop === 0 ? 'Trail notice / before you drop in' : `${String(stop + 1).padStart(2, '0')} / ${locations[stop]}`;
  document.getElementById('progress').textContent = `${project.title} / ${String(stop + 1).padStart(2, '0')} of ${String(project.stops.length).padStart(2, '0')}`;
  document.getElementById('trail-location').textContent = locations[stop];
  document.getElementById('marker-number').textContent = String(stop + 1).padStart(2, '0');
  document.getElementById('finish').hidden = stop !== last;
  document.getElementById('github').href = project.url;
  previous.disabled = stop === 0;
  next.hidden = stop === last;
  document.body.classList.toggle('at-finish', stop === last);
  document.body.classList.toggle('at-start', stop === 0);
  scene.dataset.station = stationTypes[stop];
  document.title = `${title} | ${project.title}`;
  setTerrain(stop);
}

function settle() {
  clearTimeout(arrival);
  moving = false;
  scene.classList.remove('is-moving', 'is-uphill');
  scene.removeAttribute('aria-busy');
  render();
}

function move(delta) {
  if (moving) return;
  const target = Math.max(0, Math.min(last, stop + delta));
  if (target === stop) return;
  const url = new URL(location.href);
  url.searchParams.set('stop', target);
  history.pushState(null, '', url);
  if (reducedMotion.matches) { settle(); return; }
  moving = true;
  const duration = delta < 0 ? 1500 : 850;
  scene.style.setProperty('--travel', `${duration}ms`);
  scene.setAttribute('aria-busy', 'true');
  scene.classList.add('is-moving');
  scene.classList.toggle('is-uphill', delta < 0);
  setTerrain(target);
  arrival = setTimeout(settle, duration);
}
previous.addEventListener('click', () => move(-1));
next.addEventListener('click', () => move(1));
scene.addEventListener('click', (event) => {
  if (event.target.closest('a, button') || window.getSelection().toString()) return;
  move(1);
});
scene.addEventListener('keydown', (event) => {
  if (event.target.closest('a, button') || event.repeat) return;
  if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    move(1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    move(-1);
  }
});
window.addEventListener('popstate', settle);
window.addEventListener('resize', () => setTerrain(readStop()));
window.addEventListener('pageshow', settle);
const initialUrl = new URL(location.href);
initialUrl.searchParams.set('stop', readStop());
history.replaceState(null, '', initialUrl);
render();
