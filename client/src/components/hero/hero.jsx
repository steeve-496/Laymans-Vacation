import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import BlurText from "../BlurText.jsx";
import { getOptimizedUrl, getResponsiveSrcSet } from "../../utils/imageOptimizer";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);


function Hero() {
  const heroRef = useRef(null);


  const bgImageUrl = "https://ik.imagekit.io/tsxbvz4jb6/Laymans/background4k.webp";

  const handleExploreClick = () => {
    // Testing native scroll to see if GSAP is the cause of the delay
    const destinationsSection = document.getElementById("destinations");
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(() => {
    const entryTl = gsap.timeline();
    entryTl.fromTo(".hero-subtitle", {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.5 // Moved delay here to keep timing
    })
      .fromTo(".hero-btn", {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 769px)",
      isMobile: "(max-width: 768px)"
    }, (context) => {
      const { isDesktop } = context.conditions;

      // Shared visibility logic: Promote image layer on scroll
      gsap.to(".hero-bg-image", {
        zIndex: 999,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "15% top",
          toggleActions: "play none none reverse",
        }
      });

      // DISTINCT PHYSICS: Tailored for each viewport
      if (isDesktop) {
        // Desktop: Deep architectural lift
        gsap.fromTo(".hero-bg-image img",
          { scale: 1, y: 0 },
          {
            y: -220,
            scale: 1.8,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: true,
              pinSpacing: false,
            }
          }
        );
      } else {
        // Mobile: High-immersion zoom & drift
        gsap.fromTo(".hero-bg-image img",
          { scale: 1, y: 0, },
          {
            y: -180, // Dynamic lift to cross the text line
            scale: 2.8,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: true,
              pinSpacing: false,
            }
          }
        );
      }
    });
  }, { scope: heroRef });


  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <section className="hero-section" ref={heroRef} id="hero">
      <div className="hero-bg-image">
        <img
          src={getOptimizedUrl(bgImageUrl, 1920)}
          srcSet={getResponsiveSrcSet(bgImageUrl)}
          sizes="100vw"
          alt="hero background"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          <BlurText
            text="The Layman’s Vacation"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-2xl mb-8"
          /></h1>
        <p className="hero-subtitle">
          Every Journey is a Story. Start Your Next Chapter.
        </p>

        <button className="hero-btn" onClick={handleExploreClick}>
          Explore
          <div className="hero-btn-icon">
            <svg height="24" width="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
              />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Hero;
