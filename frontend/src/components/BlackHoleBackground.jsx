import React, { useEffect, useRef } from 'react';

const BlackHoleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 1500;
    
    // Black hole parameters
    const getR = () => Math.min(width, height) * 0.15; // Event horizon radius

    class Particle {
      constructor() {
        this.reset();
        // Randomize initial angle and distance heavily to fill the space
        this.angle = Math.random() * Math.PI * 2;
        this.radius = getR() + Math.random() * getR() * 4;
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        // Start far away and spiral in
        this.radius = getR() * 2 + Math.random() * getR() * 4;
        this.speed = 0.002 + Math.random() * 0.005;
        this.size = Math.random() * 2 + 0.5;
        
        // Color based on temperature (closer = hotter/whiter, further = cooler/orange/red)
        const rand = Math.random();
        if (rand < 0.2) this.color = 'rgba(255, 255, 255, 0.8)'; // White hot
        else if (rand < 0.6) this.color = 'rgba(255, 200, 100, 0.6)'; // Yellow/Orange
        else this.color = 'rgba(200, 80, 20, 0.4)'; // Red/Dark orange
      }

      update() {
        // Spiral inwards
        this.radius -= this.speed * 15;
        // Rotate faster as it gets closer (Conservation of angular momentum)
        const currentR = getR();
        const velocity = this.speed * (currentR * 3 / Math.max(this.radius, currentR * 0.5));
        this.angle += velocity;

        if (this.radius < currentR * 0.9) {
          this.reset(); // Reset if swallowed by the event horizon
        }
      }

      draw(ctx, cx, cy, isBackHalf) {
        // We simulate a 3D disk viewed from an angle
        // Z-axis is roughly sin(angle). 
        // If sin(angle) < 0, it's behind the black hole.
        // If sin(angle) > 0, it's in front.
        const isBehind = Math.sin(this.angle) < 0;
        
        if (isBehind !== isBackHalf) return; // Only draw for the current pass

        const tilt = 0.15; // Tilt of the accretion disk (0 = edge on, 1 = top down)
        const x = cx + Math.cos(this.angle) * this.radius;
        const y = cy + Math.sin(this.angle) * this.radius * tilt;

        // Calculate distance from camera (for size and opacity scaling)
        const z = Math.sin(this.angle) * this.radius;
        const scale = Math.max(0.01, (getR() * 4 + z) / (getR() * 4));
        
        ctx.beginPath();
        ctx.arc(x, y, this.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Add glow
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = this.color;
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawLensedRing = (cx, cy, r) => {
      // Simulate the gravitational lensing ring over the top of the black hole
      const gradient = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.1, 'rgba(255, 230, 150, 0.8)');
      gradient.addColorStop(0.3, 'rgba(220, 100, 30, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const render = () => {
      ctx.fillStyle = '#050505'; // Deep space background
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = getR();

      // Update particles
      particles.forEach(p => p.update());

      // 1. Draw back half of the accretion disk
      particles.forEach(p => p.draw(ctx, cx, cy, true));

      // 2. Draw the lensed halo (gravitational lensing of the disk behind the black hole)
      drawLensedRing(cx, cy, R);

      // 3. Draw Event Horizon (The black hole itself)
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Crisp edge for event horizon
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // 4. Draw front half of the accretion disk
      particles.forEach(p => p.draw(ctx, cx, cy, false));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BlackHoleBackground;
