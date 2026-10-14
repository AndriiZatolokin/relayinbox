// Progressive enhancement: the complete illustration stays visible without JS.
const scene = document.querySelector('[data-relay-story]');
const replay = document.querySelector('[data-story-replay]');
if (scene && replay) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  function play() {
    if (preference.matches) return;
    scene.classList.remove('is-playing');
    void scene.offsetWidth;
    scene.classList.add('is-playing');
  }
  function updatePreference() {
    replay.hidden = preference.matches;
    if (preference.matches) {
      observer?.disconnect();
      scene.classList.remove('is-playing');
    }
  }
  replay.addEventListener('click', play);
  preference.addEventListener('change', updatePreference);
  updatePreference();
  if (!preference.matches) {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      }, { threshold: 0.25 });
      observer.observe(scene);
    } else play();
  }
}
