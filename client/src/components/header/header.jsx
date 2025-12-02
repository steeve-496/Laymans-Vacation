import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./header.css";

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const sidebarTL = useRef(null);

  // Initial entry animation
  useGSAP(() => {
    gsap.set(".nav", { y: -100, opacity: 0 });
    gsap.to(".nav", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    });
  }, []);

  // Shrink navbar on scroll (desktop only)
  useGSAP(() => {
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        gsap.to(".nav", {
          height: "60px",
          padding: "0 4.5%",
          backgroundColor: "transparent", // Fade out background
          backdropFilter: "blur(0px)", // Remove blur
          ease: "power2.out",
          scrollTrigger: {
            trigger: "body",
            start: "100 top",
            end: "300 top",
            scrub: true,
          },
        });

        gsap.to(".logo", {
          opacity: 0,
          pointerEvents: "none",
          scrollTrigger: {
            trigger: "body",
            start: "100 top",
            end: "300 top",
            scrub: true,
          },
        });

        gsap.to(".nav_list", {
          opacity: 0,
          pointerEvents: "none",
          scrollTrigger: {
            trigger: "body",
            start: "100 top",
            end: "300 top",
            scrub: true,
          },
        });

        gsap.to(".hamburger", {
          opacity: 1,
          pointerEvents: "all",
          scrollTrigger: {
            trigger: "body",
            start: "100 top",
            end: "300 top",
            scrub: true,
          },
        });
      },

      "(max-width: 768px)": () => {
        gsap.set(".nav_list", { opacity: 0, pointerEvents: "none" });
        gsap.set(".hamburger", { opacity: 1, pointerEvents: "all" });
      }
    });
  });

  // GSAP timeline for sidebar open/close
  useGSAP(() => {
    sidebarTL.current = gsap.timeline({ paused: true })
      .to(".sidebar", {
        x: 0,
        duration: 0.55,
        ease: "power3.out",
      })
      .to(".sidebar_overlay", {
        opacity: 1,
        pointerEvents: "all",
        duration: 0.3,
      }, "-=0.3");
  });

  // Play/Reverse sidebar animation when openMenu changes
  useGSAP(() => {
    if (openMenu) {
      sidebarTL.current.play();
      document.body.style.overflow = "hidden";  // disable scroll behind
    } else {
      sidebarTL.current.reverse();
      document.body.style.overflow = "auto";    // enable scroll back
    }
  }, { dependencies: [openMenu] });

  return (
    <>
      <header className="nav">
        <div className="logo">
          <img src="TheLayman'sVacation.png" alt="logo" />
        </div>

        <ul className="nav_list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/destinations">Destinations</Link></li>
          <li><Link to="/why-us">Why Us</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="hamburger" onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? "✖" : "☰"}
        </div>
      </header>

      {/* Overlay outside sidebar */}
      <div className="sidebar_overlay" onClick={() => setOpenMenu(false)}></div>

      {/* Sidebar drawer */}
      <aside
        className="sidebar"
        onTouchStart={(e) => (window.swipeStart = e.touches[0].clientX)}
        onTouchMove={(e) => {
          const currentX = e.touches[0].clientX;
          if (window.swipeStart - currentX > 60) setOpenMenu(false);
        }}
      >
        <div className="sidebar_logo">
          <img src="TheLayman'sVacation.png" alt="logo" />
        </div>

        <ul className="sidebar_links">
          <li onClick={() => setOpenMenu(false)}><Link to="/">Home</Link></li>
          <li onClick={() => setOpenMenu(false)}><Link to="/destinations">Destinations</Link></li>
          <li onClick={() => setOpenMenu(false)}><Link to="/why-us">Why Us</Link></li>
          <li onClick={() => setOpenMenu(false)}><Link to="/about">About Us</Link></li>
          <li onClick={() => setOpenMenu(false)}><Link to="/contact">Contact</Link></li>
        </ul>
      </aside>
    </>
  );
}

export default Header;
