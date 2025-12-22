import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./hero.css";
import BlurText from "../BlurText.jsx";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

import { optimizeCloudinaryUrl, getResponsiveSrcSet } from "../../utils/imageOptimizer";


function Hero() {
  const heroRef = useRef(null);


  const bgImageUrl = "https://res.cloudinary.com/divwmzd8g/image/upload/v1765451325/background4k_ruaeim.webp";

  const handleExploreClick = () => {
    gsap.to(window, {
      scrollTo: { y: "#destinations", offsetY: 0 },
      duration: 3,
      ease: "power2.inOut"
    });
  };

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const entryTl = gsap.timeline();
      entryTl.fromTo(".hero_subtitle", {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.5 // Moved delay here to keep timing
      })
        .fromTo(".hero_btn", {
          y: 30,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out"
        }, "-=0.8");

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        // Desktop Animation
        gsap.to(".bg_image", {
          zIndex: 999,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "10% top",
            toggleActions: "play none none reverse",
          }
        });

        gsap.fromTo(
          ".bg_image img",
          {
            scale: 1,
            y: 0
          },
          {
            y: -200,
            scale: 2,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: true,
              pinSpacing: false,
            },
          }
        );
      });

      mm.add("(max-width: 768px)", () => {
        // Mobile Animation - Increased Y movement and scale to overlap text
        gsap.to(".bg_image", {
          zIndex: 999,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "10% top",
            toggleActions: "play none none reverse",
          }
        });

        gsap.fromTo(
          ".bg_image img",
          {
            scale: 1.2, // Match CSS initial scale
            y: 0
          },
          {
            y: -160, // Increased to ensure overlap
            scale: 2, // Increased scale for dramatic effect
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: true,
              pinSpacing: false,
            },
          }
        );
      });

    });

    return () => ctx.revert();
  }, []);


  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <section className="hero_section" ref={heroRef} id="hero">
      <div className="bg_image">
        <img
          src={optimizeCloudinaryUrl(bgImageUrl, 1920)}
          srcSet={getResponsiveSrcSet(bgImageUrl)}
          sizes="100vw"
          alt="bg_image"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
      </div>

      <div className="hero_content">
        <h1 className="hero_title">
          <BlurText
            text="The Layman’s Vacation"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-2xl mb-8"
          /></h1>
        <p className="hero_subtitle">
          Every Journey is a Story. Start Your Next Chapter.
        </p>

        <button className="hero_btn" onClick={handleExploreClick}>
          Explore
          <div className="icon">
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
