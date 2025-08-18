import React, { useLayoutEffect, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../component";

export const HomeLayout = () => {
  const { pathname } = useLocation();
  const [navH, setNavH] = useState(0);
  const [hasHeroTop, setHasHeroTop] = useState(false);

  // Measure the REAL header (the element with data-app-header)
  useLayoutEffect(() => {
    const el = document.querySelector("[data-app-header]");
    if (!el) return;

    const setH = () => setNavH(el.offsetHeight || 0);
    setH();

    const ro = new ResizeObserver(setH);
    ro.observe(el);

    window.addEventListener("resize", setH);
    return () => {
      window.removeEventListener("resize", setH);
      ro.disconnect();
    };
  }, []);

  // Detect if a hero is at the very top (then we keep header overlay look)
  useEffect(() => {
    const hero = document.querySelector(".hero-top");
    if (!hero) {
      setHasHeroTop(false);
      return;
    }
    const rect = hero.getBoundingClientRect();
    // near the top and we haven't scrolled much
    setHasHeroTop(rect.top < 10 && window.scrollY < 10);
  }, [pathname]);

  return (
    <>
      <Header />
      {/* SIBLING spacer (not a wrapper) so sticky is preserved.
          Only add spacing when there's NO top hero. */}
      {!hasHeroTop && <div style={{ height: navH }} />}

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
