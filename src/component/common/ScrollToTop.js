import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // This effect runs every time the pathname changes

  return null; // This component doesn't render any HTML
}

export default ScrollToTop;