import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// EU flag has 12 stars arranged in a circle
const EU_STARS = 12;

// Calculate star positions in a circle (EU flag layout)
const getEUStarPositions = (centerX: number, centerY: number, radius: number) => {
  const positions = [];
  for (let i = 0; i < EU_STARS; i++) {
    const angle = (i * 2 * Math.PI) / EU_STARS - Math.PI / 2; // Start from top
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  return positions;
};

// Generate random initial positions
const getRandomPosition = (width: number, height: number) => ({
  x: Math.random() * width,
  y: Math.random() * height,
});

export default function EUStarAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Call all hooks at the top level - fixed order, no conditions
  const control0 = useAnimation();
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();
  const control6 = useAnimation();
  const control7 = useAnimation();
  const control8 = useAnimation();
  const control9 = useAnimation();
  const control10 = useAnimation();
  const control11 = useAnimation();

  // Create array from the controls
  const controls = [
    control0, control1, control2, control3,
    control4, control5, control6, control7,
    control8, control9, control10, control11
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Calculate circle parameters for EU flag
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    const finalPositions = getEUStarPositions(centerX, centerY, radius);

    // Animation sequence
    const animate = async () => {
      // Initial scatter
      await Promise.all(
        controls.map((control, i) => {
          const randomPos = getRandomPosition(width, height);
          return control.start({
            x: randomPos.x,
            y: randomPos.y,
            scale: 0,
            opacity: 0,
            rotate: Math.random() * 360,
          });
        })
      );

      // Fade in and move to positions
      await Promise.all(
        controls.map((control, i) =>
          control.start({
            x: finalPositions[i].x,
            y: finalPositions[i].y,
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
              duration: 2,
              delay: i * 0.1,
              ease: 'easeOut',
            },
          })
        )
      );

      // Breathing animation loop
      controls.forEach((control, i) => {
        control.start({
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
          transition: {
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          },
        });
      });

      // Scatter and reform every 20 seconds
      const intervalId = setInterval(async () => {
        // Scatter
        await Promise.all(
          controls.map((control) => {
            const randomPos = getRandomPosition(width, height);
            return control.start({
              x: randomPos.x,
              y: randomPos.y,
              scale: 0.5,
              opacity: 0.3,
              rotate: Math.random() * 360,
              transition: {
                duration: 1.5,
                ease: 'easeIn',
              },
            });
          })
        );

        // Reform
        await Promise.all(
          controls.map((control, i) =>
            control.start({
              x: finalPositions[i].x,
              y: finalPositions[i].y,
              scale: 1,
              opacity: 1,
              rotate: 0,
              transition: {
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut',
              },
            })
          )
        );

        // Resume breathing
        controls.forEach((control, i) => {
          control.start({
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
            transition: {
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            },
          });
        });
      }, 20000);

      // Cleanup function
      return () => clearInterval(intervalId);
    };

    const cleanup = animate();
    
    return () => {
      cleanup?.then(fn => fn?.());
    };
  }, []); // Empty dependency array since controls are stable

  // Five-pointed star SVG path
  const starPath = "M 0,-20 L 5.88,-6.18 L 19.02,-6.18 L 9.51,2.94 L 14.27,16.18 L 0,7.06 L -14.27,16.18 L -9.51,2.94 L -19.02,-6.18 L -5.88,-6.18 Z";

  return (
    <div ref={containerRef} className="absolute inset-0 bg-eu-blue overflow-hidden">
      <svg className="w-full h-full">
        {controls.map((control, i) => (
          <motion.g key={i} animate={control}>
            <motion.path
              d={starPath}
              fill="#FFCC00"
              stroke="#FFCC00"
              strokeWidth="5"
              opacity={100}
              filter="drop-shadow(0 0 10px rgba(255, 204, 0, 0.5))"
            />
          </motion.g>
        ))}
      </svg>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}