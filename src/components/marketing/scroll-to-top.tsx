"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 720);
    }

    function checkOverlays() {
      setIsOverlayOpen(
        Boolean(document.querySelector('[data-photo-viewer], [role="dialog"][aria-modal="true"]')),
      );
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new MutationObserver(checkOverlays);
    observer.observe(document.body, { childList: true, subtree: true });
    checkOverlays();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center border border-primary-light bg-[#101418] text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-300 hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
        isVisible && !isOverlayOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-label="Scroll to top"
      data-scroll-to-top
    >
      <ArrowUp className="size-5 stroke-[2.4]" aria-hidden="true" />
    </button>
  );
}
