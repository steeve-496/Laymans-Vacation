import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Preloader from "./components/preloader/preloader";
import Header from "./components/header/header";
import Hero from "./components/hero/hero";
import VideoSection from "./components/video/video";
import Destinations from "./components/destinations/destinations";
import StateExplorer from "./components/state-explorer/state-explorer";
import Packages from "./components/packages/packages";
import WhyUs from "./components/why-us/why-us";
import Testimonials from "./components/testimonials/testimonials";
import Footer from "./components/footer/footer";
import ContactUs from "./components/contact-us/contact-us";
import WhoWeAre from "./components/who-we-are/who-we-are";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const [viewMode, setViewMode] = useState("home"); // home | explorer | packages
  const [selectedCountry, setSelectedCountry] = useState("Azerbaijan");
  const [selectedPackageLocation, setSelectedPackageLocation] = useState(null);

  const packagesRef = useRef(null);
  const stateExplorerRef = useRef(null);
  const destinationsRef = useRef(null);

  const explorerWrapperRef = useRef(null);

  // Manage Preloader State
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fallback if window load doesn't fire (e.g. single page nav or cached)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 4500); // Max wait time

    const handleLoad = () => {
      clearTimeout(timeout);
      // Small delay to ensure smooth transition
      setTimeout(() => setIsLoading(false), 500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  // Lock Body Scroll when in Explorer or Packages mode
  useEffect(() => {
    if (viewMode !== "home") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewMode]);

  /* ================= DESTINATION PIN CLICK ================= */
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setViewMode("explorer");
  };

  /* ================= EXPLORER PARALLAX TRANSITION ================= */
  useGSAP(() => {
    if (viewMode === "explorer" && destinationsRef.current && explorerWrapperRef.current) {
      // Enter Explorer Mode
      const tl = gsap.timeline();

      // 1. Destinations Recedes
      tl.to(destinationsRef.current, {
        scale: 0.95,
        y: 50,
        opacity: 0.5,
        filter: "blur(5px)",
        duration: 0.8,
        ease: "power3.inOut"
      }, 0);

      // 2. Explorer Slides Up
      tl.fromTo(explorerWrapperRef.current,
        { y: "100vh" },
        {
          y: "0%",
          duration: 1,
          ease: "power3.out"
        },
        0 // Start together (slightly delayed feeling due to easing)
      );

    } else if (viewMode === "home" && destinationsRef.current) {
      // Return to Home (Close Explorer)
      // If wrapper exists (it won't if conditional rendering unmounts it immediately), we animate out.
      // We need to delay unmounting if we want to animate out, but for now let's just reset Destinations.

      gsap.to(destinationsRef.current, {
        scale: 1,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out"
      });
    }
  }, [viewMode]);

  /* ================= EXPLORER → PACKAGES ================= */
  const handleExplore = (location) => {
    setSelectedPackageLocation(location);
    setViewMode("packages");

    gsap.fromTo(
      packagesRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.8, ease: "power3.out" }
    );
  };

  /* ================= PACKAGES → EXPLORER ================= */
  const handleBackToExplorer = () => {
    gsap.to(packagesRef.current, {
      x: "100%",
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => {
        setViewMode("explorer");
        setSelectedPackageLocation(null);
      }
    });
  };

  /* ================= EXPLORER → HOME ================= */
  const handleCloseExplorer = () => {
    if (explorerWrapperRef.current) {
      gsap.to(explorerWrapperRef.current, {
        y: "100vh",
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => setViewMode("home")
      });

      if (destinationsRef.current) {
        gsap.to(destinationsRef.current, {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
          delay: 0.1
        });
      }
    } else {
      setViewMode("home");
    }
  };

  return (
    <div className="app-container">
      <Preloader isLoading={isLoading} />
      <Header />
      <Hero />
      <VideoSection />

      <Destinations ref={destinationsRef} onCountrySelect={handleCountrySelect} />

      {/* ================= STATE EXPLORER ================= */}
      {viewMode === "explorer" && (
        <div
          ref={explorerWrapperRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "#f4f4f4", // Ensure bg covers
            height: "100vh",
            width: "100vw"
          }}
        >
          <StateExplorer
            ref={stateExplorerRef}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            onExplore={handleExplore}
            onClose={handleCloseExplorer} // Ensure StateExplorer has generic back/close if needed, or we add a button in the wrapper
          />

        </div>
      )}

      {/* ================= PACKAGES ================= */}
      <div
        ref={packagesRef}
        style={{
          position: "fixed",
          inset: 0,
          transform: "translateX(100%)",
          zIndex: 60
        }}
      >
        <Packages
          location={selectedPackageLocation || selectedCountry}
          onBack={handleBackToExplorer}
        />
      </div>

      <WhyUs />
      <Testimonials />
      <WhoWeAre />
      <ContactUs />
      <Footer />
    </div>
  );
}

export default App;
