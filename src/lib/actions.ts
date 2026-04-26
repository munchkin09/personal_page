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

export function spotlight(node: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    node.style.setProperty('--mouse-x', `${x}px`);
    node.style.setProperty('--mouse-y', `${y}px`);
  };
  node.addEventListener('mousemove', onMove);
  return {
    destroy() {
      node.removeEventListener('mousemove', onMove);
    },
  };
}

export function tilt(node: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angles (max ~6 degrees)
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    
    // Apply 3D transform
    node.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Also set mouse variables for spotlight/glare effects
    node.style.setProperty('--mouse-x', `${x}px`);
    node.style.setProperty('--mouse-y', `${y}px`);
  };
  
  const onLeave = () => {
    node.style.transition = 'transform 0.6s var(--ease-spring)';
    node.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => (node.style.transition = ''), 600);
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

export function ripple(node: HTMLElement) {
  const onClick = (e: MouseEvent) => {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height) * 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x - diameter / 2}px`;
    circle.style.top = `${y - diameter / 2}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'color-mix(in srgb, currentColor 20%, transparent)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple-effect 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    circle.style.pointerEvents = 'none';
    
    node.style.overflow = 'hidden';
    if (getComputedStyle(node).position === 'static') {
      node.style.position = 'relative';
    }
    
    node.appendChild(circle);
    
    // Elastic click effect
    node.style.transform = 'scale(0.92)';
    setTimeout(() => {
      node.style.transform = '';
      setTimeout(() => circle.remove(), 400); // Remove after animation
    }, 150);
  };
  
  node.addEventListener('mousedown', onClick);
  
  return {
    destroy() {
      node.removeEventListener('mousedown', onClick);
    },
  };
}
