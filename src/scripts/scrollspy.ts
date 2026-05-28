type Entry = { id: string; link: HTMLAnchorElement; section: HTMLElement };

export function initScrollSpy(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
  );
  if (!links.length) return;

  const entries: Entry[] = [];
  for (const link of links) {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (id && section) entries.push({ id, link, section });
  }
  if (!entries.length) return;

  const setActive = (activeId: string) => {
    for (const { id, link } of entries) {
      const isActive = id === activeId;
      link.classList.toggle("nav-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  const update = () => {
    const scrollY = window.scrollY;
    const atBottom =
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4;

    // At the very bottom the last section can never reach the activation line,
    // so pin it explicitly.
    if (atBottom) {
      setActive(entries[entries.length - 1].id);
      return;
    }

    // Otherwise the active section is the last one whose top has passed an
    // activation line ~35% down the viewport. This naturally activates the
    // first section at the top of the page.
    const line = scrollY + window.innerHeight * 0.35;
    let activeId = entries[0].id;
    for (const { id, section } of entries) {
      const top = section.getBoundingClientRect().top + scrollY;
      if (top <= line) activeId = id;
      else break;
    }
    setActive(activeId);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}
