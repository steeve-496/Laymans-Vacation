import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);


const LazyVideo = ({ src, eager = false, appLoaded, ...props }) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(eager);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (eager || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Reduced margin for strict loading
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!isInView) return;
    setIsVisible(true);
  }, [isInView]);

  return (
    <div ref={videoRef} className="video-placeholder" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>
      {isVisible && (
        <video
          src={src}
          {...props}
          preload={eager ? "auto" : "metadata"} // Optimize bandwidth
          onLoadedData={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 1, // Always show, reliance on muted autoplay for playback
          }}
        />
      )}
    </div>
  );
};

export default function Video({ appLoaded }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const mainCardRef = useRef(null);

  const videos = [
    "https://ia600603.us.archive.org/11/items/kerala_202602/Azerbaijan.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Bali.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Bhutan.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/dubai.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Kazaksthan.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/malaysia.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Singapore.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Kerala.mp4", //Kerala
    "https://ia600603.us.archive.org/11/items/kerala_202602/srilanka.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/Thailand.mp4",
    "https://ia600603.us.archive.org/11/items/kerala_202602/veitnam.mp4",
  ];

  const col1 = videos.filter((_, i) => i % 3 === 0);
  const col2 = videos.filter((_, i) => i % 3 === 1);
  const col3 = videos.filter((_, i) => i % 3 === 2);

  const columns = [col1, col2, col3];
  const colRefs = [col1Ref, col2Ref, col3Ref];

  /* ================== DYNAMIC TEXT LOGIC ================== */
  const phrases = [
    "Explore The Unseen",
    "Live The Journey",
    "Capture The Moment"
  ];

  const [activePhrase, setActivePhrase] = useState(0);

  useGSAP(
    () => {
      // Helper to update phrase
      const updatePhrase = (self) => {
        const progress = self.progress;
        const index = Math.floor(progress * phrases.length);
        const validIndex = Math.min(index, phrases.length - 1);
        setActivePhrase(validIndex);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          onUpdate: updatePhrase
        },
      });

      // Mobile Text Fade In/Out
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        onEnter: () => gsap.to(".video-scroll-text h2", { opacity: 1, duration: 0.5 }),
        onLeave: () => gsap.to(".video-scroll-text h2", { opacity: 0, duration: 0.5 }),
        onEnterBack: () => gsap.to(".video-scroll-text h2", { opacity: 1, duration: 0.5 }),
        onLeaveBack: () => gsap.to(".video-scroll-text h2", { opacity: 0, duration: 0.5 })
      });

      // Check if mobile
      const isMobile = window.innerWidth <= 768;

      // Initial state
      tl.set(mainCardRef.current, {
        scale: isMobile ? 7 : 4, // 7 for Mobile (Zoomed), 4 for Desktop (Original)
        zIndex: 100,
        transformOrigin: "center center",
      })
        .set(col1Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: -100,
        })
        .set(col3Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: 100,
        });

      // Animation
      tl.to(mainCardRef.current, {
        scale: 1,
        duration: 1,
        ease: "power2.inOut",
      })
        .to([col1Ref.current, col3Ref.current], {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          duration: 1.1,
          ease: "power2.out",
        }, "<+0.2")
        // Exit animation
        .to(gridRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, ">+0.5");

    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
      {/* Dynamic Text Overlay - Fixed Center */}
      <div className="video-scroll-text">
        <h2>{phrases[activePhrase]}</h2>
      </div>

      <div className="video-grid" ref={gridRef}>
        {columns.map((columnVideos, index) => (
          <div
            className={`video-column ${index === 1 ? "video-reverse" : ""}`}
            key={index}
            ref={colRefs[index]}
          >
            <div className="video-cards">
              {columnVideos.map((src, i) => {
                // User specified index 2 for main card in middle column
                const isMainCard = index === 1 && i === 2;

                return (
                  <div
                    className="video-card"
                    key={i}
                    ref={isMainCard ? mainCardRef : null}
                    style={isMainCard ? { zIndex: 10 } : {}}
                  >
                    <LazyVideo src={src} eager={isMainCard} appLoaded={appLoaded} muted loop autoPlay playsInline />
                  </div>
                );
              })}
              {/* Duplicates for infinite scroll */}
              {columnVideos.map((src, i) => (
                <div className="video-card" key={`dup-${i}`}>
                  <LazyVideo src={src} appLoaded={appLoaded} muted loop autoPlay playsInline />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
