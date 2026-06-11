/* RAÍZ URBANA — App root */
const { useEffect: useEffectApp } = React;

function scrollToContact() {
  const el = document.getElementById('contacto');
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -50 });
  else window.scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' });
}

/* Natural smooth scroll via Lenis (same engine as the reference site).
   Default settings — no exaggerated inertia or lag. Disabled on touch. */
function useSmoothScroll() {
  useEffectApp(() => {
    if (typeof Lenis === 'undefined') return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const lenis = new Lenis();
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el);
    };
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}

function App() {
  useSmoothScroll();
  useEffectApp(() => {
    const tick = () => window.lucide && window.lucide.createIcons();
    tick();
    const id = setInterval(tick, 700);
    setTimeout(() => clearInterval(id), 6000);
    return () => clearInterval(id);
  }, []);

  // Reveal-on-scroll: fade + rise elements as they enter the viewport
  useEffectApp(() => {
    const els = [...document.querySelectorAll('.reveal')];
    if (!els.length) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (let i = els.length - 1; i >= 0; i--) {
        const r = els[i].getBoundingClientRect();
        if (r.top < vh * 0.9) { els[i].classList.add('in'); els.splice(i, 1); }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <React.Fragment>
      <Nav onStart={scrollToContact} />
      <Hero onStart={scrollToContact} />
      <LogosBand />
      <Manifesto onStart={scrollToContact} />
      <Experience />
      <Transforma />
      <Impacto />
      <SearchSpaces onStart={scrollToContact} />
      <Audience />
      <Contact />
      <ContactBand />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
