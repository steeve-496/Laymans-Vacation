import { useRef, useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { getOptimizedUrl } from "../../utils/imageOptimizer";
import "./hero.css";

const FALLBACK_DESTINATIONS = [
  {
    id: 0,
    tag: "Kerala, South India",
    titleLine1: "God's Own",
    titleLine2: "Country",
    desc: "Drift through emerald backwaters on a traditional kettuvallam, where time slows to the rhythm of swaying palms and mist-touched lagoons.",
    season: "Oct – Mar",
    experience: "Houseboat Stay",
    style: "Tranquil Luxury",
    image: "/assets/kerala-backwaters.webp",
    imageFallback: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80",
    btnLabel: "Explore Kerala",
  },
  {
    id: 1,
    tag: "Himachal Pradesh",
    titleLine1: "Where Peaks",
    titleLine2: "Touch Heaven",
    desc: "Snow-capped passes, ancient monasteries perched on cliffs, and pine-scented valleys — Himachal beckons the soul-seeking adventurer.",
    season: "Apr – Jun / Sep – Nov",
    experience: "Mountain Trek",
    style: "High Adventure",
    image: "/assets/himachal.webp",
    imageFallback: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    btnLabel: "Explore Himachal",
  },
];

const SLIDE_DURATION = 6000;

function Hero({ onExploreClick }) {
  const [slides, setSlides] = useState(FALLBACK_DESTINATIONS);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [textVisible, setTextVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef(null);
  const heroRef = useRef(null);

  // Fetch real destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get('/destinations');
        const data = response.data;

        if (data && data.length > 0) {
          // Transform API data to Hero format
          const realSlides = data.slice(0, 6).map((d, index) => ({
            id: d._id || index,
            tag: d.isInternational ? `${d.name} • International` : `${d.name} • India`,
            titleLine1: d.name,
            titleLine2: d.badge || "Unforgettable Journey",
            desc: d.description || "Discover the beauty and soul of this incredible destination with Layman's Vacation.",
            season: d.season || "Best Oct-Mar",
            experience: d.experience || "Immersive Tour",
            style: d.style || "Premium Travel",
            image: getOptimizedUrl(d.image, 1920),
            imageFallback: d.image,
            btnLabel: `Explore ${d.name}`,
          }));
          setSlides(realSlides);
        }
      } catch (error) {
        console.error("Hero: Failed to fetch real destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const goTo = useCallback(
    (idx) => {
      if (isTransitioning || idx === current) return;

      setIsTransitioning(true);
      setTextVisible(false);

      setTimeout(() => {
        setPrev(current);
        setCurrent(idx);
        setProgressKey((k) => k + 1);

        setTimeout(() => {
          setTextVisible(true);
          setPrev(null);
          setIsTransitioning(false);
        }, 100);
      }, 400);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [next, progressKey, slides.length]);

  const dest = slides[current] || FALLBACK_DESTINATIONS[0];
  const prevDest = prev !== null ? slides[prev] : null;

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const section = document.getElementById("destinations");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section" ref={heroRef} id="hero" aria-label="Featured destinations">

      {/* Background slides */}
      {slides.map((d, i) => (
        <div
          key={d.id}
          className={`hero-slide ${i === current ? "hero-slide--active" : ""} ${prev === i ? "hero-slide--exiting" : ""
            }`}
          aria-hidden={i !== current}
        >
          <div
            className="hero-slide__bg"
            style={{
              backgroundImage: `url(${d.image}), url(${d.imageFallback})`,
            }}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="hero-overlay hero-overlay--gradient" />
      <div className="hero-overlay hero-overlay--bottom" />
      <div className="hero-overlay hero-overlay--vignette" />

      {/* Main content */}
      <div className={`hero-content ${textVisible ? "hero-content--visible" : ""}`}>
        <div className="hero-tag">
          <span className="hero-tag__line" />
          <span className="hero-tag__text">{dest.tag}</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title__line1">{dest.titleLine1}</span>
          <em className="hero-title__line2">{dest.titleLine2}</em>
        </h1>

        <p className="hero-desc">{dest.desc}</p>

        <div className="hero-actions">
          <button className="hero-btn hero-btn--primary" onClick={handleExplore}>
            {dest.btnLabel}
            <span className="hero-btn__arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <button
            className="hero-btn hero-btn--secondary"
            onClick={() => {
              const section = document.getElementById("destinations");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View all destinations
          </button>
        </div>
      </div>

      {/* Side info pills */}
      <div className={`hero-info ${textVisible ? "hero-info--visible" : ""}`}>
        {[
          { label: "Season", value: dest.season },
          { label: "Experience", value: dest.experience },
          { label: "Style", value: dest.style },
        ].map((item, i) => (
          <div className="hero-info__pill" key={item.label} style={{ transitionDelay: `${0.9 + i * 0.12}s` }}>
            <span className="hero-info__label">{item.label}</span>
            <span className="hero-info__value">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Bottom nav bar */}
      <div className="hero-nav">
        {/* Dot indicators */}
        <div className="hero-dots" role="tablist" aria-label="Destination slides">
          {slides.map((d, i) => (
            <button
              key={d.id}
              className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to ${d.tag}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="hero-counter" aria-live="polite" aria-atomic="true">
          <span className="hero-counter__current">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="hero-counter__sep" />
          <span className="hero-counter__total">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="hero-progress" aria-hidden="true">
        <div
          key={progressKey}
          className="hero-progress__bar"
          style={{ animationDuration: `${SLIDE_DURATION}ms` }}
        />
      </div>

      {/* Arrow navigation */}
      <button
        className="hero-arrow hero-arrow--prev"
        onClick={goPrev}
        aria-label="Previous destination"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        className="hero-arrow hero-arrow--next"
        onClick={next}
        aria-label="Next destination"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Scroll cue */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue__line" />
        <span className="hero-scroll-cue__label">Scroll</span>
      </div>
    </section>
  );
}

export default Hero;