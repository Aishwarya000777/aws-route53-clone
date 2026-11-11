
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronRight,
  Info,
  Workflow,
  SquareTerminal,
  Sun,
  Moon,
} from "lucide-react";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/hosted-zones": "Hosted zones",
  "/health-checks": "Health checks",
  "/profiles": "Profiles",
  "/traffic-policies": "Traffic policies",
  "/resolver": "Resolver",
};

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const currentPage =
    pageNames[pathname] ||
    (pathname.startsWith("/hosted-zones/")
      ? "Hosted zone details"
      : "Route 53");

  useEffect(() => {
    const savedTheme = localStorage.getItem("route53-theme");
    const theme = savedTheme || "dark";

    setDarkMode(theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    setThemeLoaded(true);
  }, []);

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";

    setDarkMode(nextTheme === "dark");
    localStorage.setItem("route53-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  return (
    <header className="aws-header">
      <div className="breadcrumb-left">
        <button
          className="aws-console-menu"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          type="button"
        >
          <Menu size={23} />
        </button>

        <a href="/" className="breadcrumb-service">
          Route 53
        </a>

        <ChevronRight size={19} className="breadcrumb-chevron" />

        <span className="breadcrumb-current">{currentPage}</span>
      </div>

      <div className="breadcrumb-actions">
        <button
          type="button"
          onClick={toggleTheme}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
          disabled={!themeLoaded}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button type="button" title="Information" aria-label="Information">
          <Info size={19} />
        </button>

        <button type="button" title="Route 53 tools" aria-label="Route 53 tools">
          <Workflow size={20} />
        </button>

        <button type="button" title="Console tools" aria-label="Console tools">
          <SquareTerminal size={20} />
        </button>
      </div>
    </header>
  );
}

