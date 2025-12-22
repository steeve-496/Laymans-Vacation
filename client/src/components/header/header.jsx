import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./header.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";

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

  // Refresh ScrollTrigger after a slight delay to ensure layout is settled (post-preloader)
  useGSAP(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Shrink navbar on scroll (desktop only)
  useGSAP(() => {
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        gsap.to(".nav", {
          height: "60px",
          padding: "0 4.5%",
          zIndex: "0",
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
      },

      "(max-width: 768px)": () => {
        gsap.set(".nav_list", { opacity: 0, pointerEvents: "none" });
        gsap.set(".hamburger", { opacity: 1, pointerEvents: "all" });

        // Ensure nav is visible initially
        gsap.set(".nav", { y: 0 });

        // Mobile: Show/Hide based on scroll
        ScrollTrigger.create({
          trigger: "body",
          start: "100 top", // Start after scrolling 100px
          onEnter: () => gsap.to(".nav", { y: "-100%", duration: 0.3, ease: "power2.inOut", zIndex: "0" }), // Hide
          onLeaveBack: () => gsap.to(".nav", { y: 0, duration: 0.3, ease: "power2.inOut", zIndex: "var(--z-sticky)" }), // Show
        });
      }
    });
  });

  // GSAP timeline for Kinetic Menu
  useGSAP(() => {
    // Set initial state
    gsap.set(".kinetic-menu", {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      visibility: "hidden"
    });

    sidebarTL.current = gsap.timeline({ paused: true })
      .to(".kinetic-menu", {
        visibility: "visible",
        clipPath: "circle(150% at calc(100% - 40px) 40px)",
        duration: 0.8,
        ease: "power4.inOut",
      })
      .from(".kinetic-link", {
        y: 100,
        opacity: 0,
        skewY: 10,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4");
  });

  // Play/Reverse menu animation when openMenu changes
  useGSAP(() => {
    const tl = gsap.timeline();
    if (openMenu) {
      sidebarTL.current.play();
      document.body.style.overflowY = "hidden";
      document.body.style.overflowX = "hidden";

      // Bring Nav above Menu and make it transparent, Hide Logo
      tl.to(".nav", {
        zIndex: "calc(var(--z-max) + 20)",
        backgroundColor: "transparent",
        backdropFilter: "none",
        duration: 0.3
      })
        .to(".logo", { opacity: 0, duration: 0.3 }, "<"); // Hide logo immediately
    } else {
      sidebarTL.current.reverse();
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";

      // Revert Nav Styles and Show Logo
      tl.to(".nav", {
        zIndex: "var(--z-sticky)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        clearProps: "zIndex,backgroundColor,backdropFilter", // Allow CSS/ScrollTrigger to take back over
        duration: 0.3
      })
        .to(".logo", { opacity: 1, duration: 0.3, clearProps: "opacity" }, "<");
    }
  }, { dependencies: [openMenu] });

  return (
    <>
      <header className="nav">
        <div className="logo">
          <img src="https://res.cloudinary.com/divwmzd8g/image/upload/v1765447705/TheLayman_sVacation_exnxoq.png" alt="logo" />
        </div>

        <ul className="nav_list">
          <li>Home</li>
          <li>Upcoming Departures</li>
          <li>Why Us</li>
          <li><a href="#who-we-are">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul >

        {/* Hamburger Icon with Animation */}
        < div className="hamburger-wrapper" onClick={() => setOpenMenu(!openMenu)
        }>
          <div className={`hamburger-icon ${openMenu ? "open" : ""}`}>
            <span></span>
            <span></span>
          </div>
        </div >
      </header >

      {/* Kinetic Fullscreen Menu */}
      < div className="kinetic-menu" >
        <div className="kinetic-menu-content">
          <ul className="kinetic-links">
            <li className="kinetic-link" onClick={() => setOpenMenu(false)}>
              <span className="link-number">01</span>
              <Link to="/">Home</Link>
            </li>
            <li className="kinetic-link" onClick={() => setOpenMenu(false)}>
              <span className="link-number">02</span>
              <Link to="/destinations">Destinations</Link>
            </li>
            <li className="kinetic-link" onClick={() => setOpenMenu(false)}>
              <span className="link-number">03</span>
              <Link to="/packages">Packages</Link>
            </li>
            <li className="kinetic-link" onClick={() => setOpenMenu(false)}>
              <span className="link-number">04</span>
              <Link to="/why-us">Why Us</Link>
            </li>
            <li className="kinetic-link" onClick={() => setOpenMenu(false)}>
              <span className="link-number">05</span>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
          <div className="kinetic-footer kinetic-link">
            <p>The Layman's Vacation</p>
            <div className="socials">
              <span>IG</span>
              <span>FB</span>
              <span>TW</span>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default Header;
