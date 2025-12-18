import React, { useRef, useEffect } from 'react';

const Stars = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let stars = [];
        let galaxies = [];
        let shootingStars = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initCelestialObjects();
        };

        const initCelestialObjects = () => {
            // Init Stars
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 4000);
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    decreasing: Math.random() > 0.5,
                    speed: Math.random() * 0.02 + 0.005
                });
            }

            // Init Galaxies (Nebulae)
            galaxies = [];
            const numGalaxies = 5;
            const colors = [
                'rgba(75, 0, 130, 0.12)', // Indigo
                'rgba(138, 43, 226, 0.08)', // BlueViolet
                'rgba(0, 0, 139, 0.12)',   // DarkBlue
                'rgba(255, 20, 147, 0.06)', // DeepPink
                'rgba(65, 105, 225, 0.08)' // RoyalBlue
            ];

            for (let i = 0; i < numGalaxies; i++) {
                galaxies.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 400 + 200,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const createShootingStar = () => {
            // Start from somewhat outside or within view
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height / 2); // Mostly upper half
            const length = Math.random() * 100 + 50;
            const angle = Math.PI / 4 + (Math.random() * 0.4 - 0.2); // ~45 degrees diagonal
            const speed = Math.random() * 15 + 10;

            shootingStars.push({
                x: startX,
                y: startY,
                length: length,
                speed: speed,
                angle: angle,
                life: 1.0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Galaxies
            galaxies.forEach(galaxy => {
                const gradient = ctx.createRadialGradient(galaxy.x, galaxy.y, 0, galaxy.x, galaxy.y, galaxy.radius);
                gradient.addColorStop(0, galaxy.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(galaxy.x, galaxy.y, galaxy.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Stars
            stars.forEach(star => {
                if (star.decreasing) {
                    star.alpha -= star.speed;
                    if (star.alpha <= 0.1) {
                        star.decreasing = false;
                    }
                } else {
                    star.alpha += star.speed;
                    if (star.alpha >= 1) {
                        star.decreasing = true;
                    }
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });

            // Manage Shooting Stars
            // Random spawn
            if (Math.random() < 0.02) { // 2% chance per frame
                createShootingStar();
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];

                ss.x += ss.vx;
                ss.y += ss.vy;
                ss.life -= 0.02;

                if (ss.life <= 0 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                // Draw trail
                const endX = ss.x - Math.cos(ss.angle) * ss.length;
                const endY = ss.y - Math.sin(ss.angle) * ss.length;

                const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                ctx.lineWidth = 2;
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Optional: Head of the star
                ctx.fillStyle = `rgba(255, 255, 255, ${ss.life})`;
                ctx.beginPath();
                ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="stars-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};

export default Stars;
