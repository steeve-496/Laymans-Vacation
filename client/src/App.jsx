import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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

// Home Page Component
function HomePage() {
  const destinationsRef = useRef(null);
  const location = useLocation();

  // Manage Preloader State - only show once per session
  const [isLoading, setIsLoading] = useState(() => {
    // Check if preloader has already been shown this session
    return !sessionStorage.getItem('preloaderShown');
  });

  useEffect(() => {
    // If preloader was already shown, skip
    if (sessionStorage.getItem('preloaderShown')) {
      setIsLoading(false);
      return;
    }

    // Fallback if window load doesn't fire (e.g. single page nav or cached)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('preloaderShown', 'true');
    }, 4500); // Max wait time

    const handleLoad = () => {
      clearTimeout(timeout);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('preloaderShown', 'true');
      }, 500);
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

  // Handle hash navigation (e.g., /#destinations from state-explorer back button)
  useEffect(() => {
    if (!isLoading && location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        // Check if coming from state-explorer (instant scroll) or hero (smooth scroll)
        const isFromStateExplorer = location.search.includes('instant=true');

        setTimeout(() => {
          element.scrollIntoView({
            behavior: isFromStateExplorer ? 'instant' : 'smooth',
            block: 'start'
          });
        }, isFromStateExplorer ? 0 : 100);
      }
    }
  }, [isLoading, location.hash, location.search]);

  return (
    <>
      <Preloader isLoading={isLoading} />
      <Header />
      <Hero />
      <VideoSection appLoaded={!isLoading} />
      <Destinations ref={destinationsRef} />
      <WhyUs />
      <Testimonials />
      <WhoWeAre />
      <ContactUs />
      <Footer />
    </>
  );
}

// Packages Page Wrapper
function PackagesPage() {
  const navigate = useNavigate();
  const { country, location } = useParams();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Packages
      location={location || country}
      country={country}
      onBack={handleBack}
    />
  );
}

// Import useParams for PackagesPage
import { useParams } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore/:country" element={<StateExplorer />} />
        <Route path="/packages/:country/:location?" element={<PackagesPage />} />
      </Routes>
    </div>
  );
}

export default App;
