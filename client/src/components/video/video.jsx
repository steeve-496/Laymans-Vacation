import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import "./video.css";

gsap.registerPlugin(ScrollTrigger);

const optimizeUrl = (url) => {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_720/");
};

const isYouTube = (url) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};



const LazyVideo = ({ src, eager = false, ...props }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [eager]);

  const renderContent = () => {
    if (isYouTube(src)) {
      const videoId = getYouTubeId(src);
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
            transform: "scale(1.5)",
            transformOrigin: "center center"
          }}
        ></iframe>
      );
    }

    return (
      <video
        src={optimizeUrl(src)}
        {...props}
      />
    );
  };

  return (
    <div ref={videoRef} className="video-placeholder" style={{ width: '100%', height: '100%' }}>
      {isVisible && renderContent()}
    </div>
  );
};

export default function Video() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const mainCardRef = useRef(null);

  const videos = [
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571911/azerbaijan_auzxnj.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571875/bali_cfkchr.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571885/bhutan_x3nljx.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571844/dubai_tbxlb4.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571863/kazaksthan_jaj7ej.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571838/veitnam_pq4qqf.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571876/malaysia_bf3wum.mp4",
    "https://youtu.be/alBym_D6Ni4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571867/singapore_v98wpc.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571888/srilanka_nmvfom.mp4",
    "https://res.cloudinary.com/divwmzd8g/video/upload/v1764571914/thailand_avuka1.mp4",
  ];

  const col1 = videos.filter((_, i) => i % 3 === 0);
  const col2 = videos.filter((_, i) => i % 3 === 1);
  const col3 = videos.filter((_, i) => i % 3 === 2);

  const columns = [col1, col2, col3];
  const colRefs = [col1Ref, col2Ref, col3Ref];

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      // Initial state
      tl.set(mainCardRef.current, {
        scale: 4, // Increased scale
        zIndex: 100,
        transformOrigin: "center center",
      })
        .set(col1Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: -100, // Start diverged left
        })
        .set(col3Ref.current, {
          opacity: 0,
          scale: 0.8,
          xPercent: 100, // Start diverged right
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
          xPercent: 0, // Converge to center
          duration: 1.1,
          ease: "power2.out",
        }, "<+0.2")
        // Exit animation (Shrink and Fade out at the end of scroll)
        .to(gridRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, ">+0.5"); // Start after convergence is done

    },
    { scope: containerRef }
  );

  return (
    <div className="video-page-container" ref={containerRef}>
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
                    <LazyVideo src={src} eager={isMainCard} muted loop autoPlay playsInline />
                  </div>
                );
              })}
              {/* Duplicates for infinite scroll */}
              {columnVideos.map((src, i) => (
                <div className="video-card" key={`dup-${i}`}>
                  <LazyVideo src={src} muted loop autoPlay playsInline />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}