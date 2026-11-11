/** Top bar: hairline + blur once the page scrolls; wordmark once the hero name leaves. */
function initTopBar(): void {
  const bar = document.querySelector<HTMLElement>("[data-topbar]");
  if (!bar) return;

  const onScroll = () => bar.toggleAttribute("data-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const name = document.querySelector("[data-hero-name]");
  if (!name) {
    bar.setAttribute("data-named", "");
    return;
  }
  new IntersectionObserver(
    ([entry]) => bar.toggleAttribute("data-named", !entry.isIntersecting),
    { rootMargin: "-64px 0px 0px 0px" },
  ).observe(name);
}

/** Marks the nav link of the section under the top third of the viewport. */
function initScrollSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"));
  const pairs = links
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter((p): p is { link: HTMLAnchorElement; section: HTMLElement } => !!p.section);
  if (!pairs.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.33;
    let active: HTMLAnchorElement | null = null;
    for (const { link, section } of pairs) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) active = link;
    }
    for (const { link } of pairs) {
      if (link === active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/** Product frames: the border highlight follows the pointer. */
function initFrames(): void {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  for (const host of document.querySelectorAll<HTMLElement>("[data-frame]")) {
    const frame = host.querySelector<HTMLElement>(".frame");
    if (!frame) continue;
    host.addEventListener(
      "pointermove",
      (e) => {
        const r = frame.getBoundingClientRect();
        frame.style.setProperty("--mx", `${e.clientX - r.left}px`);
        frame.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  }
}

/** Copy-email buttons swap to a check and announce the result. */
function initCopyEmail(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy-email]")) {
    const root = button.closest("[data-copy-root]");
    const status = root?.querySelector<HTMLElement>("[data-copy-status]");
    const idle = button.querySelector(".copy-idle");
    const done = button.querySelector(".copy-done");
    let timer: number | undefined;

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail ?? "";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        if (status) status.textContent = `Couldn't copy. The address is ${email}.`;
        return;
      }
      idle?.classList.add("hidden");
      done?.classList.remove("hidden");
      button.setAttribute("aria-label", "Email address copied");
      if (status) status.textContent = "Email address copied to clipboard.";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        idle?.classList.remove("hidden");
        done?.classList.add("hidden");
        button.setAttribute("aria-label", "Copy email address");
        if (status) status.textContent = "";
      }, 2000);
    });
  }
}

export function initInteractions(): void {
  initTopBar();
  initScrollSpy();
  initFrames();
  initCopyEmail();
}
