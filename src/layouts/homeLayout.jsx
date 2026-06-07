import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../component";

export const HomeLayout = () => {
  const { pathname } = useLocation();
  const [navH, setNavH] = useState(0);
  const overlaysHero = pathname === "/";

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

  return (
    <>
      <Header />
      {!overlaysHero && <div style={{ height: navH }} />}

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
