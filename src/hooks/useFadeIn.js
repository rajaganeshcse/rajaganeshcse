import { useEffect, useRef } from 'react';

export default function useFadeIn() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => { if (el) observer.unobserve(el); };
  }, []);

  return ref;
}
