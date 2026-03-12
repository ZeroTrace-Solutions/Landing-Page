import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const translateProp = direction === 'up' || direction === 'down' ? 'translateY' : 'translateX';
            const translateValues = direction === 'up' || direction === 'left' ? [40, 0] : [-40, 0];

            animate(entry.target, {
              [translateProp]: translateValues,
              opacity: [0, 1],
              scale: [0.95, 1],
              duration: 1200,
              delay: delay,
              easing: 'easeOutExpo'
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, direction]);

  return (
    <div ref={elementRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

