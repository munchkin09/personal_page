import { activeSection } from './stores';

export function fadeIn(node: HTMLElement) {
  node.classList.add('fade-in');
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
  );
  obs.observe(node);
  return { destroy() { obs.disconnect(); } };
}

export function magnetic(node: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    node.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onLeave = () => {
    node.style.transition = 'transform 0.5s var(--ease-spring)';
    node.style.transform = '';
    setTimeout(() => (node.style.transition = ''), 500);
  };
  node.addEventListener('mousemove', onMove);
  node.addEventListener('mouseleave', onLeave);
  return {
    destroy() {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    },
  };
}

export function observeSection(node: HTMLElement) {
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeSection.set(e.target.id);
      }
    },
    { threshold: 0.3 },
  );
  obs.observe(node);
  return { destroy() { obs.disconnect(); } };
}
