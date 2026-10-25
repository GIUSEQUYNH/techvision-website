const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mobileNavigation = window.matchMedia("(max-width: 790px)");

if (
  menuToggle instanceof HTMLButtonElement &&
  navigation instanceof HTMLElement
) {
  document.documentElement.classList.add("js-enabled");
  menuToggle.hidden = false;

  const syncNavigation = () => {
    const isMobile = mobileNavigation.matches;
    navigation.dataset.collapsed = String(isMobile);
    menuToggle.setAttribute("aria-expanded", String(!isMobile));
    menuToggle.setAttribute(
      "aria-label",
      isMobile ? "Mở menu điều hướng" : "Menu điều hướng luôn hiển thị",
    );
  };

  const closeMenu = (restoreFocus = false) => {
    if (!mobileNavigation.matches) return;

    navigation.dataset.collapsed = "true";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Mở menu điều hướng");

    if (restoreFocus) menuToggle.focus();
  };

  syncNavigation();

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (mobileNavigation.matches) {
      navigation.dataset.collapsed = String(isExpanded);
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Mở menu điều hướng" : "Đóng menu điều hướng",
      );
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      mobileNavigation.matches &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu(true);
    }
  });

  mobileNavigation.addEventListener("change", syncNavigation);
}

const copyrightYear = document.querySelector("#copyright-year");

if (copyrightYear) {
  copyrightYear.textContent = String(new Date().getFullYear());
}
