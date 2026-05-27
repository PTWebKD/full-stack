import { useEffect, useRef } from 'react';

const revealSelector = [
  'section',
  '.elevated-screen',
  '.premium-card',
  '[data-scroll-reveal]',
  'form',
  'table',
].join(',');

export default function ScrollRevealScope({ children, className = '' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const scrollRoot = root.closest('main');
    const isAlreadyVisible = (el) => {
      const itemRect = el.getBoundingClientRect();
      const rootRect = scrollRoot?.getBoundingClientRect() || {
        top: 0,
        bottom: window.innerHeight,
      };
      return itemRect.top < rootRect.bottom - 24 && itemRect.bottom > rootRect.top + 24;
    };

    const revealItems = () => {
      const items = Array.from(root.querySelectorAll(revealSelector))
        .filter((el) => !el.closest('[data-no-scroll-reveal]') && !el.dataset.revealReady);

      items.forEach((el, index) => {
        el.dataset.revealReady = 'true';
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(index * 18, 140)}ms`);

        if (isAlreadyVisible(el)) {
          window.requestAnimationFrame(() => {
            el.classList.add('scroll-reveal-visible');
          });
          return;
        }

        observer.observe(el);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('scroll-reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, root: scrollRoot || null, rootMargin: '0px 0px -6% 0px' },
    );

    const mutationObserver = new MutationObserver(revealItems);
    revealItems();
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
