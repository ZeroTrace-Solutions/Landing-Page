import { useEffect, useRef } from 'react';
import { animate, random } from 'animejs';

export const Starfield = () => {
  const containerRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const starCount = 200;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      const depth = Math.random();
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.dataset.depth = depth;
      container.appendChild(star);
      stars.push(star);
    }
    starsRef.current = stars;

    animate(stars, {
      opacity: [0.1, 0.7],
      duration: () => random(2000, 5000),
      delay: () => random(0, 3000),
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      starsRef.current.forEach(star => {
        const depth = parseFloat(star.dataset.depth);
        const yOffset = scrollY * depth * 0.2;
        star.style.transform = `translateY(${yOffset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      stars.forEach(star => star.remove());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div ref={containerRef} className="stars-container" />;
};


