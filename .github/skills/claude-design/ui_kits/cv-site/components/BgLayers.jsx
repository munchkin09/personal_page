function BgLayers() {
  // Parallax: foreground 1.0 (CSS scroll), mid 0.6 (blobs), back 0.3 (dotgrid)
  React.useEffect(() => {
    let raf;
    const update = () => {
      const y = window.scrollY;
      document.querySelectorAll('.bg-blob').forEach((el, i) => {
        const rate = [0.6, 0.5, 0.4][i] || 0.5;
        el.style.setProperty('--py', `${-y * rate}px`);
      });
      const dg = document.querySelector('.bg-dotgrid');
      if (dg) dg.style.setProperty('--py', `${-y * 0.3}px`);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="bg-dotgrid" style={{transform:'translateY(var(--py,0))'}}/>
      <img className="bg-blob b1" src="../../assets/blob-violet.svg" style={{transform:'translateY(var(--py,0))'}}/>
      <img className="bg-blob b2" src="../../assets/blob-cyan.svg" style={{transform:'translateY(var(--py,0))'}}/>
      <img className="bg-blob b3" src="../../assets/blob-pink.svg" style={{transform:'translateY(var(--py,0))'}}/>
    </div>
  );
}
Object.assign(window, { BgLayers });
