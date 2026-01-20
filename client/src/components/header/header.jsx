import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./header.css";
import { optimizeCloudinaryUrl } from "../../utils/imageOptimizer";

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarTL = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (id) => {
    setOpenMenu(false);

    if (id === "home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        // Use Lenis if available globally or native smooth scroll
        // Since Lenis is on window usually, or we can just scrollIntoView
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  // Check for mobile viewport
  useGSAP(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial entry animation
  useGSAP(() => {
    gsap.set(".header-nav", { y: -100, opacity: 0 });
    gsap.to(".header-nav", {
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
        gsap.to(".header-nav", {
          height: "70px",
          padding: "0 4.5%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker background for contrast
          backdropFilter: "blur(12px)", // Keep blur
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: "body",
            start: "100 top",
            end: "300 top",
            scrub: true,
          },
        });
      },

      "(max-width: 768px)": () => {
        gsap.set(".header-nav-list", { opacity: 0, pointerEvents: "none" });
        gsap.set(".header-hamburger-wrapper", { opacity: 1, pointerEvents: "all" });

        // Ensure nav is visible initially
        gsap.set(".header-nav", { y: 0, zIndex: "var(--z-sticky)" });

        // Mobile: Show/Hide based on scroll direction (Standard Smart Header)
        ScrollTrigger.create({
          trigger: "body",
          start: "100 top",
          onUpdate: (self) => {
            // Logic: Logo visible ONLY in Hero Section (approx top 100vh)
            // Hamburger always visible (handled by CSS sticky/fixed)

            if (window.scrollY > window.innerHeight - 100) {
              // Left Hero Section -> Hide Logo
              gsap.to(".header-logo", {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.3
              });
            } else {
              // In Hero Section -> Show Logo
              gsap.to(".header-logo", {
                opacity: 1,
                pointerEvents: "all",
                duration: 0.3
              });
            }
          }
        });
      }
    });
  });

  // GSAP timeline for Kinetic Menu
  useGSAP(() => {
    // Set initial state
    gsap.set(".header-kinetic-menu", {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      visibility: "hidden"
    });

    sidebarTL.current = gsap.timeline({ paused: true })
      .to(".header-kinetic-menu", {
        visibility: "visible",
        clipPath: "circle(150% at calc(100% - 40px) 40px)",
        duration: 0.8,
        ease: "power4.inOut",
      })
      .from(".header-link", {
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
      tl.to(".header-nav", {
        zIndex: "calc(var(--z-max) + 20)",
        backgroundColor: "transparent",
        backdropFilter: "none",
        duration: 0.3
      })
        .to(".header-logo", { opacity: 0, duration: 0.3 }, "<"); // Hide logo immediately
    } else {
      sidebarTL.current.reverse();
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";

      // Revert Nav Styles and Show Logo
      tl.to(".header-nav", {
        zIndex: "var(--z-sticky)",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        clearProps: "zIndex,backgroundColor,backdropFilter", // Allow CSS/ScrollTrigger to take back over
        duration: 0.3
      })
        .to(".header-logo", { opacity: 1, duration: 0.3, clearProps: "opacity" }, "<");
    }
  }, { dependencies: [openMenu] });

  return (
    <>
      <header className="header-nav">
        <div className="header-logo">
          <img
            src={isMobile
              ? "https://ik.imagekit.io/tsxbvz4jb6/Laymans/logo-m.png"
              : "https://ik.imagekit.io/tsxbvz4jb6/Laymans/TheLayman'sVacation.png"
            }
            alt="logo"
          />
        </div>

        <ul className="header-nav-list">
          <li>Upcoming Departures</li>
          <li><a href="#wu-section">Why Us</a></li>
          <li><a href="#who-we-are">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul >

        {/* Hamburger Icon with Animation */}
        < div className="header-hamburger-wrapper" onClick={() => setOpenMenu(!openMenu)
        }>
          <div className={`header-hamburger-icon ${openMenu ? "header-open" : ""}`}>
            <span></span>
            <span></span>
          </div>
        </div >
      </header >

      {/* Kinetic Fullscreen Menu */}
      < div className="header-kinetic-menu" >
        <div className="header-menu-content">
          <ul className="header-links">
            <li className="header-link" onClick={() => handleNavClick("home")}>
              <span className="header-link-number">01</span>
              <span>Home</span>
            </li>
            <li className="header-link" onClick={() => handleNavClick("destinations")}>
              <span className="header-link-number">02</span>
              <span>Destinations</span>
            </li>
            <li className="header-link" onClick={() => handleNavClick("destinations")}> {/* Packages -> Destinations for now */}
              <span className="header-link-number">03</span>
              <span>Packages</span>
            </li>
            <li className="header-link" onClick={() => handleNavClick("why-us")}>
              <span className="header-link-number">04</span>
              <span>Why Us</span>
            </li>
            <li className="header-link" onClick={() => handleNavClick("contact")}>
              <span className="header-link-number">05</span>
              <span>Contact</span>
            </li>
          </ul>
          <div className="header-footer header-link">
            <p>The Layman's Vacation</p>
            <div className="header-socials">
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
