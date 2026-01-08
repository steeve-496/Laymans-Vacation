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

// Admin Components
import AdminLogin from "./components/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import DestinationManager from "./components/admin/DestinationManager";
import PackageManager from "./components/admin/PackageManager";
import StateExplorerManager from "./components/admin/StateExplorerManager";
import Settings from "./components/admin/Settings";
import TrashBinPage from "./components/admin/TrashBinPage";
import AuditLogPage from "./components/admin/AuditLogPage";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParams } from "react-router-dom";
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// Home Page Component
function HomePage({ appLoaded }) {
  const destinationsRef = useRef(null);
  const location = useLocation();

  // Scroll to hash when app is loaded
  useEffect(() => {
    if (appLoaded && location.hash) {
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
  }, [appLoaded, location.hash, location.search]);

  return (
    <>
      <Header />
      <Hero />
      <VideoSection appLoaded={appLoaded} />
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



function App() {
  // Global Preloader State
  const [isLoading, setIsLoading] = useState(true);

  // --- SMOOTH SCROLL (LENIS) INTEGRATION ---
  useEffect(() => {
    // 1. Initialize Lenis (Enabled for Mobile & Desktop as requested)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: true, // Requested by user: Enable smooth touch scroll
      touchMultiplier: 2,
      infinite: false,
    });

    // 2. Sync Lenis with GSAP ScrollTrigger
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

    // 3. Mobile Configuration
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      ScrollTrigger.config({
        normalizeScroll: false, // Keep disabled to prevent native conflict
        ignoreMobileResize: true // Critical for keyboard stability
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  useEffect(() => {
    // Simple window load detection
    const handleLoad = () => {
      // Small buffer to ensure everything is settled
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Safety fallback
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Global Preloader - Shows on every refresh */}
      <Preloader isLoading={isLoading} />

      <Routes>
        <Route path="/" element={<HomePage appLoaded={!isLoading} />} />
        <Route path="/explore/:country" element={<StateExplorer />} />
        <Route path="/packages/:country/:location?" element={<PackagesPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="destinations" element={<DestinationManager />} />
          <Route path="packages" element={<PackageManager />} />
          <Route path="state-explorer" element={<StateExplorerManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="trash" element={<TrashBinPage />} />
          <Route path="activity-logs" element={<AuditLogPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
