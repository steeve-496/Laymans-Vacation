import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Header from "./components/header/header";
import Hero from "./components/hero/hero";
import VideoSection from "./components/video/video";
import Destinations from "./components/destinations/destinations";
import StateExplorer from "./components/state-explorer/state-explorer";
import Packages from "./components/packages/packages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./components/preloader/preloader";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [selectedCountry, setSelectedCountry] = useState("Azerbaijan");
  const [selectedPackageLocation, setSelectedPackageLocation] = useState(null);
  const [viewMode, setViewMode] = useState("explorer"); // 'explorer' | 'packages'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Small delay to ensure minimum view time or just to let things settle
      setTimeout(() => setIsLoading(false), 2000);
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback just in case
      const timeout = setTimeout(handleLoad, 5000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      }
    }
  }, []);

  // Control Body Overflow based on View Mode
  React.useEffect(() => {
    if (viewMode === "packages") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [viewMode]);

  const stateExplorerRef = useRef(null);
  const packagesRef = useRef(null);
  const containerRef = useRef(null);

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    // Scroll to State Explorer
    stateExplorerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize Packages Position
  useGSAP(() => {
    gsap.set(packagesRef.current, { x: "100%" });
  }, { scope: containerRef });

  const handleExplore = (locationName) => {
    setSelectedPackageLocation(locationName);
    setViewMode("packages");

    // Animate Transition
    const tl = gsap.timeline();

    // 1. Disable interaction on Explorer
    tl.set(stateExplorerRef.current, {
      pointerEvents: "none"
    });

    // 2. Slide in Packages
    tl.to(packagesRef.current, {
      x: "0%",
      duration: 0.8,
      ease: "power3.out"
    });
  };

  const handleBackToExplorer = () => {
    // Animate first, then update state if needed (though viewMode change might be redundant if we just hide it)
    const tl = gsap.timeline({
      onComplete: () => {
        setViewMode("explorer");
        setSelectedPackageLocation(null); // Optional: clear selection
      }
    });

    // 1. Slide out Packages
    tl.to(packagesRef.current, {
      x: "100%",
      duration: 0.6,
      ease: "power3.in"
    });

    // 2. Enable interaction on Explorer
    tl.set(stateExplorerRef.current, {
      pointerEvents: "auto"
    });
  };

  return (
    <div className="app-container" ref={containerRef}>
      <Header />
      <Hero />
      <VideoSection />
      <Destinations onCountrySelect={handleCountrySelect} />

      <div style={{ position: "relative", overflow: "hidden" }}>
        <StateExplorer
          ref={stateExplorerRef}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          onExplore={handleExplore}
        />

        {/* Packages is always rendered but hidden/off-screen initially */}
        <div
          ref={packagesRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
            background: "#000"
          }}
        >
          <Packages
            location={selectedPackageLocation || selectedCountry} // Fallback to avoid empty render
            onBack={handleBackToExplorer}
          />
        </div>
      </div>
      <Preloader isLoading={isLoading} />
    </div>
  );
}

export default App;
