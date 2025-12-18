import React, { useRef } from 'react';
import './footer.css';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fortawesome/fontawesome-free/css/all.min.css";


gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    useGSAP(() => {
        // --- Ambient Animations ---

        // Balloons bobbing
        const balloons = footerRef.current.querySelectorAll('.footer-balloon');
        balloons.forEach((balloon, i) => {
            gsap.to(balloon, {
                y: -30,
                rotation: i % 2 === 0 ? 3 : -3,
                duration: 5 + i,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: i * 0.5
            });
        });

        // Cloud Drift - Use Percentages to avoid VW overflow issues
        const clouds = footerRef.current.querySelectorAll('.footer-cloud-svg');
        clouds.forEach((cloud, i) => {
            gsap.fromTo(cloud,
                { x: i % 2 === 0 ? "-20%" : "120%" },
                {
                    x: i % 2 === 0 ? "120%" : "-20%",
                    duration: 40 + (i * 10),
                    ease: "none",
                    repeat: -1,
                }
            );
        });

        // --- Parallax & Entrance ---

        const hillBgWrap = footerRef.current.querySelector('.hill-bg-wrapper');
        const hillMdWrap = footerRef.current.querySelector('.hill-md-wrapper');
        const hillFgWrap = footerRef.current.querySelector('.hill-fg-wrapper');

        const hillBg = footerRef.current.querySelector('.hill-bg');
        const hillMd = footerRef.current.querySelector('.hill-md');
        const hillFg = footerRef.current.querySelector('.hill-fg');

        if (hillBgWrap && hillMdWrap && hillFgWrap) {

            // 1. Entrance Animation
            gsap.fromTo([hillBgWrap, hillMdWrap, hillFgWrap],
                { y: 300, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "back.out(1.0)",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                    }
                }
            );

            // 2. Parallax Scrub (Subtle)
            // Background moves DOWN slightly
            gsap.to(hillBg, {
                y: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0
                }
            });

            gsap.to(hillMd, {
                y: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0
                }
            });
        }

        // Tree Sway (Wind Breeze)
        const trees = footerRef.current.querySelectorAll('.footer-tree-sway');
        trees.forEach((tree, i) => {
            gsap.to(tree, {
                rotation: 4,
                transformOrigin: "0 0", // Pivot exactly at the trunk base (which is now 0,0 locally)
                duration: 3 + (i * 0.5),
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: i * 0.2
            });
        });



        // --- SCROLL SCRUB ANIMATION (Wind Accelerates/Shifts on Scroll) ---
        // "Enter and Leave" scrubbing
        gsap.to(".wind-traverse, .local-traverse", {
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom", // When top of footer hits bottom of viewport
                end: "bottom top",   // When bottom of footer hits top of viewport
                scrub: 1.5,          // Smooth scrubbing
            },
            x: "+=200", // Shift everything rightward by 200px over the scroll duration
            ease: "none"
        });

        // Parallax Scrub for Hills (Subtle depth)
        gsap.to(".hill-bg-wrapper", {
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },
            y: "+=50", // Hills move slower vertically
            ease: "none"
        });


    }, { scope: footerRef });

    // --- REUSABLE COMPONENT: Detailed Tree (User Provided) ---
    const OutlinedTree = ({ x, y, scale = 1 }) => (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>

            {/* STATIC TRUNK - NOT ANIMATED */}
            <g transform="translate(-108, -190)">
                <path style={{ fill: '#4e3718', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.66743, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 104.12934,174.08587 -0.31616,12.09737 10.82864,0.30244 0.23712,-13.83638 -4.58439,-2.87312 z" id="path31" />
            </g>

            {/* ANIMATED CANOPY - ROTATES AROUND TRUNK TOP */}
            {/* Trunk Top/Rotation Pivot is roughly at (108, 174) in local coords, which maps to (0, -16) relative to base (0,0) */}
            <g className="footer-tree-sway" style={{ transformOrigin: "0px -15px" }}>
                <g id="layer1" transform="translate(-108, -190)">
                    {/* LEAVES AND BRANCHES */}
                    <path style={{ fill: '#298729', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.09834, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 75.638273,137.95437 c -5.207192,4.90717 -10.228363,10.05324 -16.570225,14.86901 -5.149577,3.61401 -10.622076,7.47647 -18.128844,9.74159 l 0.237121,0.90731 2.647879,1.7768 c 11.704692,5.77551 19.653208,4.32485 27.901535,-1.02072 l 0.483459,0.11617 c -2.606133,3.2954 -4.508723,6.9579 -8.150446,9.71295 l -0.03957,0.94511 c -0.534709,1.16212 5.688464,-0.1 8.536443,-0.15121 8.402161,-2.09519 12.773355,-3.64077 17.112407,-5.93528 -0.472706,4.28358 -3.258228,9.85986 -3.873014,11.37909 -0.293329,0.80886 0.504197,0.72332 0.871993,0.99011 5.629661,-0.51686 10.769438,-2.12926 15.416559,-3.88654 3.31611,-1.25397 5.31322,-2.52905 7.06812,-4.58883 1.53698,1.36913 3.13748,2.3736 4.77974,3.13844 2.716,1.35756 5.15227,2.17991 7.4478,2.73303 5.89091,1.14359 6.89077,0.96156 6.50522,0.40405 1.43253,-0.16317 -0.40154,-2.26072 -0.95323,-3.59889 -0.80761,-2.61446 -1.4664,-4.52017 -1.41801,-7.51556 10.26037,7.24808 28.30601,6.94214 26.72437,5.74406 1.51882,-0.31018 2.11106,-0.97418 0.90051,-1.5856 -4.19432,-2.94635 -7.99075,-5.97593 -11.3424,-9.82911 5.77725,3.37769 9.66534,4.50509 15.3311,4.7196 3.14786,0.11917 7.33361,0.0753 11.66708,-0.92135 3.39809,-0.78147 6.59557,-2.55652 4.93444,-2.73973 l -23.39617,-14.21442 -9.91968,-11.56813 c 8.16127,-0.35522 13.63848,1.883 17.8238,6.65357 -0.20006,0.19589 0.69617,0.70358 0.47068,-0.46595 -1.0329,-5.35716 -3.78478,-11.04129 -8.46063,-17.25395 -1.65724,-2.20194 -4.66136,-4.58739 -8.13446,-7.00411 l -10.11727,-11.79495 13.91125,3.02434 -7.27179,-16.633893 -14.8685,-16.872899 c 5.43968,0.317426 12.43043,-0.719767 11.37151,-2.038426 -12.40993,-6.525264 -13.52097,-13.272409 -18.95748,-20.117581 7.14693,1.009931 10.333,7.364531 10.11528,4.400963 0.43167,-2.654724 -7.09382,-9.384123 -11.35796,-14.126625 -3.8219,-3.911393 -5.92557,-15.859484 -7.85268,-13.535054 -1.52859,7.540159 -5.5237,12.519324 -9.551578,16.962277 -2.821656,2.577413 -5.665388,5.218122 -8.180762,9.016326 -0.285509,0.721982 -1.070618,1.794418 -0.652083,2.022521 0.352959,1.026974 1.763513,-0.374065 3.141879,-1.701188 l 6.36282,-2.570689 c 3.466574,-0.663974 -6.355419,15.627762 -18.218995,19.658223 0.6205,2.266318 10.360703,4.533162 14.227409,1.814607 -4.54744,2.48257 -5.232899,5.545056 -7.290823,8.587449 -3.822439,5.651053 -9.662862,11.083943 -12.785632,14.851219 -2.163021,2.14049 -2.802466,3.63323 -4.124821,5.41631 -0.194157,1.63289 -2.627186,7.57302 -0.420048,5.62255 15.565801,-4.6785 9.02387,-2.62109 13.555566,-3.47799 -4.596236,6.55594 -11.226225,12.07687 -16.389604,16.734 -4.89742,5.88562 -9.67017,9.43052 -12.458089,19.93394 0.529252,-0.12125 0.996454,0.18169 1.392796,-0.1428 6.890781,-5.64131 12.701157,-6.33218 18.999205,-6.94852 0.551281,-0.054 0.471519,0.42107 0.946785,0.36438 z" id="path1" />
                    <path style={{ fill: '#298729', fillOpacity: 1, stroke: '#000000', strokeWidth: 0.756889, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 102.27648,60.768228 c -0.0212,2.59528 -0.19254,5.560786 -1.07152,7.573452 2.74768,-0.830455 3.7705,-2.894049 5.54276,-5.114137 1.27906,1.234167 1.85909,2.510318 2.00043,3.512043 0.13281,0.94111 -0.12159,1.640001 -0.54727,1.834292 0.26597,-0.101845 0.50063,-0.250209 0.71108,-0.437711 1.23786,-1.102889 1.63793,-3.559981 2.64235,-5.870965 l 0.33534,-0.534634" id="path14" />
                    <path style={{ fill: 'none', fillOpacity: 1, stroke: '#000000', strokeWidth: 0.75689, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 99.03446,84.4991 c -0.24031,3.791191 -2.572862,7.127522 -6.086168,10.207162 3.491241,-0.325786 6.068619,-1.975857 8.387968,-3.562776 0.90606,-1.016231 -0.11498,-2.20868 -0.0887,-3.393214 0.83786,3.587098 0.41795,7.386527 3.55684,10.585201 0.21175,-3.272278 2.73937,-6.518618 4.85029,-9.371669 1.99483,4.423728 5.84533,6.323777 8.98754,8.278038 -1.04708,-3.451034 -1.62432,-7.099503 -0.006,-10.550092" id="path15" />
                    <path style={{ fill: 'none', fillOpacity: 1, stroke: '#000000', strokeWidth: 0.75689, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 87.209439,112.56636 c 1.933312,8.22677 5.823805,12.89641 10.730977,15.71822 -3.055797,-5.08123 -2.104834,-10.28223 -0.447127,-15.50436 l -0.639387,1.73209 c 3.328728,6.44946 8.481968,7.66312 13.382438,9.60213 -2.51985,-4.04672 -1.80237,-8.40312 -1.45316,-12.72428 l -0.67068,3.52858 c 6.20845,3.75401 7.11948,8.60367 7.93645,13.47277 3.62691,-4.12676 5.35282,-9.41731 5.25372,-15.82515 v 4.06321 c 2.69839,2.6418 4.69143,5.52896 4.1359,9.30263 3.99435,-6.78699 2.70534,-9.30972 2.12384,-12.4035" id="path16" />
                    <path style={{ fill: 'none', fillOpacity: 1, stroke: '#000000', strokeWidth: 0.75689, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 86.679012,144.69311 c -1.82277,3.63186 -1.142909,7.52972 -0.33534,11.44116 3.718797,-5.90381 6.672628,-6.68535 9.836734,-8.87492" id="path17" />
                    <path style={{ fill: 'none', fillOpacity: 1, stroke: '#000000', strokeWidth: 0.75689, strokeDasharray: 'none', strokeOpacity: 1 }} d="m 113.54493,145.58196 c -0.15428,5.65753 2.80193,9.96262 7.27179,13.60955 -0.93936,-4.83925 -0.86633,-9.46796 3.00356,-13.30712 l -2.1341,3.09996 c 7.26258,2.31066 7.08846,5.98935 9.32684,9.22425 2.33336,-4.59109 1.26891,-9.87866 0.79042,-15.04612" id="path18" />
                </g>
            </g>
        </g>
    );

    return (
        <footer className="footer-section" ref={footerRef}>

            {/* Landscape Background */}
            <div className="footer-landscape">



                {/* Clouds */}
                <div className="footer-cloud-svg cloud-1">
                    <svg viewBox="0 0 120 60" fill="none" stroke="#2D2438" strokeWidth="2">
                        <path d="M15,40 C15,25 40,25 40,35 C40,20 70,20 70,35 C70,25 95,25 95,40 L15,40 Z" fill="#FFF" />
                    </svg>
                </div>
                <div className="footer-cloud-svg cloud-2">
                    <svg viewBox="0 0 120 60" fill="none" stroke="#2D2438" strokeWidth="2">
                        <path d="M15,40 C15,25 40,25 40,35 C40,20 70,20 70,35 C70,25 95,25 95,40 L15,40 Z" fill="#FFF" />
                    </svg>
                </div>

                <svg className="landscape-svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">

                    {/* --- TRAVERSING CLOUDS (Looping Left to Right) --- */}

                    {/* Cloud 1: Slow, High */}
                    <g className="wind-traverse slow">
                        <g transform="translate(100, 50) scale(1.2)">
                            <path d="M15,40 C15,25 40,25 40,35 C40,20 70,20 70,35 C70,25 95,25 95,40 L15,40 Z" fill="#FFFFFF" opacity="0.8" />
                        </g>
                    </g>

                    {/* Cloud 2: Mid, Offset */}
                    <g className="wind-traverse mid">
                        <g transform="translate(600, 80) scale(0.9)">
                            <path d="M15,40 C15,25 40,25 40,35 C40,20 70,20 70,35 C70,25 95,25 95,40 L15,40 Z" fill="#FFFFFF" opacity="0.6" />
                        </g>
                    </g>

                    {/* Cloud 3: Fast, Lower-ish */}
                    <g className="wind-traverse fast">
                        <g transform="translate(1100, 40) scale(1.0)">
                            <path d="M15,40 C15,25 40,25 40,35 C40,20 70,20 70,35 C70,25 95,25 95,40 L15,40 Z" fill="#FFFFFF" opacity="0.7" />
                        </g>
                    </g>


                    {/* USER PROVIDED WIND LINES (Traversing + CSS Animated) */}

                    {/* Back wind: slow traverse */}
                    <g className="wind-traverse slow">
                        <g className="parallax-slow" transform="translate(0, 200)">
                            <path className="wind-path flow slow" d="M10 50 Q60 20 110 50 T210 50" stroke="#2D2438" />
                        </g>
                    </g>

                    {/* Middle wind: mid traverse */}
                    <g className="wind-traverse mid">
                        <g className="parallax-mid" transform="translate(300, 350) scale(1.5)">
                            <path className="wind-path flow fast" d="M8 40 Q48 12 98 40 T198 40" stroke="#2D2438" />
                        </g>
                    </g>

                    {/* Front wind: fast traverse */}
                    <g className="wind-traverse fast">
                        <g className="parallax-fast" transform="translate(1400, 150) scale(1.2)"> {/* Start further right so it loops in */}
                            <path className="wind-path flow" d="M24 30 Q74 6 124 30 T224 30" stroke="#2D2438" />
                        </g>
                    </g>

                    {/* --- LOCALIZED WIND (Static Position, Flow Animation) --- */}

                    {/* Left Tree Wind (Low Left) */}
                    <g className="wind-local" transform="translate(50, 480) scale(1.1) rotate(-2)">
                        <g className="tree-traverse">
                            <path className="wind-path flow" d="M10 50 Q60 20 110 50 T210 50" stroke="#2D2438" opacity="0.7" />
                        </g>
                    </g>

                    {/* Right Tree Wind (Low Right) */}
                    <g className="wind-local" transform="translate(1200, 520) scale(1.2) rotate(2)">
                        <g className="tree-traverse">
                            <path className="wind-path flow fast" d="M8 40 Q48 12 98 40 T198 40" stroke="#2D2438" opacity="0.7" />
                        </g>
                    </g>



                    <g className="hill-bg-wrapper">
                        <g className="hill-bg">
                            <path
                                d="M-10,380 C300,350 700,420 1000,380 C1200,350 1350,380 1450,360 L1450,650 L-10,650 Z"
                                fill="#F7E1D7"
                                stroke="#2D2438"
                                strokeWidth="2"
                            />
                            {/* Trees sit on the curve */}
                            <OutlinedTree x="1200" y="395" scale="0.7" />
                            <OutlinedTree x="200" y="385" scale="0.6" />
                        </g>
                    </g>

                    {/* Middle Layer (LOWERED) */}
                    <g className="hill-md-wrapper">
                        <g className="hill-md">
                            <path
                                d="M-10,480 C200,440 500,400 900,450 C1200,500 1350,420 1450,450 L1450,650 L-10,650 Z"
                                fill="#F2D0A9"
                                stroke="#2D2438"
                                strokeWidth="2"
                            />
                            <OutlinedTree x="100" y="475" scale="1.0" />
                            <OutlinedTree x="800" y="475" scale="1.1" />
                        </g>
                    </g>

                    {/* Foreground Layer (LOWERED - Bottom Edge) */}
                    <g className="hill-fg-wrapper">
                        <g className="hill-fg">
                            <path
                                d="M-10,650 L-10,550 C300,520 700,580 1100,540 C1300,520 1400,540 1450,550 L1450,650 Z"
                                fill="#E6C2BF"
                                stroke="#2D2438"
                                strokeWidth="2"
                            />
                            {/* Road leading out */}
                            <path
                                d="M900,560 C900,560 850,580 750,650 L1050,650 C1100,620 1000,580 900,560"
                                fill="#5D4E6D"
                                opacity="0.8"
                            />
                            {/* Foreground Trees - Bigger */}
                            <OutlinedTree x="40" y="575" scale="1.5" />
                            <OutlinedTree x="1350" y="565" scale="1.4" />
                        </g>
                    </g>
                </svg>

                {/* Balloons - Moved HIGHER to avoid overlapping text */}
                <div className="footer-balloon balloon-1">
                    <svg viewBox="0 0 100 140" fill="none" stroke="#2D2438" strokeWidth="2">
                        <path d="M50,2 C80,2 98,25 98,55 C98,85 75,100 60,105 L60,115 L40,115 L40,105 C25,100 2,85 2,55 C2,25 20,2 50,2 Z" fill="#FFC857" />
                        <rect x="35" y="118" width="30" height="18" rx="2" fill="#5D4E6D" />
                    </svg>
                </div>
                <div className="footer-balloon balloon-2">
                    <svg viewBox="0 0 100 140" fill="none" stroke="#2D2438" strokeWidth="2">
                        <path d="M50,2 C80,2 98,25 98,55 C98,85 75,100 60,105 L60,115 L40,115 L40,105 C25,100 2,85 2,55 C2,25 20,2 50,2 Z" fill="#99D5C9" />
                        <rect x="35" y="118" width="30" height="18" rx="2" fill="#5D4E6D" />
                    </svg>
                </div>

                {/* DOM-BASED LOCALIZED WIND (Layered: Over & Behind) */}

                {/* BALLOON 1 WIND (Left) */}
                {/* Back Layer (Behind Balloon) - Traverse */}
                <div className="local-traverse" style={{ position: 'absolute', top: '10%', left: '10%', width: '150px', zIndex: 1, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 150 60">
                        <path className="wind-path flow slow" d="M10 30 Q75 5 140 30" stroke="#2D2438" opacity="0.4" fill="none" />
                    </svg>
                </div>
                {/* Front Layer (Over Balloon) - Traverse */}
                <div className="local-traverse delayed" style={{ position: 'absolute', top: '15%', left: '10%', width: '150px', zIndex: 5, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 150 60">
                        <path className="wind-path flow fast" d="M10 40 Q75 15 140 40" stroke="#2D2438" opacity="0.7" fill="none" />
                    </svg>
                </div>

                {/* BALLOON 2 WIND (Right) */}
                {/* Back Layer */}
                <div className="local-traverse delayed" style={{ position: 'absolute', top: '20%', right: '14%', width: '140px', zIndex: 1, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 140 60">
                        <path className="wind-path flow" d="M10 30 Q70 10 130 30" stroke="#2D2438" opacity="0.4" fill="none" />
                    </svg>
                </div>
                {/* Front Layer */}
                <div className="local-traverse" style={{ position: 'absolute', top: '25%', right: '14%', width: '140px', zIndex: 5, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 140 60">
                        <path className="wind-path flow fast" d="M10 40 Q70 20 130 40" stroke="#2D2438" opacity="0.7" fill="none" />
                    </svg>
                </div>
            </div>

            <div className="footer-container">
                {/* CTA Header - Added more padding bottom to clear it from hills if necessary */}
                <div className="footer-cta" style={{ marginBottom: '60px' }}>
                    <h2>Ready for your next <span className="highlight-text">Adventure?</span></h2>
                    <p>Explore the world with Layman.</p>
                </div>

                <div className="footer-content">
                    {/* Content is Z-indexed above, but visually we want it 'in the sky' area */}
                    <div className="footer-col footer-brand">
                        <h2>Layman</h2>
                        <ul className="footer-links-list">
                            <li><a href="#" className="footer-link">Who We Are</a></li>
                            <li><a href="#" className="footer-link">Travel Philosophy</a></li>
                            <li><a href="#" className="footer-link">Sustainability</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Destinations</h3>
                        <ul className="footer-links-list">
                            <li><a href="#" className="footer-link">Europe</a></li>
                            <li><a href="#" className="footer-link">Asia</a></li>
                            <li><a href="#" className="footer-link">The Americas</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Packages</h3>
                        <ul className="footer-links-list">
                            <li><a href="#" className="footer-link">Family Tours</a></li>
                            <li><a href="#" className="footer-link">Solo Adventures</a></li>
                            <li><a href="#" className="footer-link">Honeymoons</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Follow Us</h3>
                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-links">
                    <a href="#" className="footer-bottom-link">@{new Date().getFullYear()} Layman</a>
                    <a href="#" className="footer-bottom-link">Privacy Policy</a>
                </div>
                <div className="footer-bottom-links">
                    <a href="#" className="footer-bottom-link">Back to Top ↑</a>
                </div>
            </div>
        </footer>
    );
}
