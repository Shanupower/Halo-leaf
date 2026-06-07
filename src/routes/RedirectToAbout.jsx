import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "./paths";

export function RedirectToAbout() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(PATHS.home, { replace: true });
    requestAnimationFrame(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    });
  }, [navigate]);

  return null;
}
