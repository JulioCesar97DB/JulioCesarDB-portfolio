import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollSpy(): void {
  const links = gsap.utils.toArray<HTMLAnchorElement>("[data-nav-link]");
  if (!links.length) return;

  const setActive = (id: string) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("nav-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  links.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) return;
    const section = document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) setActive(id);
      },
    });
  });
}
