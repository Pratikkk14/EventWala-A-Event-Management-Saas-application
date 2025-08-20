import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    mouse: THREE.Vector2;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const mouse = new THREE.Vector2();

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0x1E1E24, 1); // Dark background for better effect

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#6366f1'); // indigo-500
    const color2 = new THREE.Color('#a5b4fc'); // indigo-300

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    sceneRef.current = { scene, camera, renderer, particles, mouse };

    // Resize handler
    const onWindowResize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Mouse move handler
    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.0001;

      particles.rotation.y = time * 0.5;

      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    // Initial setup
    onWindowResize();
    animate();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onMouseMove);
      
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1E1E24 0%, #2D1B69 50%, #1E1E24 100%)' }}
      />
    </div>
  );
};

export default StarryBackground;