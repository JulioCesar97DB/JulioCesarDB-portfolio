type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage blocked: fall back to the OS */
  }
  return "system";
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;

  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* the choice still applies for this visit */
  }

  for (const option of document.querySelectorAll<HTMLElement>("[data-theme-option]")) {
    option.setAttribute("aria-checked", String(option.dataset.themeOption === theme));
  }
  for (const icon of document.querySelectorAll<HTMLElement>("[data-theme-icon]")) {
    icon.classList.toggle("hidden", icon.dataset.themeIcon !== theme);
  }
  // Browser chrome (mobile address bar) follows the resolved scheme.
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.media = "";
    meta.content = dark ? "#0e0e11" : "#fcfcfd";
  }
}

export function initTheme(): void {
  applyTheme(readTheme());

  // Without the Popover API the menu cannot open; hide its trigger and let
  // the theme follow the system (or a choice saved on another browser).
  if (!("popover" in HTMLElement.prototype)) {
    document.querySelector<HTMLElement>(".theme-menu")?.setAttribute("hidden", "");
    return;
  }

  const popover = document.getElementById("theme-popover");
  for (const option of document.querySelectorAll<HTMLElement>("[data-theme-option]")) {
    option.addEventListener("click", () => {
      applyTheme(option.dataset.themeOption as Theme);
      popover?.hidePopover?.();
    });
  }

  // Arrow keys move between the three options while the menu is open.
  popover?.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(popover.querySelectorAll<HTMLElement>("[data-theme-option]"));
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length];
    next?.focus();
    e.preventDefault();
  });
  popover?.addEventListener("toggle", (e) => {
    if ((e as ToggleEvent).newState === "open") {
      popover.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    }
  });

  // In "system" mode, keep the browser chrome colour in sync with OS changes.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (readTheme() === "system") applyTheme("system");
  });
}
