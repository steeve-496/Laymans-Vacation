import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Preloader from "./components/preloader/preloader";
import Header from "./components/header/header";
import Hero from "./components/hero/hero";
import VideoSection from "./components/video/video";
import Destinations from "./components/destinations/destinations";

// Wait, I need to check if StateExplorer is used inside HomePage?
// The file says: <Route path="/explore/:country" element={<StateExplorer />} />
// It is NOT used in HomePage.
import WhyUs from "./components/why-us/why-us";
import Testimonials from "./components/testimonials/testimonials";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactUs from "./components/contact-us/contact-us";
import WhoWeAre from "./components/who-we-are/who-we-are";
import FAQ from "./components/faq/faq";
import api from "./utils/api";

// Lazy Load Pages & Admin
const Packages = lazy(() => import("./components/packages/packages"));
// State Explorer is a route, safe to lazy load?
// Existing import was: import StateExplorer from "./components/state-explorer/state-explorer";
// Let's lazy load it.
const StateExplorerLazy = lazy(() => import("./components/state-explorer/state-explorer"));

// Admin Components - Lazy Load
const AdminLogin = lazy(() => import("./components/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const DestinationManager = lazy(() => import("./components/admin/DestinationManager"));
const PackageManager = lazy(() => import("./components/admin/PackageManager"));
const StateExplorerManager = lazy(() => import("./components/admin/StateExplorerManager"));
const Settings = lazy(() => import("./components/admin/Settings"));
const TrashBinPage = lazy(() => import("./components/admin/TrashBinPage"));
const AuditLogPage = lazy(() => import("./components/admin/AuditLogPage"));
const BlogManager = lazy(() => import("./components/admin/BlogManager"));
const GalleryManager = lazy(() => import("./components/admin/GalleryManager"));
const GalleryPage = lazy(() => import("./components/gallery/GalleryPage"));
const BlogPage = lazy(() => import("./components/blog/BlogPage"));
const BlogPost = lazy(() => import("./components/blog/BlogPost"));

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParams } from "react-router-dom";
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// Home Page Component
function HomePage({ appLoaded, enableHeroAnimation }) {
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
      <Hero enableAnimation={enableHeroAnimation} />
      <VideoSection appLoaded={appLoaded} />
      <Destinations ref={destinationsRef} />
      <WhyUs />
      <Testimonials />
      <WhoWeAre />
      <ContactUs />
      <FAQ />
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
  const [preloaderFinished, setPreloaderFinished] = useState(false);

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
    // Prevent duplicate prefetch in dev logic (though StrictMode will still mount/unmount)
    if (window.hasPrefetched) return;

    // Global Data Prefetch (Cache Warming)
    const prefetchAllData = async () => {
      if (window.hasPrefetched) return;
      window.hasPrefetched = true;

      try {
        await Promise.all([
          api.getCached('/destinations'),
          api.getCached('/packages'),       // Usage without params = fetch all
          api.getCached('/state-explorer')  // Usage without params = fetch all
        ]);
        console.log("Global data pre-fetched and cached.");
      } catch (error) {
        console.warn("Global prefetch failed (will retry in components):", error);
      }
    };

    // Simple window load detection
    const handleLoad = () => {
      // Small buffer to ensure everything is settled
      setTimeout(() => {
        setIsLoading(false);
        // Start prefetching immediately after loading clears
        prefetchAllData();
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
      prefetchAllData();
    }, 4500);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Global Preloader - Shows on every refresh */}
      <Preloader isLoading={isLoading} onExitComplete={() => setPreloaderFinished(true)} />

      <Suspense fallback={<div style={{ height: '100vh', width: '100vw', background: '#000' }}></div>}>
        <Routes>
          <Route path="/" element={<HomePage appLoaded={preloaderFinished} enableHeroAnimation={preloaderFinished} />} />
          <Route path="/explore/:country" element={<StateExplorerLazy />} />
          <Route path="/packages/:country/:location?" element={<PackagesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />

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
            <Route path="blogs" element={<BlogManager />} />
            <Route path="gallery" element={<GalleryManager />} />
          </Route>
        </Routes>
      </Suspense>
      <ScrollToTop />
    </div>
  );
}

export default App;
