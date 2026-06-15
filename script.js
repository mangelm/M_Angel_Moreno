// script.js
// Funcionalidad principal del portfolio:
// - Scroll suave personalizado
// - Menú responsive (hamburguesa)
// - Animaciones sutiles al hacer scroll
// - Actualización dinámica del año en el footer

document.addEventListener("DOMContentLoaded", () => {
    setupSmoothScroll();
    setupMobileNav();
    setupScrollReveal();
    setCurrentYear();
  });
  
  /**
   * Scroll suave para enlaces internos del menú y botones principales.
   */
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
  
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
  
        // Ignorar enlaces vacíos o solo "#"
        if (!targetId || targetId === "#") return;
  
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
  
        event.preventDefault();
  
        // Calcula el offset teniendo en cuenta la altura del header fijo
        const header = document.querySelector(".header");
        const headerHeight = header ? header.offsetHeight : 0;
  
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const scrollTo = targetPosition - headerHeight - 12; // pequeño margen
  
        window.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
  
        // Cierra el menú móvil si está abierto
        closeMobileNav();
      });
    });
  }
  
  /**
   * Menú responsive tipo hamburguesa para dispositivos móviles.
   */
  function setupMobileNav() {
    const toggle = document.querySelector(".nav__toggle");
    const navList = document.querySelector(".nav__list");
  
    if (!toggle || !navList) return;
  
    toggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("nav__list--open");
      toggle.classList.toggle("nav__toggle--open", isOpen);
    });
  
    // Cerrar el menú al hacer clic en un enlace de navegación
    navList.addEventListener("click", (event) => {
      if (event.target.classList.contains("nav__link")) {
        closeMobileNav();
      }
    });
  
    // Cerrar el menú si se redimensiona a escritorio
    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) {
        closeMobileNav();
      }
    });
  }
  
  /**
   * Cierra el menú móvil, si está abierto.
   */
  function closeMobileNav() {
    const toggle = document.querySelector(".nav__toggle");
    const navList = document.querySelector(".nav__list");
  
    if (!toggle || !navList) return;
  
    navList.classList.remove("nav__list--open");
    toggle.classList.remove("nav__toggle--open");
  }
  
  /**
   * Animaciones sutiles al hacer scroll usando IntersectionObserver.
   * Añade la clase `.is-visible` a secciones y cards cuando entran en viewport.
   */
  function setupScrollReveal() {
    const elements = document.querySelectorAll(
      ".hero__content, .section, .project-card, .about__skills"
    );
  
    if (!("IntersectionObserver" in window)) {
      // Fallback: mostrar todo si el navegador no soporta IntersectionObserver
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
  
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // solo animar una vez
          }
        });
      },
      {
        threshold: 0.18,
      }
    );
  
    elements.forEach((el) => observer.observe(el));
  
    // Resaltar enlace activo en navegación según sección visible
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav__link[href^='#']");
  
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          if (!id) return;
  
          const correspondingLink = document.querySelector(
            `.nav__link[href="#${id}"]`
          );
  
          if (!correspondingLink) return;
  
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            navLinks.forEach((link) =>
              link.classList.remove("nav__link--active")
            );
            correspondingLink.classList.add("nav__link--active");
          }
        });
      },
      {
        threshold: 0.3,
      }
    );
  
    sections.forEach((section) => sectionObserver.observe(section));
  }
  
  /**
   * Actualiza el año actual en el footer.
   */
  function setCurrentYear() {
    const yearSpan = document.getElementById("year");
    if (!yearSpan) return;
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
  }