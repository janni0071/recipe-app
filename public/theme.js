// Theme handling – dark mode default
(function () {
  const storageKey = "theme-preference";
  const getPreferredTheme = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
    // Default to dark mode
    return "dark";
  };
  const setTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(storageKey, theme);
  };
  const theme = getPreferredTheme();
  setTheme(theme);

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", () => {
        const current = document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
        const next = current === "dark" ? "light" : "dark";
        setTheme(next);
      });
    }
  });
})();
